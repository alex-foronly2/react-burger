import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useFormWithValidation } from '@hooks/use-form-with-validation';
import { useLoginMutation } from '@services/api/authApi';
import { authSelector, setFormValue } from '@services/user/slice';
import { formValidators } from '@utils/formValidators';

import styles from './login.module.css';

export const LoginPage = () => {
  const [login, { error: backendError }] = useLoginMutation();
  const [hidePassword, setHidePassword] = useState(true);
  const [showError, setShowError] = useState('');
  function togglePassword() {
    setHidePassword(!hidePassword);
  }

  const { values, handleChange, errors } = useFormWithValidation(
    authSelector,
    setFormValue,
    formValidators
  );
  function handleSubmit(e) {
    e.preventDefault();

    if (errors) {
      for (let i of Object.keys(errors)) {
        const error = errors[i];
        if (error) {
          setShowError(i);
          return false;
        }
      }
    }

    login(values);
  }
  return (
    <div className={styles.content}>
      <h3>Вход</h3>
      <form noValidate onSubmit={handleSubmit} className={styles.form}>
        <Input
          onChange={handleChange}
          placeholder="E-mail"
          errorText={errors.email || backendError?.data?.message}
          error={backendError || showError === 'email'}
          name="email"
          type="email"
          value={values.email || ''}
          extraClass="mb-6"
        />
        <Input
          onChange={handleChange}
          icon={hidePassword ? 'HideIcon' : 'ShowIcon'}
          onIconClick={togglePassword}
          errorText={errors.password || ''}
          error={showError === 'password'}
          // size="default"
          placeholder="Пароль"
          name="password"
          value={values.password || ''}
          type={hidePassword ? 'password' : 'text'}
          extraClass="mb-6"
        />
        <Button size="medium" type="primary" htmlType="submit" extraClass="mb-20">
          Войти
        </Button>
        <span className="mb-6">
          Вы новый пользователь? <Link to="/register">Зарегистрироваться</Link>
        </span>
        <span>
          Забыли пароль? <Link to="/forgot-password">Восстановить пароль</Link>
        </span>
      </form>
    </div>
  );
};
