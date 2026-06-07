import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export function useFormWithValidation(selector, setFormValue, validators) {
  const values = useSelector(selector);
  const [errors, setErrors] = useState(initErrors(values));
  const [isValid, setIsValid] = useState(false);
  const dispatch = useDispatch();

  function handleChange(event) {
    const input = event.target;
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
function initErrors(formValues) {
  return Object.keys(formValues).reduce((errorObject, fieldName) => {
    errorObject[fieldName] = '';
    return errorObject;
  }, {});
}
