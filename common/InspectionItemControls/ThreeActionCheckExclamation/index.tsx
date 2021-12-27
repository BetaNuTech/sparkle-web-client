/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { FunctionComponent } from 'react';
import clsx from 'clsx';
import CheckmarkSimpleIcon from '../../../public/icons/sparkle/checkmark-simple.svg';
import CancelSimpleIcon from '../../../public/icons/sparkle/cancel-simple.svg';
import CautionSimpleIcon from '../../../public/icons/sparkle/caution-simple.svg';
import styles from '../styles.module.scss';

interface Props {
  selected?: boolean;
  selectedValue?: number;
  onMainInputChange?(
    event: React.MouseEvent<HTMLLIElement>,
    value: string | number
  ): void;
  isDisabled?: boolean;
}

const ThreeActionCheckExclamation: FunctionComponent<Props> = ({
  selected,
  selectedValue,
  onMainInputChange,
  isDisabled
}) => {
  const onInputChange = (
    event: React.MouseEvent<HTMLLIElement>,
    value: number
  ) => {
    if (!isDisabled) onMainInputChange(event, value);
  };

  return (
    <>
      <ul className={styles.inspection}>
        <li
          className={clsx(
            styles.inspection__input,
            selected &&
              selectedValue === 0 &&
              styles['inspection__input--selected']
          )}
          data-testid="control-icon-checkmark"
          data-test={selected && selectedValue === 0 ? 'selected' : ''}
          data-test-control="true"
          onClick={(event) => onInputChange(event, 0)}
        >
          <CheckmarkSimpleIcon />
        </li>
        <li
          className={clsx(
            styles.inspection__input,
            selected &&
              selectedValue === 1 &&
              styles['inspection__input--selectedOk']
          )}
          data-testid="control-icon-caution"
          data-test={selected && selectedValue === 1 ? 'selected' : ''}
          data-test-control="true"
          onClick={(event) => onInputChange(event, 1)}
        >
          <CautionSimpleIcon />
        </li>
        <li
          className={clsx(
            styles.inspection__input,
            selected &&
              selectedValue === 2 &&
              styles['inspection__input--selectedError']
          )}
          data-testid="control-icon-cancel"
          data-test={selected && selectedValue === 2 ? 'selected' : ''}
          data-test-control="true"
          onClick={(event) => onInputChange(event, 2)}
        >
          <CancelSimpleIcon />
        </li>
      </ul>
    </>
  );
};

ThreeActionCheckExclamation.defaultProps = {
  isDisabled: false
};

export default ThreeActionCheckExclamation;
