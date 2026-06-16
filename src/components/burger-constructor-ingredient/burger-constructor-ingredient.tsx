import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { memo } from 'react';
import { useDrag } from 'react-dnd';
import { useDispatch } from 'react-redux';

import { REMOVE_ITEM } from '@services/tasks/actions';

import type { JSX } from 'react';

import type { Bun, Filling } from '@services/tasks/orderReducer';

const BurgerConstructorElement = (props: Bun | Filling): JSX.Element => {
  const dispatch = useDispatch();
  const [, dragRef] = useDrag({
    type: 'orderItem',
    item: { uniqueId: props.uniqueId },
  });
  const remove = function (): void {
    dispatch({
      type: REMOVE_ITEM,
      payload: props.uniqueId,
    });
  };
  return (
    <div
      className="js-draggable mb-4"
      data-unique-id={props.uniqueId}
      ref={(node) => {
        dragRef(node);
      }}
    >
      <DragIcon type="primary" />
      <ConstructorElement
        handleClose={remove}
        isLocked={false}
        price={props.price}
        text={props.name}
        thumbnail={props.image_mobile}
        // type="normal"
        extraClass="ml-4"
      />
    </div>
  );
};

export const BurgerConstructorIngredient = memo(BurgerConstructorElement);
