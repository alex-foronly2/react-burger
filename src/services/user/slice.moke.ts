export type ingredientType = 'main' | 'sauce';

export const testEmail = 'test@mail.ru';
export const testName = 'Ivan';
export const testPassword = '123456';

export const orderBun = {
  _id: '692889f16bf770001bfeb4cd',
  name: 'Флюоресцентная булка R2-D3',
  type: 'bun' as const,
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/bun-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png',
  __v: 0 as const,
};
export const orderIngredient = {
  _id: '692889f16bf770001bfeb4d0',
  name: 'Говяжий метеорит (отбивная)',
  type: 'main' as ingredientType,
  proteins: 800,
  fat: 800,
  carbohydrates: 300,
  calories: 2674,
  price: 3000,
  image: 'https://code.s3.yandex.net/react/code/meat-04.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-04-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-04-large.png',
  __v: 0 as const,
};
