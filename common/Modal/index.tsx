import { FunctionComponent } from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';

export interface Props {
  isVisible?: boolean;
  onClose?: () => any;
}

// Modal high level component
/* eslint-disable */
const ModalHOC = (Content, isPrompt = false) => {
  const Modal: FunctionComponent<any> = (props) => {
    if (typeof props.isVisible !== 'boolean') {
      throw TypeError(`missing isVisible boolean got: ${props.isVisible}`);
    }
    if (typeof props.onClose !== 'function') {
      throw TypeError(`missing onClose function got: ${props.onClose}`);
    }

    return props.isVisible ? (
      <>
        {/* Overlay */}
        <div
          className={styles.modalOverlay}
          onClick={props.onClose}
          data-testid="modal-overlay"
        ></div>
        {/* Modal */}
        <div
          className={clsx(isPrompt ? styles.modalPrompt : styles.modal)}
          data-testid="modal"
        >
          <Content {...props} />
        </div>
      </>
    ) : null;
  };
  /* eslint-enable */

  Modal.defaultProps = {
    isVisible: false,
    onClose: () => false
  };

  return Modal;
};

export default ModalHOC;
