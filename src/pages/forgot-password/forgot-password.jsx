import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { Link, useNavigate } from 'react-router-dom';

import { useFormWithValidation } from '@hooks/use-form-with-validation';
import { useResetPasswordMutation } from '@services/api/authApi';
import { authSelector, setFormValue } from '@services/user/slice';
import { formValidators } from '@utils/formValidators';

import styles from './forgot-password.module.css';

export const ForgotPasswordPage = () => {
  const [resetPassword, { error: backendError }] = useResetPasswordMutation();
  const { values, handleChange, errors } = useFormWithValidation(
    authSelector,
    setFormValue,
    formValidators
  );
  const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();
    if (errors) {
      for (let i of Object.keys(errors)) {
        const error = errors[i];
        if (error) {
          return false;
        }
      }
    }
    if (values.email) {
      await resetPassword({ email: values.email });
      navigate('/reset-password');
    }
  }
  return (
    <div className={styles.content}>
      <h3>Восстановление пароля</h3>
      <form noValidate onSubmit={handleSubmit} className={styles.form}>
        <Input
          onChange={handleChange}
          errorText={errors.email || backendError?.data?.message}
          error={backendError || errors.email}
          name="email"
          placeholder="Укажите email"
          value={values.email || ''}
          extraClass="mb-6"
        />
        <Button
          size="medium"
          type="primary"
          htmlType="submit"
          extraClass="mb-20"
          onClick={handleSubmit}
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
