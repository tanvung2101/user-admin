import * as yup from 'yup'
import i18next from '../locales/i18n'

yup.setLocale({
    mixed: {
        required: i18next.t('validations:required'),
        default: ({ path }) => `${i18next.t(path)} ${i18next.t('validations:invalid')}`
    },
    string: {
        email: i18next.t('validations:email'),
        min: ({min}) => i18next.t('validations:minLength', {min}),
        max: ({max}) => i18next.t('validations:maxLength', {max}),
    },
    number: {
        min: ({min}) => i18next.t('validations:min', {min}),
        max: ({max}) => i18next.t('validations:max', {max}),
    },
})

export default yup