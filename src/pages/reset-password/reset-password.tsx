import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useFormWithValidation } from '@hooks/use-form-with-validation';
import { useUpdatePasswordMutation, type BackendErrorData } from '@services/api/authApi';
import { passwordFormSelector, setPasswordFormValue } from '@services/user/slice';
import { passwordFormValidators } from '@utils/formValidators';

import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { FormEvent, JSX } from 'react';

import styles from './reset-password.module.css';

export const ResetPasswordPage = (): JSX.Element => {
  const [hidePassword, setHidePassword] = useState(true);
  const [updatePassword, { error: backendError }] = useUpdatePasswordMutation();
  const { values, handleChange, errors, isValid } = useFormWithValidation(
    passwordFormSelector,
    setPasswordFormValue,
    passwordFormValidators
  );
  const navigate = useNavigate();

  if (!localStorage.getItem('resetSent')) {
    navigate('/forgot-password');
  }
  function togglePassword(): void {
    setHidePassword(!hidePassword);
  }

  async function submitForm(): Promise<void> {
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
  function handleClick(): void {
    submitForm();
  }
  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    submitForm();
    // if (isValid) {
    //   const response = await updatePassword({
    //     password: values.password,
    //     token: values.token,
    //   });

    //   if (!response.error) {
    //     navigate('/login');
    //   }
    // }
  }

  let backendErrorMessage = '';
  if (backendError) {
    const rtkError = backendError as FetchBaseQueryError | SerializedError;
    if ('data' in rtkError) {
      backendErrorMessage = (rtkError.data as BackendErrorData)?.message || '';
    } else if ('message' in rtkError) {
      backendErrorMessage = rtkError.message || '';
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
          errorText={errors.password || backendErrorMessage}
          error={!!(backendError || errors.password)}
          type={hidePassword ? 'password' : 'text'}
          value={values.password ? String(values.password) : ''}
          placeholder="Введите новый пароль"
          extraClass="mb-6"
        />
        <Input
          name="token"
          onChange={handleChange}
          errorText={errors.token}
          error={!!errors.token}
          value={values.token ? String(values.token) : ''}
          placeholder="Введите код из письма"
          extraClass="mb-6"
        />
        <Button
          size="medium"
          onClick={handleClick}
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
