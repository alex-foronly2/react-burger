import { test, expect } from '@playwright/test';
import * as fs from 'fs';

let isRequestSent = false;
let requestPayload: Record<string, unknown> | null = null;

test.describe('Оформление заказа', () => {
  test('когда пользователь не авторизован', async ({ page }) => {
    const ingredientsData = JSON.parse(
      fs.readFileSync('e2e/hars/ingredients.json', 'utf-8')
    );
    await page.route('**/api/ingredients', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: ingredientsData }),
      });
    });

    await page.goto('/');
    await expect(page.getByText('Соберите бургер')).toBeVisible();
    await expect(page.getByText('Флюоресцентная булка R2-D3')).toBeVisible();
    await expect(page.getByText('Выберите булку').first()).toBeVisible();

    const bun = page.getByText('Флюоресцентная булка R2-D3');
    const bunDrop = page.getByText('Выберите булку').first();

    await expect(page.getByTestId('ingredient-info-popup')).not.toBeVisible();
    await bun.click();//открываем попап с информацией об ингредиенте
    await expect(page.getByTestId('ingredient-info-popup')).toBeVisible();
    await page.getByTestId('modal-overlay').click({ position: { x: 5, y: 5 } });//клик в угол потому что центр блока перекрыт модальным окном
    await expect(page.getByTestId('ingredient-info-popup')).not.toBeVisible();//попап закрылся

    await bun.dragTo(bunDrop);//добавляем булку

    await expect(page.getByTestId('burger-constructor')).toBeVisible();
    await expect(page.getByTestId('burger-constructor').getByText('Флюоресцентная булка R2-D3')).toHaveCount(2);//перетащили булку, добавилось 2 элемента

    const button = page.getByRole('button', { name: /оформить заказ/i });

    //кнопка должна быть неактивна пока не добавили и булки и ингридиенты
    await expect(button).toBeDisabled();


    const main = page.getByText('Говяжий метеорит (отбивная)');
    const mainDrop = page.getByText('Выберите игредиенты');
    await main.dragTo(mainDrop);//добавляем начинку бургера
    await expect(page.getByTestId('burger-constructor').getByText('Говяжий метеорит (отбивная)')).toHaveCount(1);//перетащили ингредиент, добавился 1 элемент


    await expect(button).toBeEnabled();
    button.click();
    //пользователь не авторизовн, переадерсация на страницу входа
    await expect(page.getByTestId('login-page')).toBeVisible();

  });
  test('когда пользователь авторизован', async ({ page }) => {
    const ingredientsData = JSON.parse(
      fs.readFileSync('e2e/hars/ingredients.json', 'utf-8')
    );

    await page.route('**/api/ingredients', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, data: ingredientsData }),
      });
    });

    await page.route('**/api/orders', async (route) => {
      if (route.request().method() === 'POST') {
        isRequestSent = true; // Фиксируем факт отправки
        requestPayload = route.request().postDataJSON();
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
              "success": true,
              "name": "Флюоресцентный метеоритный бургер",
              "order": {
                "ingredients": [
                  {
                    "_id": "692889f16bf770001bfeb4cd",
                    "name": "Флюоресцентная булка R2-D3",
                    "type": "bun",
                    "proteins": 44,
                    "fat": 26,
                    "carbohydrates": 85,
                    "calories": 643,
                    "price": 988,
                    "image": "https://code.s3.yandex.net/react/code/bun-01.png",
                    "image_mobile": "https://code.s3.yandex.net/react/code/bun-01-mobile.png",
                    "image_large": "https://code.s3.yandex.net/react/code/bun-01-large.png",
                    "__v": 0
                  },
                  {
                    "_id": "692889f16bf770001bfeb4d0",
                    "name": "Говяжий метеорит (отбивная)",
                    "type": "main",
                    "proteins": 800,
                    "fat": 800,
                    "carbohydrates": 300,
                    "calories": 2674,
                    "price": 3000,
                    "image": "https://code.s3.yandex.net/react/code/meat-04.png",
                    "image_mobile": "https://code.s3.yandex.net/react/code/meat-04-mobile.png",
                    "image_large": "https://code.s3.yandex.net/react/code/meat-04-large.png",
                    "__v": 0
                  },
                  {
                    "_id": "692889f16bf770001bfeb4cd",
                    "name": "Флюоресцентная булка R2-D3",
                    "type": "bun",
                    "proteins": 44,
                    "fat": 26,
                    "carbohydrates": 85,
                    "calories": 643,
                    "price": 988,
                    "image": "https://code.s3.yandex.net/react/code/bun-01.png",
                    "image_mobile": "https://code.s3.yandex.net/react/code/bun-01-mobile.png",
                    "image_large": "https://code.s3.yandex.net/react/code/bun-01-large.png",
                    "__v": 0
                  }
                ],
                "_id": "6a4091c541cff5001b6e6d13",
                "owner": {
                  "name": "Ivan",
                  "email": "test@mail.ru",
                  "createdAt": "2026-06-06T10:33:43.723Z",
                  "updatedAt": "2026-06-15T02:37:13.282Z"
                },
                "status": "done",
                "name": "Флюоресцентный метеоритный бургер",
                "createdAt": "2026-06-28T03:15:17.181Z",
                "updatedAt": "2026-06-28T03:15:17.220Z",
                "number": 1923,
                "price": 4976
              }
            }

          )
        });
      } else {
        await route.continue();
      }
    });

    await page.addInitScript(() => {
      localStorage.setItem('user', '{"email":"test@mail.ru","name":"Ivan"}');
    });

    await page.goto('/');
    await expect(page.getByText('Соберите бургер')).toBeVisible();
    await expect(page.getByText('Флюоресцентная булка R2-D3')).toBeVisible();
    await expect(page.getByText('Выберите булку').first()).toBeVisible();


    const bun = page.getByText('Флюоресцентная булка R2-D3');
    const bunDrop = page.getByText('Выберите булку').first();

    await expect(page.getByTestId('ingredient-info-popup')).not.toBeVisible();
    await bun.click();
    await expect(page.getByTestId('ingredient-info-popup')).toBeVisible();
    await page.getByTestId('modal-overlay').click({ position: { x: 5, y: 5 } });//клик в угол потому что центр блока перекрыт модальным окном
    await expect(page.getByTestId('ingredient-info-popup')).not.toBeVisible();

    await bun.dragTo(bunDrop);

    await expect(page.getByTestId('burger-constructor')).toBeVisible();
    await expect(page.getByTestId('burger-constructor').getByText('Флюоресцентная булка R2-D3')).toHaveCount(2);//перетащили булку, добавилось 2 элемента

    const button = page.getByRole('button', { name: /оформить заказ/i });

    //кнопка должна быть неактивна пока не добавили и булки и ингридиенты
    await expect(button).toBeDisabled();


    const main = page.getByText('Говяжий метеорит (отбивная)');
    const mainDrop = page.getByText('Выберите игредиенты');
    await main.dragTo(mainDrop);
    await expect(page.getByTestId('burger-constructor').getByText('Говяжий метеорит (отбивная)')).toHaveCount(1);//перетащили ингредиент, добавился 1 элемент


    await expect(button).toBeEnabled();
    await expect(page.getByTestId('order-popup')).not.toBeVisible();
    const [response, ] = await Promise.all([
      page.waitForResponse(res => res.url().includes('/api/orders') && res.status() === 200),
      button.click()
    ]);
    const orderResponse = await response.json();

    expect(isRequestSent).toBe(true); // Проверяем, что запрос действительно был отправлен

    // проверяем что отправил фронтенд
    expect(requestPayload).toHaveProperty('ingredients');

    // проверяем ответ
    expect(orderResponse.success).toBeTruthy();
    expect(orderResponse.order).toHaveProperty('ingredients');
    expect(orderResponse.order.owner.name).toEqual('Ivan');
    expect(orderResponse.order.status).toEqual('done');
    expect(orderResponse.order.ingredients.length).toEqual(3);


    //проверяем что попап с информацией о заказе показан пользователю
    await expect(page.getByTestId('order-popup')).toBeVisible();
  });
});
