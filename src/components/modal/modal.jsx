import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import ModalOverlay from '@components/modal-overlay/modall-overlay';

import styles from './modal.module.css';

function Modal({ children, header, onClose }) {
  const modalRoot = document.getElementById('modal');
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);
  return createPortal(
    <>
      <div className={styles.modal}>
        <ModalOverlay onClose={onClose} />
        {/*<div className={styles.overlay} />*/}

        <div className={`${styles.popup} card`}>
          <div className={`${styles.modal_header}`}>
            <div className="text text_type_main-medium">{header}</div>

            <CloseIcon type="primary" className="c-pointer" onClick={onClose} />
          </div>
          {children}
          {/*<button className="cancel" onClick={onClose}>*/}
          {/*  Закрыть*/}
          {/*</button>*/}
        </div>
      </div>
    </>,
    modalRoot
  );
}

export default Modal;
