import {
  ConstructorElement,
  Button,
  CurrencyIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { Fragment } from 'react';
import { useDrop } from 'react-dnd';
import { useLocation, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { BurgerConstructorIngredient } from '@components/burger-constructor-ingredient/burger-constructor-ingredient';
import Modal from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { useCreateOrderMutation } from '@services/api/orderApi';
import {
  ADD_ITEM,
  SORT_ITEMS,
  HIDE_POPUP,
  SHOW_POPUP,
  SUBMIT_ORDER,
  COMPLETE_ORDER,
} from '@services/tasks/actions';
import { userSelector } from '@services/user/slice';

import type { JSX } from 'react';

import type { Filling } from '@services/tasks/orderReducer';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const showModal = useAppSelector((store) => store.modal.order);
  const [createOrder] = useCreateOrderMutation();
  const user = useAppSelector(userSelector);
  const navigate = useNavigate();
  const location = useLocation();
  const [, dropTarget] = useDrop({
    accept: 'ingredient',
    drop(item: Filling) {
      dispatch({
        type: ADD_ITEM,
        payload: {
          ...item,
          uniqueId: uuidv4(),
        },
      });
    },
  });
  const [, dropSortTarget] = useDrop({
    accept: 'orderItem',
    drop(item: Filling, monitor) {
      const position = monitor.getClientOffset();
      if (!position) {
        return;
      }
      const elements = document.querySelectorAll<HTMLElement>('.js-draggable');
      const droppedPosition = position.y;
      //если перетащили вверх
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        if (element.dataset.uniqueId === item.uniqueId) {
          break;
        }
        const elementCenter =
          element.getBoundingClientRect().top +
          element.getBoundingClientRect().height / 2;
        if (droppedPosition < elementCenter) {
          dispatch({
            type: SORT_ITEMS,
            payload: {
              uniqueId: item.uniqueId,
              newIndex: i,
            },
          });
          return;
        }
      }
      //если перетащили вниз
      for (let i = elements.length - 1; i >= 0; i--) {
        const element = elements[i];
        if (element.dataset.uniqueId === item.uniqueId) {
          break;
        }
        const elementCenter =
          element.getBoundingClientRect().top +
          element.getBoundingClientRect().height / 2;
        if (droppedPosition > elementCenter) {
          dispatch({
            type: SORT_ITEMS,
            payload: {
              uniqueId: item.uniqueId,
              newIndex: i,
            },
          });
          return;
        }
      }
    },
  });

  const orderBuns = useAppSelector((store) => store.order.orderBuns);
  const orderIngredients = useAppSelector((store) => store.order.orderIngredients);
  const order = [...orderBuns, ...orderIngredients];
  const total = order.reduce(
    (accumulator, currentValue) => accumulator + currentValue.price,
    0
  );

  const closeModal = (): void => {
    dispatch({
      type: HIDE_POPUP,
    });
  };

  const placeAnOrder = async (): Promise<void> => {
    if (!user) {
      return navigate('/login', {
        state: {
          from: location,
        },
      });
    }
    if (!orderBuns.length || !orderIngredients.length) {
      alert('Выберите булки и состав бургера');
      return;
    }
    dispatch({
      type: SUBMIT_ORDER,
    });
    dispatch({
      type: SHOW_POPUP,
      payload: { type: 'order' },
    });
    const request = {
      ingredients: [
        orderBuns[0]._id,
        ...orderIngredients.map((item) => item._id),
        orderBuns[0]._id,
      ],
    };
    const result = await createOrder(request);
    dispatch({
      type: COMPLETE_ORDER,
      payload: result.data,
    });
  };

  const bun = orderBuns[0];
  const isButtonDisabled = !orderBuns.length || !orderIngredients.length;

  return (
    <section
      className={`${styles.burger_constructor} mb-10`}
      ref={(node) => {
        dropTarget(node);
      }}
    >
      {/* ref={dropTarget} */}
      {bun ? (
        <Fragment>
          <div draggable={false} className="mb-4">
            <ConstructorElement
              isLocked={true}
              price={bun.price}
              text={bun.name + ' (верх)'}
              thumbnail={bun.image_mobile}
              type="top"
              extraClass="ml-10"
            />
          </div>
        </Fragment>
      ) : (
        <div
          className={`${styles['burger_constructor-empty_ingredient']} constructor-element constructor-element_pos_top ml-10 mb-4`}
        >
          <span className="constructor-element__row">Выберите булку</span>
        </div>
      )}
      <div
        className={`${styles.burger_constructor_scrollable} custom-scroll`}
        ref={(node) => {
          dropSortTarget(node);
        }}
        // ref={dropSortTarget}
      >
        {orderIngredients.length ? (
          orderIngredients.map((item) => {
            return <BurgerConstructorIngredient key={item.uniqueId} {...item} />;
          })
        ) : (
          <div
            className={`${styles['burger_constructor-empty_ingredient']} constructor-element ml-10 mb-4`}
          >
            <span className="constructor-element__row">Выберите игредиенты</span>
          </div>
        )}
      </div>
      {bun ? (
        <Fragment>
          <div draggable={false} className="mb-4">
            <ConstructorElement
              isLocked={true}
              price={bun.price}
              text={bun.name + ' (низ)'}
              thumbnail={bun.image_mobile}
              type="bottom"
              extraClass="ml-10"
            />
          </div>
        </Fragment>
      ) : (
        <div
          className={`${styles['burger_constructor-empty_ingredient']} constructor-element constructor-element_pos_bottom ml-10 mb-4`}
        >
          <span className="constructor-element__row">Выберите булку</span>
        </div>
      )}
      {
        <>
          <div className={`${styles.burger_constructor_payment} mt-6 mr-5`}>
            <div className="text text_type_digits-medium mr-8">
              {total}
              <CurrencyIcon type="primary" className="ml-2" />
            </div>

            <Button
              disabled={isButtonDisabled}
              onClick={placeAnOrder}
              htmlType="button"
              size="large"
              type="primary"
            >
              Оформить заказ
            </Button>
          </div>
        </>
      }
      {showModal && (
        <Modal onClose={closeModal}>
          <OrderDetails />
        </Modal>
      )}
    </section>
  );
};
