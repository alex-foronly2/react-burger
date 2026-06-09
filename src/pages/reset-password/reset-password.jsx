import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useFormWithValidation } from '@hooks/use-form-with-validation';
import { useUpdatePasswordMutation } from '@services/api/authApi';
import { authSelector, setPasswordFormValue } from '@services/user/slice';
import { passwordFormValidators } from '@utils/formValidators';

import styles from './reset-password.module.css';

export const ResetPasswordPage = () => {
  const [hidePassword, setHidePassword] = useState(true);
  const [updatePassword, { error: backendError }] = useUpdatePasswordMutation();
  const { values, handleChange, errors, isValid } = useFormWithValidation(
    authSelector,
    setPasswordFormValue,
    passwordFormValidators
  );
  const navigate = useNavigate();

  if (!localStorage.getItem('resetSent')) {
    navigate('/forgot-password');
  }
  function togglePassword() {
    setHidePassword(!hidePassword);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (isValid) {
      const response = await updatePassword({
        password: values.password,
        token: values.token,
      });

      if (!response.error) {
        navigate('/login');
      }
    }
  }
  return (
    <div className={styles.content}>
      <h3>Восстановление пароля</h3>
      <form noValidate onSubmit={handleSubmit} className={styles.form}>
        <Input
          name="password"
          onChange={handleChange}
          icon={hidePassword ? 'HideIcon' : 'ShowIcon'}
          onIconClick={togglePassword}
          errorText={
            errors.password || backendError?.message || backendError?.data?.message
          }
          error={backendError || errors.password}
          type={hidePassword ? 'password' : 'text'}
          placeholder="Введите новый пароль"
          extraClass="mb-6"
        />
        <Input
          name="token"
          onChange={handleChange}
          errorText={errors.token}
          error={errors.token}
          placeholder="Введите код из письма"
          extraClass="mb-6"
        />
        <Button
          size="medium"
          onClick={handleSubmit}
          type="primary"
          htmlType="submit"
          extraClass="mb-20"
        >
          Восстановить
        </Button>
        <span>
          Вспомнили пароль? <Link to="/login">Войти</Link>
        </span>
      </form>
    </div>
  );
};
