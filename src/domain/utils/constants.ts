export const USERS_PER_PAGE = 10;

export const USER_VALIDATION = {
  name: {
    minLength: 3,
    maxLength: 80,
    message: "'name' must be between 3 and 80 characters long",
  },
  cpf: {
    message: "'cpf' is not valid",
  },
  dateOfBirth: {
    minDriverAge: 18,
    minPassengerAge: 15,
    messageFormat: "'dateOfBirth' must be a VALID date in YYYY-MM-DD format",
    messageDriverAge: "driver must be at least 18 years old",
    messagePassengerAge: "passenger must be at least 15 years old",
  },
  gender: {
    message: "'gender' must be one of: 'male', 'female', 'other', 'undisclosed'",
  },
  address: {
    minLength: 10,
    maxLength: 255,
    message: "'address' must be between 10 and 255 characters long",
  },
  phone: {
    message: "'phone' is not valid",
  },
  vehicle: {
    minLength: 10,
    maxLength: 255,
    message: "'vehicle' must be between 10 and 255 characters long",
  },
  prefersNoConversation: {
    message: "'prefersNoConversation' must be a boolean",
  },
};
