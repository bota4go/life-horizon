import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import type { CountryOption } from '../lib/countries'

type Props = {
  options: CountryOption[]
  valueIso3: string | null
  onChange: (iso3: string | null) => void
}

export function CountrySelect({ options, valueIso3, onChange }: Props) {
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  const selected = useMemo(
    () => options.find((c) => c.iso3 === valueIso3) ?? null,
    [options, valueIso3],
  )

  const inputValue = open ? query : (selected?.name ?? query)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return options.slice(0, 80)
    return options
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.iso3.toLowerCase().includes(q),
      )
      .slice(0, 120)
  }, [options, query])

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) close()
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [close])

  return (
    <div className="country-select" ref={rootRef}>
      <label className="field-label" htmlFor={listId}>
        Country or territory
      </label>
      <input
        ref={inputRef}
        id={listId}
        className="field-input"
        type="text"
        autoComplete="off"
        spellCheck={false}
        placeholder="Search by name…"
        value={inputValue}
        aria-expanded={open}
        aria-controls={`${listId}-panel`}
        onFocus={() => {
          setOpen(true)
          setQuery(selected?.name ?? '')
        }}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
          onChange(null)
        }}
      />
      {open && (
        <div
          id={`${listId}-panel`}
          className="country-panel"
          role="listbox"
        >
          {filtered.length === 0 ? (
            <div className="country-empty">No matches</div>
          ) : (
            filtered.map((c) => (
              <button
                key={c.iso3}
                type="button"
                role="option"
                aria-selected={c.iso3 === valueIso3}
                className={
                  c.iso3 === valueIso3
                    ? 'country-option country-option-active'
                    : 'country-option'
                }
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(c.iso3)
                  setQuery(c.name)
                  close()
                  inputRef.current?.blur()
                }}
              >
                <span className="country-option-name">{c.name}</span>
                <span className="country-option-meta">
                  {c.lifeExpectancyBirth.toFixed(1)} yr LE
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
