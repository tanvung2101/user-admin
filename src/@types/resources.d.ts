import enError from '../locales/errors/en.json';
import viError from '../locales/errors/vi.json';
import enTransition from '../locales/transitions/en.json';
import viTransition from '../locales/transitions/vi.json';
import enValidation from '../locales/validations/en.json';
import viValidation from '../locales/validations/vi.json';

const resources = {
  enError,
  viError,
  enTransition,
  viTransition,
  enValidation,
  viValidation
} as const;

export default resources;
