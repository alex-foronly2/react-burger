import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useAppSelector } from '@/hooks/hooks';
import { useFormWithValidation } from '@hooks/use-form-with-validation';
import { useUpdateUserMutation, type BackendErrorData } from '@services/api/authApi';
import {
  setUserFormValue,
  userSelector,
  userFormSelector,
  initUserForm,
} from '@services/user/slice';
import { userFormValidators } from '@utils/formValidators';

import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { FormEvent, JSX } from 'react';

export const ProfilePage = (): JSX.Element => {
  const user = useAppSelector(userSelector);
  const dispatch = useDispatch();
  const [showError, setShowError] = useState('');
  const [updateUser, { error: backendError }] = useUpdateUserMutation();
  useEffect(() => {
    dispatch(initUserForm());
  }, []);
  const { values, handleChange, errors } = useFormWithValidation(
    userFormSelector,
    setUserFormValue,
    userFormValidators
  );
  function handleSubmit(e: FormEvent<HTMLFormElement>): void | boolean {
    e.preventDefault();
    setShowError('');
    if (errors) {
      for (const i of Object.keys(errors)) {
        const error = errors[i];
        if (error) {
          setShowError(i);
          return false;
        }
      }
    }

    updateUser(values);
  }
  function resetForm(): void {
    dispatch(initUserForm());
  }
  const dataChanged =
    user &&
    (values.name !== user.name || values.email !== user.email || values.password);
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
    <form noValidate onSubmit={handleSubmit}>
      <Input
        placeholder="Имя"
        onChange={handleChange}
        name="name"
        type="text"
        disabled={false}
        value={values ? String(values.name) : ''}
        errorText={errors.name || backendErrorMessage}
        error={!!(backendError || showError === 'name')}
        icon={'EditIcon'}
        extraClass="mb-6"
      />
      <Input
        placeholder="Логин"
        onChange={handleChange}
        name="email"
        type="email"
        disabled={false}
        value={values ? String(values.email) : ''}
        errorText={errors.email}
        error={showError === 'email'}
        icon={'EditIcon'}
        extraClass="mb-6"
      />
      <Input
        placeholder="Пароль"
        onChange={handleChange}
        name="password"
        type="password"
        disabled={false}
        value={values ? String(values.password) : '*******'}
        errorText={errors.password}
        error={showError === 'password'}
        // value={'******'}
        icon={'EditIcon'}
        extraClass="mb-6"
      />
      {dataChanged && (
        <>
          <Button
            // onClick={handleSubmit}
            htmlType="submit"
            size="small"
            type="primary"
            extraClass="mt-8 mb-15"
          >
            Сохранить
          </Button>
          <Button
            onClick={resetForm}
            htmlType="button"
            size="small"
            type="primary"
            extraClass="ml-4 mt-8 mb-15"
          >
            Отмена
          </Button>
        </>
      )}
    </form>
  );
};
