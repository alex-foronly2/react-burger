import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useFormWithValidation } from '@hooks/use-form-with-validation';
import { useUpdateUserMutation } from '@services/api/authApi';
import {
  setUserFormValue,
  userSelector,
  userFormSelector,
  initUserForm,
} from '@services/user/slice';
import { userFormValidators } from '@utils/formValidators';

import type { JSX } from 'react';

export const ProfilePage = (): JSX.Element => {
  const user = useSelector(userSelector);
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
  function handleSubmit(e): void | boolean {
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
  function resetForm(e): void {
    e.preventDefault();
    dispatch(initUserForm());
  }
  const dataChanged =
    values.name !== user.name || values.email !== user.email || values.password;
  return (
    <form noValidate onSubmit={handleSubmit}>
      <Input
        placeholder="Имя"
        onChange={handleChange}
        name="name"
        type="text"
        disabled={false}
        value={values ? values.name : ''}
        errorText={errors.name || backendError?.message || backendError?.data?.message}
        error={backendError || showError === 'name'}
        icon={'EditIcon'}
        extraClass="mb-6"
      />
      <Input
        placeholder="Логин"
        onChange={handleChange}
        name="email"
        type="email"
        disabled={false}
        value={values ? values.email : ''}
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
        value={values ? values.password : '*******'}
        errorText={errors.password}
        error={showError === 'password'}
        // value={'******'}
        icon={'EditIcon'}
        extraClass="mb-6"
      />
      {dataChanged && (
        <>
          <Button
            onClick={handleSubmit}
            size="small"
            type="primary"
            extraClass="mt-8 mb-15"
          >
            Сохранить
          </Button>
          <Button
            onClick={resetForm}
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
