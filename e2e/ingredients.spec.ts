import { test, expect } from '@playwright/test';
import {testEmail, testName, orderBun, orderIngredient} from "@services/user/slice.moke";

let isRequestSent = false;
let requestPayload: Record<string, unknown> | null = null;
const buttonName = 'оформить заказ';
const createBurgerHeader = 'Соберите бургер';
const chooseBun = 'Выберите булку';
const chooseIngredient = 'Выберите игредиенты';

test.describe('Оформление заказа', () => {
  test('должен загрузить ингредиенты из HAR-файла', async ({ page }) => {
    await page.routeFromHAR('./e2e/hars/ingredients.har', {
      url: 'https://new-stellarburgers.education-services.ru/api/ingredients',
      update: false,
    });
    await page.goto('/');
    const responsePromise = page.waitForResponse('**/api/ingredients');

    await page.getByText('Соберите бургер').waitFor({ state: 'visible' });
    const response = await responsePromise;
    expect(response.status()).toBe(200);
  });
  test('когда пользователь не авторизован', async ({ page }) => {
    await page.routeFromHAR('./e2e/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false,
      notFound: 'abort'
    });

    await page.goto('/');
    await expect(page.getByText(createBurgerHeader)).toBeVisible();
    await expect(page.getByText(orderBun.name)).toBeVisible();
    await expect(page.getByText(chooseBun).first()).toBeVisible();

    const bun = page.getByText(orderBun.name);
    const bunDrop = page.getByText(chooseBun).first();

    await expect(page.getByTestId('ingredient-info-popup')).not.toBeVisible();
    await bun.click();//открываем попап с информацией об ингредиенте
    await expect(page.getByTestId('ingredient-info-popup')).toBeVisible();
    await page.getByTestId('modal-overlay').click({ position: { x: 5, y: 5 } });//клик в угол потому что центр блока перекрыт модальным окном
    await expect(page.getByTestId('ingredient-info-popup')).not.toBeVisible();//попап закрылся

    await bun.dragTo(bunDrop);//добавляем булку
    const constructor = page.getByTestId('burger-constructor');

    await expect(constructor).toBeVisible();
    await expect(constructor.getByText(orderBun.name)).toHaveCount(2);//перетащили булку, добавилось 2 элемента

    const button = page.getByRole('button', { name: new RegExp(buttonName, 'i') });

    //кнопка должна быть неактивна пока не добавили и булки и ингридиенты
    await expect(button).toBeDisabled();


    const main = page.getByText(orderIngredient.name);
    const mainDrop = page.getByText(chooseIngredient);
    await main.dragTo(mainDrop);//добавляем начинку бургера
    await expect(constructor.getByText(orderIngredient.name)).toHaveCount(1);//перетащили ингредиент, добавился 1 элемент


    await expect(button).toBeEnabled();
    button.click();
    //пользователь не авторизовн, переадерсация на страницу входа
    await expect(page.getByTestId('login-page')).toBeVisible();

  });
  test('когда пользователь авторизован', async ({ page }) => {
    await page.routeFromHAR('./e2e/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false,
      notFound: 'abort'
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
                  orderBun,
                  orderIngredient,
                  orderBun
                ],
                "_id": "6a4091c541cff5001b6e6d13",
                "owner": {
                  "name": testName,
                  "email": testEmail,
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

    await page.addInitScript(({email, name}) => {
      localStorage.setItem('user', '{"email":"'+email+'","name":"'+name+'"}');
    }, { email: testEmail, name: testName });

    await page.goto('/');
    await expect(page.getByText(createBurgerHeader)).toBeVisible();
    await expect(page.getByText(orderBun.name)).toBeVisible();
    await expect(page.getByText(chooseBun).first()).toBeVisible();


    const bun = page.getByText(orderBun.name);
    const bunDrop = page.getByText(chooseBun).first();

    await expect(page.getByTestId('ingredient-info-popup')).not.toBeVisible();
    await bun.click();
    await expect(page.getByTestId('ingredient-info-popup')).toBeVisible();
    await page.getByTestId('modal-overlay').click({ position: { x: 5, y: 5 } });//клик в угол потому что центр блока перекрыт модальным окном
    await expect(page.getByTestId('ingredient-info-popup')).not.toBeVisible();

    await bun.dragTo(bunDrop);
    const constructor = page.getByTestId('burger-constructor');

    await expect(constructor).toBeVisible();
    await expect(constructor.getByText(orderBun.name)).toHaveCount(2);//перетащили булку, добавилось 2 элемента

    const button = page.getByRole('button', { name: new RegExp(buttonName, 'i') });

    //кнопка должна быть неактивна пока не добавили и булки и ингридиенты
    await expect(button).toBeDisabled();


    const main = page.getByText(orderIngredient.name);
    const mainDrop = page.getByText(chooseIngredient);
    await main.dragTo(mainDrop);
    await expect(constructor.getByText(orderIngredient.name)).toHaveCount(1);//перетащили ингредиент, добавился 1 элемент

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
    expect(orderResponse.order.owner.name).toEqual(testName);
    expect(orderResponse.order.status).toEqual('done');
    expect(orderResponse.order.ingredients.length).toEqual(3);

    //проверяем на соответствие номера заказа
    expect(page.getByTestId('order-number')).toHaveText(String(orderResponse.order.number));


    //проверяем что попап с информацией о заказе показан пользователю
    await expect(page.getByTestId('order-popup')).toBeVisible();
  });
});
