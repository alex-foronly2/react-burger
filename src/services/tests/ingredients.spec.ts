// users.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Список пользователей с HAR', () => {
  // test('должен загрузить пользователей из HAR-файла', async ({ page }) => {
  // Воспроизводим записанный трафик
  // await page.routeFromHAR('./hars/ingredients.har', {
  //   url: 'https://new-stellarburgers.education-services.ru/api/ingredients',
  //   update: true, // Режим воспроизведения
  // });

  // await page.goto('/');
  //
  // // Проверяем, что лоадер исчез
  // await expect(page.getByTestId('loading')).not.toBeVisible();
  //
  // // Проверяем, что пользователи загрузились
  // const list = page.getByTestId('users-list');
  // await expect(list).toBeVisible();
  //
  // // Проверяем конкретных пользователей
  // await expect(page.getByTestId('user-1')).toBeVisible();
  // await expect(page.getByTestId('user-1')).toContainText('Leanne Graham');
  // });

  test('должен работать без реального сервера', async ({ page }) => {
    // await page.routeFromHAR('./hars/ingredients.har', {
    //   url: 'https://new-stellarburgers.education-services.ru/api/ingredients',
    // });

    // Даже если интернета нет, тест пройдёт
    // await page.goto('/');
    await expect(page.getByText('Соберите бургер')).toBeVisible();
    await expect(page.getByText('Флюоресцентная булка R2-D3')).toBeVisible();
    // await expect(page.getByTestId('users-list')).toBeVisible();
  });
});
