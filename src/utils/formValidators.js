const PWD_REGEX = /^[a-zA-Z0-9!@#$%^&*()_+{}[\]:;<>,.?~\\/-]{6,}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

export const formValidators = {
  email: {
    validator: (value) => value.length && EMAIL_REGEX.test(value),
    message: 'Укажите корректный email.',
  },
  password: {
    validator: (value) => value.length && PWD_REGEX.test(value),
    message: 'Укажите пароль посложнее.',
  },
  name: {
    validator: (value) => value.length,
    message: 'Укажите имя.',
  },
};

export const userFormValidators = {
  email: {
    validator: (value) => value.length && EMAIL_REGEX.test(value),
    message: 'Укажите корректный email.',
  },
  password: {
    validator: (value) => !value.length || PWD_REGEX.test(value),
    message: 'Укажите пароль посложнее.',
  },
  name: {
    validator: (value) => value.length,
    message: 'Укажите имя.',
  },
};

export const passwordFormValidators = {
  password: {
    validator: (value) => value.length && PWD_REGEX.test(value),
    message: 'Укажите пароль посложнее.',
  },
  token: {
    validator: (value) => value.length,
    message: 'Укажите код из письма.',
  },
};
