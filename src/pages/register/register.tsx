import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useFormWithValidation } from '@hooks/use-form-with-validation';
import { useRegisterMutation } from '@services/api/authApi';
import { authSelector, setFormValue } from '@services/user/slice';
import { formValidators } from '@utils/formValidators';

import type { JSX } from 'react';

import styles from './register.module.css';

export const RegisterPage = (): JSX.Element => {
  const [register, { error: backendError }] = useRegisterMutation();
  const [hidePassword, setHidePassword] = useState(true);
  const [showError, setShowError] = useState('');
  const { values, handleChange, errors } = useFormWithValidation(
    authSelector,
    setFormValue,
    formValidators
  );
  function togglePassword(): void {
    setHidePassword(!hidePassword);
  }

  function handleSubmit(e): void | boolean {
    e.preventDefault();

    if (errors) {
      for (const i of Object.keys(errors)) {
        const error = errors[i];
        if (error) {
          setShowError(i);
          return false;
        }
      }
    }

    register(values);
  }
  return (
    <div className={styles.content}>
      <h3>Регистрация</h3>
      <form noValidate onSubmit={handleSubmit} className={styles.form}>
        <Input
          onChange={handleChange}
          errorText={errors.name || ''}
          error={showError === 'name'}
          name="name"
          placeholder="Имя"
          extraClass="mb-6"
        />
        <Input
          onChange={handleChange}
          placeholder="E-mail"
          name="email"
          type="email"
          errorText={errors.email || backendError?.data?.message}
          error={backendError || showError === 'email'}
          value={values.email || ''}
          extraClass="mb-6"
        />
        <Input
          onChange={handleChange}
          icon={hidePassword ? 'HideIcon' : 'ShowIcon'}
          onIconClick={togglePassword}
          errorText={errors.password || ''}
          error={showError === 'password'}
          placeholder="Пароль"
          name="password"
          value={values.password || ''}
          type={hidePassword ? 'password' : 'text'}
          extraClass="mb-6"
        />
        <Button size="medium" type="primary" htmlType="submit" extraClass="mb-20">
          Зарегистрироваться
        </Button>
        <span>
          Уже зарегистрированы? <Link to="/login">Войти</Link>
        </span>
      </form>
    </div>
  );
};
