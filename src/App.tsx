import { useMemo, useState } from 'react'
import { CountrySelect } from './components/CountrySelect'
import { COUNTRY_OPTIONS } from './lib/countries'
import {
  adjustedLifeExpectancy,
  remainingYears,
  type Sex,
} from './lib/estimate'
import { formatUnitValue, UNITS, type UnitId } from './lib/units'

const MAX_AGE = 120

function clampAge(n: number): number {
  if (!Number.isFinite(n)) return 0
  return Math.min(MAX_AGE, Math.max(0, n))
}

export default function App() {
  const [ageInput, setAgeInput] = useState('32')
  const [countryIso3, setCountryIso3] = useState<string | null>('USA')
  const [sex, setSex] = useState<Sex>('average')
  const [unitId, setUnitId] = useState<UnitId>('years')

  const age = clampAge(parseFloat(ageInput.replace(',', '.')))

  const country = useMemo(
    () => COUNTRY_OPTIONS.find((c) => c.iso3 === countryIso3) ?? null,
    [countryIso3],
  )

  const combinedLe = country?.lifeExpectancyBirth ?? 0
  const expectancy = adjustedLifeExpectancy(combinedLe, sex)
  const yearsLeft = remainingYears(age, expectancy)
  const unit = UNITS.find((u) => u.id === unitId) ?? UNITS[0]
  const unitValue = unit.compute(yearsLeft)

  const formValid =
    country &&
    ageInput.trim() !== '' &&
    Number.isFinite(parseFloat(ageInput.replace(',', '.')))

  return (
    <div className="app">
      <header className="hero">
        <p className="eyebrow">Statistical curiosity, not a prediction</p>
        <h1 className="title">Life horizon</h1>
        <p className="subtitle">
          Compare your age to national life expectancy (World Bank, 2022), then
          explore the same remaining span in different units.
        </p>
      </header>

      <main className="grid">
        <section className="card card-form">
          <h2 className="card-title">About you</h2>
          <div className="fields">
            <div className="field">
              <label className="field-label" htmlFor="age">
                Age (years)
              </label>
              <input
                id="age"
                className="field-input"
                inputMode="decimal"
                type="text"
                value={ageInput}
                onChange={(e) => setAgeInput(e.target.value)}
              />
            </div>

            <CountrySelect
              options={COUNTRY_OPTIONS}
              valueIso3={countryIso3}
              onChange={setCountryIso3}
            />

            <fieldset className="field sex-field">
              <legend className="field-label">Sex (adjusts estimate)</legend>
              <div className="sex-chips" role="radiogroup" aria-label="Sex">
                {(
                  [
                    ['average', 'Population average'],
                    ['female', 'Female'],
                    ['male', 'Male'],
                  ] as const
                ).map(([value, label]) => (
                  <label key={value} className="chip">
                    <input
                      type="radio"
                      name="sex"
                      value={value}
                      checked={sex === value}
                      onChange={() => setSex(value)}
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>

          {formValid && country && (
            <dl className="meta-strip">
              <div>
                <dt>Life expectancy at birth</dt>
                <dd>
                  {combinedLe.toFixed(1)} yr
                  <span className="muted"> (WB combined)</span>
                </dd>
              </div>
              <div>
                <dt>Adjusted for your selection</dt>
                <dd>{expectancy.toFixed(1)} yr</dd>
              </div>
              <div>
                <dt>Years remaining (estimate)</dt>
                <dd className="accent">{yearsLeft.toFixed(2)} yr</dd>
              </div>
            </dl>
          )}
        </section>

        <section className="card card-result">
          <h2 className="card-title">Same horizon, different measure</h2>
          <p className="hint">
            Tap a unit to reframe the same estimated time span.
          </p>

          <div className="unit-tabs" role="tablist" aria-label="Time unit">
            {UNITS.map((u) => (
              <button
                key={u.id}
                type="button"
                role="tab"
                aria-selected={unitId === u.id}
                className={unitId === u.id ? 'unit-tab unit-tab-on' : 'unit-tab'}
                onClick={() => setUnitId(u.id)}
              >
                {u.label}
              </button>
            ))}
          </div>

          <div className="readout" aria-live="polite">
            {formValid ? (
              <>
                <p className="readout-label">{unit.label}</p>
                <p className="readout-value">
                  {formatUnitValue(unitValue, unit.decimals)}
                </p>
                <p className="readout-note">
                  Based on ~{yearsLeft.toFixed(3)} estimated years remaining.
                </p>
              </>
            ) : (
              <p className="readout-placeholder">
                Enter a valid age and choose a country to see the readout.
              </p>
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>
          Life expectancy values are from the World Bank indicator
          SP.DYN.LE00.IN (2022). Regional aggregates and non-standard codes are
          excluded; sex split is a simple ±{2.3}
          year adjustment around the published combined figure (not
          country-specific vital statistics).
        </p>
      </footer>
    </div>
  )
}
