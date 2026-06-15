import { Link } from 'react-router-dom';

import type { JSX } from 'react';

export const NotFound = (): JSX.Element => {
  return (
    <>
      Страница не найдена
      <Link to="/">Перейти на главную</Link>
    </>
  );
};
