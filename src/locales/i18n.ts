import i18next from 'i18next'
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import viTransition from './transitions/vi.json'
import viError from './errors/vi.json'
import viValidation from './validations/vi.json'

import enTransition from './transitions/en.json'
import enError from './errors/en.json'
import enValidation from './validations/en.json'

export const defaultNS = 'translations'

i18next.use(initReactI18next).use(HttpApi).init({
  // the translations
  // (tip move them in a JSON file and import them,
  // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
  debug: true,
  fallbackLng: 'vi',
  defaultNS: 'translations',
  resources: {
    vi: {
      translations: viTransition,
      errors: viError,
      validations: viValidation
    },
    en: {
      translations: enTransition,
      errors: enError,
      validations: enValidation
    }
  },
  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json'
  }
})

export default i18next
