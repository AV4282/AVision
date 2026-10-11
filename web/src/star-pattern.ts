export async function createStarPattern(): Promise<string> {
  const response = await fetch(`${import.meta.env.BASE_URL}dark-stars.svg`)
  if (!response.ok) throw new Error("Could not load star decoration")
  const svg = new DOMParser().parseFromString(await response.text(), "image/svg+xml")
  const positions: { x: number; y: number }[] = []

  for (const star of svg.querySelectorAll("circle, path")) {
    let x = 0
    let y = 0
    // Keep the scattered pattern airy, including across the repeating tile edges.
    for (let attempt = 0; attempt < 30; attempt++) {
      x = 12 + Math.random() * 936
      y = 12 + Math.random() * 736
      if (positions.every((point) => {
        const dx = Math.abs(point.x - x)
        const dy = Math.abs(point.y - y)
        return Math.hypot(Math.min(dx, 960 - dx), Math.min(dy, 760 - dy)) >= 36
      })) break
    }
    positions.push({ x, y })
    if (star.tagName === "circle") {
      star.setAttribute("cx", x.toFixed(1))
      star.setAttribute("cy", y.toFixed(1))
    } else {
      star.setAttribute("d", star.getAttribute("d")!.replace(/^M[\d.]+ [\d.]+/, `M${x.toFixed(1)} ${y.toFixed(1)}`))
    }
    const duration = 6 + Math.random() * 2
    const element = star as SVGElement
    element.style.animationDuration = `${duration.toFixed(2)}s`
    element.style.animationDelay = `${(-Math.random() * duration).toFixed(2)}s`
  }

  return `url("data:image/svg+xml,${encodeURIComponent(new XMLSerializer().serializeToString(svg.documentElement))}")`
}
