/**
 * Constants for Monitoring Cultureel Talent naar de Top
 * Centralized magic strings and values to improve maintainability
 */

const CONSTANTS = {
  // Answer values for radio buttons
  ANSWERS: {
    YES: 'Ja',
    NO: 'Nee',
    UNKNOWN: 'Weet niet'
  },

  // Session/auth related
  SESSION: {
    PUBLIC_CODE: 'PUBLIC',
    PUBLIC_NAME: 'Openbare toegang'
  },

  // Field names that trigger conditional sections
  // IDs match pattern: conditional-{fieldName} from build-survey-html.js
  CONDITIONAL_FIELDS: {
    streefcijfer: 'conditional-streefcijfer',
    definitie_afwijking: 'conditional-definitie_afwijking',
    heeft_rvb: 'conditional-heeft_rvb',
    heeft_rvc: 'conditional-heeft_rvc',
    heeft_rvt: 'conditional-heeft_rvt',
    beleid_samenstelling: 'conditional-beleid_samenstelling'
  },

  // Answer values that trigger conditional sections (non-"Ja" triggers)
  CONDITIONAL_VALUES: {
    beleid_samenstelling: 'anders'
  },

  // Required fields when conditional is triggered (for completion tracking)
  // Maps: parent field -> { triggerValue, requiredFields[] }
  CONDITIONAL_REQUIREMENTS: {
    streefcijfer: {
      triggerValue: 'Ja',
      requiredFields: ['streefcijfer_percentage', 'streefcijfer_jaar']
    },
    definitie_afwijking: {
      triggerValue: 'Ja',
      requiredFields: ['eigen_definitie']
    },
    heeft_rvb: {
      triggerValue: 'Ja',
      requiredFields: ['aantal_rvb', 'rvb_buiten_europa']
    },
    heeft_rvc: {
      triggerValue: 'Ja',
      requiredFields: ['aantal_rvc', 'rvc_buiten_europa']
    },
    heeft_rvt: {
      triggerValue: 'Ja',
      requiredFields: ['aantal_rvt', 'rvt_buiten_europa']
    },
    beleid_samenstelling: {
      triggerValue: 'anders',
      requiredFields: ['beleid_samenstelling_anders']
    }
  },

  // UI text
  UI: {
    BUTTON_NEXT: 'Volgende',
    BUTTON_SUBMIT: 'Verzenden',
    BUTTON_SUBMITTING: 'Verzenden...',
    STATUS_COMPLETE: '✓',
    STATUS_PARTIAL: '−',
    STATUS_EMPTY: '○'
  },

  // Error messages (Dutch)
  ERRORS: {
    INVALID_CODE: 'Ongeldige organisatiecode. Controleer uw code en probeer opnieuw.',
    ENTER_CODE: 'Vul beide delen van uw organisatiecode in.',
    NETWORK_ERROR: 'Er ging iets mis bij het controleren van uw code. Probeer het later opnieuw.',
    SUBMIT_ERROR: 'Er ging iets mis bij het verzenden. Probeer het opnieuw.',
    SESSION_EXPIRED: 'Uw sessie is verlopen. Log opnieuw in.',
    STORAGE_ERROR: 'Kan gegevens niet opslaan. Controleer of uw browser localStorage ondersteunt.'
  },

  // Submit-failure messaging. Each entry pairs a short title, a one-line
  // explanation in plain Dutch (no English jargon, no raw error strings)
  // and a reassuring next-step subtext. Selected by ApiError.code in form.js.
  SUBMIT_ERRORS: {
    NETWORK: {
      title: 'Verzenden is niet gelukt',
      message: 'We konden uw inzending niet bezorgen. Het lijkt erop dat uw netwerk onze server blokkeert — dit komt voor bij sommige bedrijfsfirewalls.',
      subtext: 'Uw antwoorden zijn lokaal opgeslagen en blijven bewaard. Probeer het over een paar minuten opnieuw, gebruik eventueel een ander netwerk (bijvoorbeeld mobiele data), of mail ons via talent@talentnaardetop.nl, dan ronden wij het voor u af.'
    },
    SERVER: {
      title: 'Onze server is even niet bereikbaar',
      message: 'Dit ligt aan ons, niet aan u. We hebben automatisch een seintje gekregen.',
      subtext: 'Uw antwoorden zijn lokaal opgeslagen en blijven bewaard. Probeer het over een paar minuten opnieuw, of mail ons via talent@talentnaardetop.nl, dan ronden wij het voor u af.'
    },
    TIMEOUT: {
      title: 'Verzenden duurt te lang',
      message: 'We krijgen geen tijdige reactie van onze server. Dit ligt aan ons, niet aan u.',
      subtext: 'Uw antwoorden zijn lokaal opgeslagen en blijven bewaard. Probeer het zo nog eens, of mail ons via talent@talentnaardetop.nl, dan ronden wij het voor u af.'
    },
    GENERIC: {
      title: 'Verzenden is niet gelukt',
      message: 'Er ging iets mis bij het versturen — we weten nog niet precies wat.',
      subtext: 'Uw antwoorden zijn lokaal opgeslagen en blijven bewaard. Probeer het opnieuw, of mail ons via talent@talentnaardetop.nl, dan ronden wij het voor u af.'
    }
  },

  // CSS classes
  CSS: {
    ACTIVE: 'active',
    SELECTED: 'selected',
    COMPLETE: 'complete',
    PARTIAL: 'partial',
    CONDITIONAL_INCOMPLETE: 'conditional-incomplete',
    SHOW: 'show',
    DONE: 'done',
    ERROR: 'error',
    HAS_VALUE: 'has-value',
    ANSWERED: 'answered'
  },

  // Timeouts (milliseconds)
  TIMEOUTS: {
    AUTO_SAVE_DELAY: 500,
    API_REQUEST: 15000,
    RETRY_BASE: 1000
  },

  // Retry configuration
  RETRY: {
    MAX_ATTEMPTS: 3,
    BACKOFF_MULTIPLIER: 2
  }
};

// Freeze all nested objects to prevent accidental modification
Object.freeze(CONSTANTS);
Object.freeze(CONSTANTS.ANSWERS);
Object.freeze(CONSTANTS.SESSION);
Object.freeze(CONSTANTS.CONDITIONAL_FIELDS);
Object.freeze(CONSTANTS.CONDITIONAL_VALUES);
Object.freeze(CONSTANTS.CONDITIONAL_REQUIREMENTS);
Object.freeze(CONSTANTS.UI);
Object.freeze(CONSTANTS.ERRORS);
Object.freeze(CONSTANTS.SUBMIT_ERRORS.NETWORK);
Object.freeze(CONSTANTS.SUBMIT_ERRORS.SERVER);
Object.freeze(CONSTANTS.SUBMIT_ERRORS.TIMEOUT);
Object.freeze(CONSTANTS.SUBMIT_ERRORS.GENERIC);
Object.freeze(CONSTANTS.SUBMIT_ERRORS);
Object.freeze(CONSTANTS.CSS);
Object.freeze(CONSTANTS.TIMEOUTS);
Object.freeze(CONSTANTS.RETRY);

// Expose on window for ES6 modules
window.CONSTANTS = CONSTANTS;
