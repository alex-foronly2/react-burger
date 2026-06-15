import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import ModalOverlay from '@components/modal-overlay/modall-overlay';

import type { JSX, PropsWithChildren } from 'react';

import styles from './modal.module.css';

type ModalProps = {
  header: string;
  onClose: () => void;
};
function Modal({
  children,
  header,
  onClose,
}: PropsWithChildren<ModalProps>): JSX.Element {
  const modalRoot = document.getElementById('modal');
  useEffect(() => {
    function handleEscape(event): void {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    document.addEventListener('keydown', handleEscape);

    return (): void => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);
  return createPortal(
    <>
      <div className={styles.modal}>
        <ModalOverlay onClose={onClose} />

        <div className={`${styles.popup} card`}>
          <div className={`${styles.modal_header}`}>
            <div className="text text_type_main-medium">{header}</div>

            <CloseIcon type="primary" className="c-pointer" onClick={onClose} />
          </div>
          {children}
        </div>
      </div>
    </>,
    modalRoot
  );
}

export default Modal;
