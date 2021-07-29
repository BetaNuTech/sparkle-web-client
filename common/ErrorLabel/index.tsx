import { FunctionComponent, useState, useEffect } from 'react';
import CloseIcon from '../../public/icons/sparkle/cancel-simple.svg';
import styles from './styles.module.scss';

interface Props {
  formName: string;
  errors: Record<string, any>;
}

const ErrorLabel: FunctionComponent<Props> = ({ formName, errors }) => {
  const [isVisible, setIsVisible] = useState(true);

  const errorMessage =
    errors && typeof errors[formName] !== 'undefined'
      ? errors[formName].message
      : '';

  const hideError = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    setIsVisible(true);
  }, [errors]);

  return errorMessage && isVisible ? (
    <p className={styles.error} data-testid={`error-label-${formName}`}>
      <span data-testid={`error-message-${formName}`}>{errorMessage}</span>
      <span className={styles.error__icon} onClick={hideError}>
        <CloseIcon />
      </span>
    </p>
  ) : null;
};

export default ErrorLabel;
