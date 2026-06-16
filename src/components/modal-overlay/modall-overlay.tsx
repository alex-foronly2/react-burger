import type { JSX } from 'react';

import styles from './modal-overlay.module.css';

type OverlayProps = {
  onClose: () => void;
};

function ModalOverlay({ onClose }: OverlayProps): JSX.Element {
  return <div className={styles.overlay} onClick={onClose} />;
}

export default ModalOverlay;
