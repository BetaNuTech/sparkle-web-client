import { FunctionComponent, useState, useEffect } from 'react';
import clsx from 'clsx';
import CloseIcon from '../../public/icons/sparkle/cancel-simple.svg';
import styles from './styles.module.scss';

interface Props {
  formName?: string;
  message?: string; // Any direct error message
  errors?: Record<string, any>;
}

const ErrorLabel: FunctionComponent<Props> = ({
  formName,
  errors,
  message
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const errorMessage =
    errors && typeof errors[formName] !== 'undefined'
      ? errors[formName].message
      : message;

  const hideError = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    setIsVisible(true);
  }, [errors]);

  return errorMessage && isVisible ? (
    <p
      className={clsx(styles.error, message ? styles.error__form : '')}
      data-testid={`error-label-${formName}`}
    >
      <span data-testid={`error-message-${formName}`}>{errorMessage}</span>
      <span className={styles.error__icon} onClick={hideError}>
        <CloseIcon />
      </span>
    </p>
  ) : null;
};

export default ErrorLabel;
