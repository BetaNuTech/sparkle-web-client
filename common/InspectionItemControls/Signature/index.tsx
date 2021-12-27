import { FunctionComponent } from 'react';

import parentStyles from '../styles.module.scss';

interface Props {
  signatureDownloadURL: string;
  onClickSignatureInput(): void;
  isDisabled?: boolean;
}

const Signature: FunctionComponent<Props> = ({
  signatureDownloadURL,
  onClickSignatureInput,
  isDisabled
}) => (
  <div className={parentStyles.inspection}>
    <div className={parentStyles.inspection__inputSignature}>
      <button
        className={parentStyles.inspection__inputSignature__item}
        disabled={isDisabled}
        data-testid="inspection-signature-button"
        onClick={onClickSignatureInput}
      >
        {signatureDownloadURL && (
          <img
            data-testid="inspection-signature-image"
            src={signatureDownloadURL}
            alt="signature"
          />
        )}
      </button>
    </div>
  </div>
);

Signature.defaultProps = {
  isDisabled: false,
  onClickSignatureInput: () => {} // eslint-disable-line
};

export default Signature;
