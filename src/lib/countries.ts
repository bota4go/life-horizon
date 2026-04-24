import countries from 'i18n-iso-countries'
import type { LocaleData } from 'i18n-iso-countries'
import en from 'i18n-iso-countries/langs/en.json'
import wbRaw from '../data/wb-life-2022.json'

countries.registerLocale(en as LocaleData)

const wb = wbRaw as Record<string, number>
const validAlpha3 = new Set(Object.keys(countries.getAlpha3Codes()))

export type CountryOption = {
  iso3: string
  name: string
  lifeExpectancyBirth: number
}

export const COUNTRY_OPTIONS: CountryOption[] = Object.entries(wb)
  .filter(([iso3]) => validAlpha3.has(iso3))
  .map(([iso3, lifeExpectancyBirth]) => ({
    iso3,
    name: countries.getName(iso3, 'en') ?? iso3,
    lifeExpectancyBirth,
  }))
  .sort((a, b) => a.name.localeCompare(b.name))
