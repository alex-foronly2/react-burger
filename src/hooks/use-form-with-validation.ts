import { useState } from 'react';
import { useSelector } from 'react-redux';

import { useAppDispatch } from '@hooks/hooks';

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
type SetFormValueAction = {
  field: string;
  value: string | number | boolean | null;
};
type SetFormValueFunction = (payload: SetFormValueAction) => SetFormValueAction;

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
  const values = useSelector(selector);
  const [errors, setErrors] = useState(initErrors(values));
  const [isValid, setIsValid] = useState(false);
  // const dispatch = useDispatch();
  const dispatch = useAppDispatch();

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const input = event.target as HTMLInputElement;
    // if (input instanceof HTMLInputElement) {
    const value = input.value;
    // console.log('value');
    // console.log(value);
    const name = input.name;
    const isValid = validators[name]?.validator(value) ?? true;
    dispatch(setFormValue({ field: name, value }));
    setErrors({
      ...errors,
      [name]: !isValid ? validators[name]?.message : '',
    });
    setIsValid(isValid);
    // }
  }

  return { values, handleChange, errors, isValid };
}

// Функция initError создаёт объект с такими же ключами, как у того,
// с которым работает хук, но с пустыми строками в значениях
function initErrors(formValues): ValidationErrors {
  return Object.keys(formValues).reduce((errorObject, fieldName) => {
    errorObject[fieldName] = '';
    return errorObject;
  }, {});
}
