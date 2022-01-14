import clsx from 'clsx';
import { useEffect, useRef, useState, FunctionComponent } from 'react';
import SignaturePad from 'react-signature-canvas';
import inspectionTemplateItemModel from '../../../common/models/inspectionTemplateItem';
import unPublishedSignatureModel from '../../../common/models/inspections/templateItemUnpublishedSignature';
import Modal, { Props as ModalProps } from '../../../common/Modal';
import resizeStream from '../../../common/utils/resizeStream';
import UndoIcon from '../../../public/icons/sparkle/undo.svg';
import WarningIcon from '../../../public/icons/sparkle/warning.svg';
import breakpoints from '../../../config/breakpoints';
import IndexedDBStorage from '../../../common/IndexedDBStorage';
import baseStyles from '../../../common/Modal/styles.module.scss';
import globalEvents from '../../../common/utils/globalEvents';
import filesUtil from '../../../common/utils/files';
import styles from './styles.module.scss';

interface Props extends ModalProps {
  selectedInspectionItem: inspectionTemplateItemModel;
  saveSignature(signatureData: string, size: number, itemId: string): void;
  inspectionItemsSignature: unPublishedSignatureModel[];
}

interface WindowSize {
  width: number;
  height: number;
}

const MAX_CANVAS_WIDTH = 600;
const CANVAS_HEIGHT_OFFSET = 0.3;
const CANVAS_RESOLUTION_RATIO = 6;

const SignatureInputModal: FunctionComponent<Props> = ({
  selectedInspectionItem,
  saveSignature,
  inspectionItemsSignature
}) => {
  const [isPreview, setIsPreview] = useState(false);
  const [signatureData, setSignatureData] = useState([]);
  const hasSignData = signatureData.length > 0;

  const [canvasStyle, setCanvasStyle] = useState({
    width: `${MAX_CANVAS_WIDTH}px`,
    height: `${MAX_CANVAS_WIDTH * 180}px`
  });
  const canvasParentRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const subscription = resizeStream.subscribe({
      next: setCanvasDimensions
    });

    // Initial canvas sizing
    if (typeof window !== 'undefined') {
      setCanvasDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }

    // Unscubscribe resize on exit
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasParentRef, isPreview, signatureData]);

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
    resizeSignaturePad();
  };

  // resize canvas and set resolution to 6x larger
  const resizeSignaturePad = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current.getCanvas();
      canvas.width = canvas.offsetWidth * CANVAS_RESOLUTION_RATIO;
      canvas.height = canvas.offsetHeight * CANVAS_RESOLUTION_RATIO;
      canvas
        .getContext('2d')
        .scale(CANVAS_RESOLUTION_RATIO, CANVAS_RESOLUTION_RATIO);
      canvasRef.current.fromData(signatureData);
    }
  };

  const onUndo = () => {
    const signData = [...signatureData];
    const fromData = signData.slice(0, -1);
    canvasRef.current.fromData(fromData);
    setSignatureData(fromData);
  };

  // clear all user added signature data
  const onClear = () => {
    canvasRef.current.fromData([]);
    setSignatureData([]);
  };

  const onAddedStroke = () => {
    setSignatureData([...canvasRef.current.toData()]);
  };

  // Save any available user signature
  // and call on close callback
  const onCloseModal = () => {
    if (!hasSignData) return;
    const signDataURL = canvasRef.current.toDataURL();
    const signatureSize = filesUtil.estimateBase64ByteSize(signDataURL);
    saveSignature(signDataURL, signatureSize, selectedInspectionItem.id);
  };

  // Complete on close actions when
  // global modal close event fires
  useEffect(() => {
    const unsubscribe = globalEvents.subscribe('modalClose', onCloseModal);
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSignData]); // needed so callback as latest data

  const signatureDownloadURL =
    (inspectionItemsSignature.length > 0 &&
      inspectionItemsSignature[0].signature) ||
    selectedInspectionItem.signatureDownloadURL;

  return (
    <div
      className={styles.SignatureInputModal__modal}
      data-testid="signature-input-modal"
    >
      <header
        className={clsx(
          baseStyles.modal__header,
          baseStyles['modal__header--blue']
        )}
      >
        <h4 className={baseStyles.modal__heading}>SIGNATURE</h4>
      </header>
      {signatureDownloadURL && hasSignData && (
        <h6 className={styles.SignatureInputModal__modal__warning}>
          <WarningIcon />
          &nbsp; You are about to replace the existing signature
        </h6>
      )}
      <button
        className={baseStyles.modal__closeButton}
        data-modal="trigger-close"
        data-testid="signature-input-modal-close"
      >
        ×
      </button>

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
            <SignaturePad
              canvasProps={{
                className: clsx(
                  styles.SignatureInputModal__canvas__body,
                  isPreview &&
                    styles['SignatureInputModal__canvas__body--previewing']
                ),
                style: canvasStyle
              }}
              ref={canvasRef}
              style={canvasStyle}
              penColor="#7c8491"
              onEnd={onAddedStroke}
            />

            <div className={styles.SignatureInputModal__canvas__controls}>
              {/* it will show button to clear all data if its not in preview mode and it has signature data */}
              {hasSignData && !isPreview && (
                <button
                  className={clsx(
                    styles.SignatureInputModal__canvas__clear,
                    styles.SignatureInputModal__canvas__preview
                  )}
                  onClick={onClear}
                >
                  Clear
                </button>
              )}

              {/* it will show button for preview if item have signature */}
              {signatureDownloadURL && (
                <button
                  className={styles.SignatureInputModal__canvas__preview}
                  onClick={() => setIsPreview(!isPreview)}
                  data-testid="signature-input-modal-preview-button"
                >
                  {isPreview ? 'Hide' : 'Preview'} Current
                </button>
              )}

              {/* it will show undo button if its not in preview mode and it has signature data */}
              {hasSignData && !isPreview && (
                <button
                  className={styles.SignatureInputModal__canvas__undo}
                  onClick={onUndo}
                >
                  <UndoIcon />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <IndexedDBStorage hiddenUntil={75} />
    </div>
  );
};

export default Modal(SignatureInputModal, false, styles.SignatureInputModal);
