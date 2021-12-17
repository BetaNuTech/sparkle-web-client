import { FunctionComponent } from 'react';

import parentStyles from '../styles.module.scss';

interface Props {
  signatureDownloadURL: string;
}

const Signature: FunctionComponent<Props> = ({ signatureDownloadURL }) => (
  <div className={parentStyles.inspection}>
    <button className={parentStyles.inspection__inputSignature}>
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

Signature.defaultProps = {};

export default Signature;
