import styles from './modal-overlay.module.css';

function ModalOverlay({ onClose }) {
  return <div className={styles.overlay} onClick={onClose} />;
}

export default ModalOverlay;
