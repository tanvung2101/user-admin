// import the original type declarations
import 'i18next'
// import all namespaces (for the default language, only)
// import ns1 from "locales/en/ns1.json";
// import ns2 from "locales/en/ns2.json";
import viTransition from '../locales/transitions/vi.json'
import viError from '../locales/errors/vi.json'
import viValidations from '../locales/validations/vi.json'

import enTransition from '../locales/transitions/en.json'
import enError from '../locales/errors/en.json'
import enValidations from '../locales/validations/en.json'

declare module 'i18next' {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    // custom namespace type, if you changed it
    defaultNS: 'translations'
    // custom resources type
    resources: {
      viTransition: typeof viTransition
      viError: typeof viError
      viValidations: typeof viValidations
      enTransition: typeof enTransition
      enError: typeof enError
      enValidations: typeof enValidations
    }
    // other
  }
}
