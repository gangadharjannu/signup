const REQUIRED = 'required';

export const REGISTRATION_FORM_TITLE = 'Please signup here to create an account';
export const PASSWORD_MIN_LENGTH = 8;

export const FIRST_NAME_LABEL = 'First Name';
export const FIRST_NAME_VALIDATION_REQUIRED = `${FIRST_NAME_LABEL} ${REQUIRED}`;

export const LAST_NAME_LABEL = 'Last Name';
export const LAST_NAME_VALIDATION_REQUIRED = `${LAST_NAME_LABEL} ${REQUIRED}`;

export const EMAIL_LABEL = 'Email';
export const EMAIL_VALIDATION_REQUIRED = `${EMAIL_LABEL} ${REQUIRED}`;
export const EMAIL_VALIDATION_INVALID = `${EMAIL_LABEL} must be a valid email`;

export const PASSWORD_LABEL = 'Password';
export const PASSWORD_VALIDATION_REQUIRED = `${PASSWORD_LABEL} ${REQUIRED}`;
export const PASSWORD_VALIDATION_MIN_LENGTH = `${PASSWORD_LABEL} must be at least ${PASSWORD_MIN_LENGTH} characters`;
