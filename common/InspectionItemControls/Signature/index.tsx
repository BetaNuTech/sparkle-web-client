import clsx from 'clsx';
import { FunctionComponent } from 'react';
import parentStyles from '../styles.module.scss';

interface Props {
  downloadURL: string;
  onClick?(): void;
  canEdit?: boolean;
  showValues?: boolean;
}

const Signature: FunctionComponent<Props> = ({
  downloadURL,
  onClick,
  canEdit,
  showValues
}) => (
  <div className={parentStyles.inspection}>
    <div className={parentStyles.inspection__inputSignature}>
      <button
        className={clsx(
          parentStyles.inspection__inputSignature__item,
          showValues && '-full-max-width'
        )}
        disabled={!canEdit}
        data-testid="inspection-signature-button"
        onClick={() => canEdit && onClick()}
      >
        {downloadURL && (
          <img
            data-testid="inspection-signature-image"
            src={downloadURL}
            alt="signature"
          />
        )}
      </button>
    </div>
  </div>
);

Signature.defaultProps = {
  canEdit: false,
  onClick: () => {}, // eslint-disable-line
  showValues: false
};

export default Signature;
