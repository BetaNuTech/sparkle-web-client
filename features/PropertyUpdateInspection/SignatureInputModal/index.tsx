import clsx from 'clsx';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import inspectionTemplateItemModel from '../../../common/models/inspectionTemplateItem';
import Modal, { Props as ModalProps } from '../../../common/Modal';
import resizeStream from '../../../common/utils/resizeStream';
import UndoIcon from '../../../public/icons/sparkle/undo.svg';
import breakpoints from '../../../config/breakpoints';
import baseStyles from '../../../common/Modal/styles.module.scss';
import styles from './styles.module.scss';

interface Props extends ModalProps {
  onClose: () => void;
  selectedInspectionItem: inspectionTemplateItemModel;
}

interface WindowSize {
  width: number;
  height: number;
}

const MAX_CANVAS_WIDTH = 600;
const CANVAS_HEIGHT_OFFSET = 0.3;

const SignatureInputModal: FunctionComponent<Props> = ({
  onClose,
  selectedInspectionItem
}) => {
  const [isPreview, setIsPreview] = useState(false);
  const [canvasStyle, setCanvasStyle] = useState({
    width: `${MAX_CANVAS_WIDTH}px`,
    height: `${MAX_CANVAS_WIDTH * 180}px`
  });
  const canvasParentRef = useRef(null);

  useEffect(() => {
    const subscription = resizeStream.subscribe({ next: setCanvasDimensions });

    // Initial canvas sizing
    if (typeof window !== 'undefined') {
      setCanvasDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }

    // Unscubscribe resize on exit
    return () => subscription.unsubscribe();
  }, [canvasParentRef, isPreview]);

  const setCanvasDimensions = (windowSize: WindowSize) => {
    let width = MAX_CANVAS_WIDTH;
    const { offsetWidth } = canvasParentRef.current || {};

    if (offsetWidth === 0) {
      return;
    }

    // check inner width so it will set canvas width on only lower resolutions
    if (windowSize.width < breakpoints.desktop.minWidth) {
      width = offsetWidth;
    }

    setCanvasStyle({
      width: `${width}px`,
      height: `${width * CANVAS_HEIGHT_OFFSET}px`
    });
  };

  const { signatureDownloadURL } = selectedInspectionItem;
  return (
    <div
      className={styles.SignatureInputModal__modal}
      data-testid="signature-input-modal"
    >
      <button
        className={baseStyles.modal__closeButton}
        onClick={onClose}
        data-testid="signature-input-modal-close"
      >
        ×
      </button>
      <header
        className={clsx(
          baseStyles.modal__header,
          styles.SignatureInputModal__modal__header
        )}
      >
        <h4 className={baseStyles.modal__heading}>Signature</h4>
      </header>

      <div className={baseStyles.modal__main}>
        <div
          className={clsx(
            baseStyles.modal__main__content,
            styles.SignatureInputModal__content
          )}
        >
          {isPreview && (
            <div
              className={styles.SignatureInputModal__preview}
              onClick={() => setIsPreview(false)}
              style={canvasStyle}
            >
              <img
                src={signatureDownloadURL}
                alt="signature"
                data-testid="signature-input-modal-preview-image"
              />
            </div>
          )}
          <div
            ref={canvasParentRef}
            className={styles.SignatureInputModal__canvas}
          >
            <canvas
              className={clsx(
                styles.SignatureInputModal__canvas__body,
                isPreview &&
                  styles['SignatureInputModal__canvas__body--previewing']
              )}
              style={canvasStyle}
            />
            <div className={styles.SignatureInputModal__canvas__controls}>
              {signatureDownloadURL && (
                <button
                  className={styles.SignatureInputModal__canvas__preview}
                  onClick={() => setIsPreview(!isPreview)}
                  data-testid="signature-input-modal-preview-button"
                >
                  {isPreview ? 'Hide' : 'Preview'} Current
                </button>
              )}
              <button className={styles.SignatureInputModal__canvas__undo}>
                <UndoIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal(SignatureInputModal, false, styles.SignatureInputModal);
