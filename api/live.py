"""
Live updates: every open page hears about it the moment a ticket changes.

The page keeps one long request open to GET /events (server-sent events). When a
ticket is posted, voted on or deleted, main.py calls publish() and every open
page gets one small line, e.g. {"type": "ticket_changed", "id": "..."}. The page
then asks for that ticket the normal way, so what each person sees (their own
vote, whether the ticket is theirs) still comes from the usual, checked route.

Events only ever say which ticket and what kind of change. They never carry who
did it or anyone's ID, because everyone connected receives them.

This lives in the API's own memory, so it needs the API to run as ONE process
(the way deploy/avision-api.service starts it). With several worker processes,
a page connected to one worker would miss changes made through another.
"""

import asyncio
import json
import logging

log = logging.getLogger("uvicorn.error")

# How often a quiet connection gets a blank comment line. It keeps proxies from
# closing an idle connection and lets the server notice a page that has gone.
HEARTBEAT_SECONDS = 15
# A page that falls this many events behind is dropped; it reconnects on its own
# and reloads everything, which is cheaper than queueing without limit.
MAX_WAITING = 200
# Sent first, so the browser waits this long (ms) before reconnecting after a drop.
RETRY_MS = 3000

_CLOSE = object()  # put on a queue to end that page's stream


class Hub:
    def __init__(self):
        self._loop: asyncio.AbstractEventLoop | None = None
        self._queues: set[asyncio.Queue] = set()
        self._closing = False

    def start(self, loop: asyncio.AbstractEventLoop):
        """Called once at startup, from the server's event loop."""
        self._loop = loop
        self._closing = False

    def listeners(self) -> int:
        return len(self._queues)

    def publish(self, kind: str, ticket_id) -> None:
        """Tell every open page. Safe to call from any thread; never raises."""
        loop = self._loop
        if loop is None or self._closing:
            return
        line = json.dumps({"type": kind, "id": str(ticket_id)})
        try:
            loop.call_soon_threadsafe(self._send, line)
        except RuntimeError:  # the loop has already shut down
            pass

    def close(self) -> None:
        """End every stream, so the server can stop without waiting on open pages.

        Safe to call from a signal handler or another thread.
        """
        self._closing = True
        loop = self._loop
        if loop is not None:
            try:
                loop.call_soon_threadsafe(self._send, _CLOSE)
            except RuntimeError:
                pass

    def _send(self, item) -> None:
        for queue in list(self._queues):
            try:
                queue.put_nowait(item)
            except asyncio.QueueFull:
                # Too far behind to catch up. Dropping it ends its stream.
                self._queues.discard(queue)
                while not queue.empty():
                    queue.get_nowait()
                queue.put_nowait(_CLOSE)

    async def stream(self):
        """One page's event stream, as server-sent-event text."""
        if self._closing:
            return
        queue: asyncio.Queue = asyncio.Queue(maxsize=MAX_WAITING)
        self._queues.add(queue)
        try:
            yield f"retry: {RETRY_MS}\n\n"
            while True:
                try:
                    item = await asyncio.wait_for(queue.get(), timeout=HEARTBEAT_SECONDS)
                except asyncio.TimeoutError:
                    yield ": still here\n\n"
                    continue
                if item is _CLOSE:
                    return
                yield f"data: {item}\n\n"
        finally:
            self._queues.discard(queue)


hub = Hub()
publish = hub.publish
