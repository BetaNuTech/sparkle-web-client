import { FunctionComponent, useState, useEffect } from 'react';
import clsx from 'clsx';
import CloseIcon from '../../public/icons/sparkle/cancel-simple.svg';
import styles from './styles.module.scss';

interface Props {
  title?: string;
  errors?: Array<string>;
}

const ErrorList: FunctionComponent<Props> = ({ title, errors }) => {
  const [isVisible, setIsVisible] = useState(true);

  const hideError = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    setIsVisible(true);
  }, [errors]);

  return isVisible && errors.length > 0 ? (
    <div className={clsx(styles.error)}>
      <p className={styles.error__title}>
        <span data-testid="error-list-title">{title}</span>
        <span className={styles.error__icon} onClick={hideError}>
          <CloseIcon />
        </span>
      </p>
      {errors && errors.length > 0 && (
        <ul className={styles.error__list}>
          {errors.map((e) => (
            <li data-testid="error-list-errortext" key={`${e}`}>{e}</li>
          ))}
        </ul>
      )}
    </div>
  ) : null;
};

ErrorList.defaultProps = {
  title: 'Please fix following errors'
};

export default ErrorList;
