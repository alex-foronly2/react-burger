import type { JSX } from 'react';

import styles from './modal-overlay.module.css';

type OverlayProps = {
  onClose: () => void;
};

function ModalOverlay({ onClose }: OverlayProps): JSX.Element {
  return (
    <div className={styles.overlay} data-testid="modal-overlay" onClick={onClose} />
  );
}

export default ModalOverlay;
