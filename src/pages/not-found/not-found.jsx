import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <>
      Страница не найдена
      <Link to="/">Перейти на главную</Link>
    </>
  );
};
