import { FunctionComponent } from 'react';
import parentStyles from '../styles.module.scss';

interface Props {
  downloadURL: string;
  onClick?(): void;
  canEdit?: boolean;
}

const Signature: FunctionComponent<Props> = ({
  downloadURL,
  onClick,
  canEdit
}) => (
  <div className={parentStyles.inspection}>
    <div className={parentStyles.inspection__inputSignature}>
      <button
        className={parentStyles.inspection__inputSignature__item}
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
  onClick: () => {} // eslint-disable-line
};

export default Signature;
