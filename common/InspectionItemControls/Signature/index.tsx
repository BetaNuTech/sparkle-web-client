import { FunctionComponent } from 'react';

import parentStyles from '../styles.module.scss';

interface Props {
  signatureDownloadURL: string;
  onClickSignatureInput(): void;
}

const Signature: FunctionComponent<Props> = ({
  signatureDownloadURL,
  onClickSignatureInput
}) => (
  <div className={parentStyles.inspection}>
    <button
      className={parentStyles.inspection__inputSignature}
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
);

Signature.defaultProps = {
  onClickSignatureInput: () => {} // eslint-disable-line
};

export default Signature;
