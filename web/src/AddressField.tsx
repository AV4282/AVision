import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react"
import { MapPin } from "lucide-react"
import { suggestAddresses, type AddressSuggestion } from "./geocode"

const MIN_LETTERS = 3 // shorter text matches half the city
const TYPING_PAUSE_MS = 250 // look up once the person pauses, not on every key

/**
 * The address box of the report form. While the person types, it lists matching
 * Atlanta addresses and places underneath. They can pick one with the mouse, a
 * tap, or the arrow keys and Enter, or ignore the list and keep their own words.
 */
export default function AddressField({
  value,
  onChange,
  onPick,
}: {
  value: string
  onChange: (text: string) => void
  /** Called as well as onChange when a suggestion is chosen, with its position. */
  onPick: (suggestion: AddressSuggestion) => void
}) {
  const listId = useId()
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1) // highlighted row, -1 for none
  const timer = useRef<number | undefined>(undefined)
  const lookup = useRef<AbortController | null>(null)
  const inputValue = useRef(value)

  function cancelLookup() {
    window.clearTimeout(timer.current)
    lookup.current?.abort()
    lookup.current = null
  }
  useEffect(() => cancelLookup, [])

  // A pin lookup can replace the text while a typed-address request is pending.
  useEffect(() => {
    if (value === inputValue.current) return
    inputValue.current = value
    cancelLookup()
    setSuggestions([])
    setOpen(false)
    setActive(-1)
  }, [value])

  function typed(text: string) {
    inputValue.current = text
    onChange(text)
    cancelLookup()
    setActive(-1)
    const search = text.trim()
    if (search.length < MIN_LETTERS) {
      setSuggestions([])
      setOpen(false)
      return
    }
    timer.current = window.setTimeout(async () => {
      const controller = new AbortController()
      lookup.current = controller
      const found = await suggestAddresses(search, controller.signal)
      if (controller.signal.aborted) return // the person typed more in the meantime
      setSuggestions(found)
      setOpen(found.length > 0)
    }, TYPING_PAUSE_MS)
  }

  function pick(suggestion: AddressSuggestion) {
    cancelLookup()
    inputValue.current = suggestion.label
    onChange(suggestion.label)
    onPick(suggestion)
    setSuggestions([])
    setOpen(false)
    setActive(-1)
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!open) return
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      const step = event.key === "ArrowDown" ? 1 : -1
      // Wraps around, with one stop on "no row" so the typed text stays an option.
      setActive((row) => ((row + 1 + step + suggestions.length + 1) % (suggestions.length + 1)) - 1)
    } else if (event.key === "Enter" && active >= 0) {
      event.preventDefault() // choose the row instead of posting the ticket
      pick(suggestions[active])
    } else if (event.key === "Escape") {
      event.stopPropagation() // close the list, not the whole form
      setOpen(false)
      setActive(-1)
    }
  }

  return (
    <div className="address-field">
      <input
        value={value}
        onChange={(event) => typed(event.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => setOpen(false)}
        onFocus={() => setOpen(suggestions.length > 0)}
        maxLength={200}
        placeholder="e.g. Courtland St SE & Gilmer St SE"
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
      />
      {open && (
        <ul id={listId} role="listbox" className="address-suggestions">
          {suggestions.map((suggestion, row) => (
            <li
              key={suggestion.label}
              id={`${listId}-${row}`}
              role="option"
              aria-selected={row === active}
              // mousedown, not click: it fires before the box loses focus and the list closes.
              onMouseDown={(event) => {
                event.preventDefault()
                pick(suggestion)
              }}
              onMouseEnter={() => setActive(row)}
            >
              <MapPin size={15} aria-hidden="true" />
              <span>
                <strong>{suggestion.primary}</strong>
                {suggestion.secondary && <small>{suggestion.secondary}</small>}
              </span>
            </li>
          ))}
        </ul>
      )}
      {/* Tells screen reader users that suggestions appeared. */}
      <span className="sr-only" role="status">
        {open
          ? `${suggestions.length} ${suggestions.length === 1 ? "suggestion" : "suggestions"}. Use the arrow keys to choose one.`
          : ""}
      </span>
    </div>
  )
}
