import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { Fragment, memo } from 'react';
import { useDrag } from 'react-dnd';
import { useDispatch } from 'react-redux';

import { REMOVE_ITEM } from '@services/tasks/actions';

const BurgerConstructorElement = (props) => {
  const dispatch = useDispatch();
  const [, dragRef] = useDrag({
    type: 'orderItem',
    item: { index: props.index },
  });
  const remove = function () {
    dispatch({
      type: REMOVE_ITEM,
      payload: props.index,
    });
  };
  return (
    <>
      <Fragment key={'order_item_' + props.index}>
        <div className="js-draggable mb-4" data-index={props.index} ref={dragRef}>
          <DragIcon type="primary" />
          <ConstructorElement
            handleClose={remove}
            isLocked={false}
            price={props.price}
            text={props.name}
            thumbnail={props.image_mobile}
            type="normal"
            extraClass="ml-4"
          />
        </div>
      </Fragment>
    </>
  );
};

export const BurgerConstructorIngredient = memo(BurgerConstructorElement);
