import {
  DragIcon,
  ConstructorElement,
  Button,
  CurrencyIcon,
  CheckMarkIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { Fragment, useState } from 'react';

import Modal from '@components/modal/modal';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = ({ order, setOrder, handleRemove }) => {
  const [showModal, setShowModal] = useState(false);
  const total = order.reduce(
    (accumulator, currentValue) => accumulator + currentValue.price,
    0
  );

  const closeModal = () => {
    setShowModal(false);
  };

  const placeAnOrder = () => {
    setOrder([]);
    setShowModal(true);
  };

  const remove = function () {
    handleRemove(this.index);
  };

  var startDragY = -1;

  const onDragStart = function (e) {
    startDragY = e.clientY;
  };

  const onDragEnd = function (e) {
    const draggedElement = e.target;
    const oldIndex = draggedElement.dataset.index;
    let updateRequired = false;
    const tempOrder = [...order];
    const elements = document.querySelectorAll('.js-draggable');
    if (startDragY > e.clientY) {
      //если перетащили вверх
      for (let element of elements) {
        const newIndex = element.dataset.index;
        if (newIndex >= oldIndex) {
          break;
        }
        const elementCenter =
          element.getBoundingClientRect().top +
          element.getBoundingClientRect().height / 2;
        if (e.clientY < elementCenter) {
          const tempItem = tempOrder[oldIndex];
          tempOrder.splice(oldIndex, 1);
          tempOrder.splice(newIndex, 0, tempItem);
          updateRequired = true;
          break;
        }
      }
    } else {
      //если перетащили вниз
      for (let i = elements.length - 1; i >= 0; i--) {
        const element = elements[i];
        const newIndex = element.dataset.index;
        if (newIndex <= oldIndex) {
          break;
        }
        const elementCenter =
          element.getBoundingClientRect().top +
          element.getBoundingClientRect().height / 2;
        if (e.clientY > elementCenter) {
          const tempItem = tempOrder[oldIndex];
          tempOrder.splice(oldIndex, 1);
          tempOrder.splice(newIndex, 0, tempItem);
          updateRequired = true;
          break;
        }
      }
    }
    if (updateRequired) {
      setOrder(tempOrder);
    }
  };

  return (
    <section className={`${styles.burger_constructor} custom-scroll mb-10`}>
      {order.map((item, index) => {
        return (
          <Fragment key={index}>
            <div
              draggable={true}
              className="js-draggable mb-4"
              data-index={index}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            >
              <DragIcon type="primary" />
              <ConstructorElement
                handleClose={remove.bind({ index })}
                isLocked={false}
                price={item.price}
                text={item.name}
                thumbnail={item.image_mobile}
                type="top"
                extraClass="ml-6"
              />
            </div>
          </Fragment>
        );
      })}
      {order.length > 0 && (
        <>
          <div className={`${styles.burger_constructor_payment} mt-6 mr-5`}>
            <div className="text text_type_digits-medium mr-8">
              {total}
              <CurrencyIcon type="primary" className="ml-2" />
            </div>

            <Button onClick={placeAnOrder} size="small" type="primary">
              Оформить заказ
            </Button>
          </div>
        </>
      )}
      {showModal && (
        <Modal onClose={closeModal}>
          <div className={styles.burger_constructor_popup}>
            <div className="text text_type_digits-medium mt-30">123456</div>
            <div className="mt-8 text text_type_main-medium">идентификатор заказа</div>
            <div className="mt-15 mb-15">
              <CheckMarkIcon type="primary" />
            </div>
            <div className="text text_type_main-default">Ваш заказ начали готовить</div>
            <div className="text text_type_main-default text_color_inactive mb-30 mt-2">
              Дождитесь готовности на орбитальной станции
            </div>
          </div>
        </Modal>
      )}
    </section>
  );
};
