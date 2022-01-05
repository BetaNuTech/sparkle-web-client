import { FunctionComponent } from 'react';
import clsx from 'clsx';
import globalEvents from '../utils/globalEvents';
import styles from './styles.module.scss';

export interface Props {
  isVisible?: boolean;
  onClose?: () => any;
}

const CLOSE_ELEMENT_SELECTOR = '[data-modal=trigger-close]';

// Modal high level component
/* eslint-disable */
const ModalHOC = (Content, isPrompt = false, modalClass = '') => {
  const Modal: FunctionComponent<any> = (props) => {
    if (typeof props.isVisible !== 'boolean') {
      throw TypeError(`missing isVisible boolean got: ${props.isVisible}`);
    }

    if (typeof props.onClose !== 'function') {
      throw TypeError(`missing onClose function got: ${props.onClose}`);
    }

    const onClose = () => {
      // Allow any modal close global event subscribers
      // to fire before invoking the modal close callback
      globalEvents.trigger('modalClose');
      setTimeout(props.onClose, 100);
    };

    // Event delegator that checks if
    // click events on children should
    // trigger close
    const triggerOnClose = (evt) => {
      const isCloseEl = evt?.target?.matches(CLOSE_ELEMENT_SELECTOR);
      const isParentOfCloseEl = Boolean(
        evt?.target?.closest(CLOSE_ELEMENT_SELECTOR)
      );
      if (isCloseEl || isParentOfCloseEl) onClose();
    };

    return props.isVisible ? (
      <>
        {/* Overlay */}
        <div
          className={styles.modalOverlay}
          onClick={onClose}
          data-testid="modal-overlay"
        ></div>
        {/* Modal */}
        <div
          onClick={triggerOnClose}
          className={clsx(
            isPrompt ? styles.modalPrompt : styles.modal,
            modalClass
          )}
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
