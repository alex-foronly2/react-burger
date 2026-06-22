import { useState } from 'react';

import { useAppDispatch, useAppSelector } from '@hooks/hooks';

import type { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import type { ChangeEvent } from 'react';

import type { RootState } from '@services/store';

// Тип для значений формы
type FormValues = Record<string, string | number | boolean | null | undefined>;

// Тип для ошибок валидации
type ValidationErrors = Record<string, string>;

// Описание валидатора для одного поля
type Validator = {
  validator: (value: string) => boolean;
  message: string;
};

// Карта валидаторов для всех полей формы
type ValidatorsMap = Record<string, Validator>;

// Интерфейс для функции setFormValue (действие Redux)
type SetFormValuePayload = {
  field: string;
  value: string | number | boolean | null;
};
type SetFormValueFunction = ActionCreatorWithPayload<SetFormValuePayload>;

// Полный интерфейс для хука
type UseFormWithValidationResult = {
  values: FormValues;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  errors: ValidationErrors;
  isValid: boolean;
};

export function useFormWithValidation(
  selector: (state: RootState) => FormValues,
  setFormValue: SetFormValueFunction,
  validators: ValidatorsMap
): UseFormWithValidationResult {
  const values = useAppSelector(selector);
  const [errors, setErrors] = useState(initErrors(values));
  const [isValid, setIsValid] = useState(false);
  const dispatch = useAppDispatch();

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const input = event.currentTarget;
    const value = input.value;
    const name = input.name;
    const isValid = validators[name]?.validator(value) ?? true;
    dispatch(setFormValue({ field: name, value }));
    setErrors({
      ...errors,
      [name]: !isValid ? validators[name]?.message : '',
    });
    setIsValid(isValid);
  }

  return { values, handleChange, errors, isValid };
}

// Функция initError создаёт объект с такими же ключами, как у того,
// с которым работает хук, но с пустыми строками в значениях
function initErrors(formValues: FormValues): ValidationErrors {
  return Object.keys(formValues).reduce<ValidationErrors>((errorObject, fieldName) => {
    errorObject[fieldName] = '';
    return errorObject;
  }, {});
}
