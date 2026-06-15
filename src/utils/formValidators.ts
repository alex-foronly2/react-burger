const PWD_REGEX = /^[a-zA-Z0-9!@#$%^&*()_+{}[\]:;<>,.?~\\/-]{6,}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

type fieldValidator = {
  validator: (value: string) => boolean;
  message: string;
};
export const formValidators: {
  email: fieldValidator;
  password: fieldValidator;
  name: fieldValidator;
} = {
  email: {
    validator: (value) => !!(value.length && EMAIL_REGEX.test(value)),
    message: 'Укажите корректный email.',
  },
  password: {
    validator: (value) => !!(value.length && PWD_REGEX.test(value)),
    message: 'Укажите пароль посложнее.',
  },
  name: {
    validator: (value) => !!value.length,
    message: 'Укажите имя.',
  },
};

export const userFormValidators: {
  email: fieldValidator;
  password: fieldValidator;
  name: fieldValidator;
} = {
  email: {
    validator: (value) => !!(value.length && EMAIL_REGEX.test(value)),
    message: 'Укажите корректный email.',
  },
  password: {
    validator: (value) => !value.length || PWD_REGEX.test(value),
    message: 'Укажите пароль посложнее.',
  },
  name: {
    validator: (value) => !!value.length,
    message: 'Укажите имя.',
  },
};

export const passwordFormValidators: {
  password: fieldValidator;
  token: fieldValidator;
} = {
  password: {
    validator: (value) => !!(value.length && PWD_REGEX.test(value)),
    message: 'Укажите пароль посложнее.',
  },
  token: {
    validator: (value) => !!value.length,
    message: 'Укажите код из письма.',
  },
};
