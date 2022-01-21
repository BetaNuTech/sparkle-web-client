/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import clsx from 'clsx';
import { FunctionComponent, MouseEvent } from 'react';
import CheckmarkSimpleIcon from '../../../public/icons/sparkle/checkmark-simple.svg';
import CancelSimpleIcon from '../../../public/icons/sparkle/cancel-simple.svg';
import CautionSimpleIcon from '../../../public/icons/sparkle/caution-simple.svg';
import styles from '../styles.module.scss';

interface Props {
  selected?: boolean;
  value?: number;
  onChange?(event: MouseEvent<HTMLLIElement>, value: string | number): void;
  canEdit?: boolean;
}

const ThreeActionCheckExclamation: FunctionComponent<Props> = ({
  selected,
  value,
  onChange,
  canEdit
}) => {
  const onInputChange = (event: MouseEvent<HTMLLIElement>, update: number) => {
    onChange(event, update);
  };

  return (
    <>
      <ul className={styles.inspection}>
        <li
          className={clsx(
            styles.inspection__input,
            canEdit ? styles['inspection__input--canEdit'] : '',
            selected && value === 0 && styles['inspection__input--selected']
          )}
          data-testid="control-icon-checkmark"
          data-test={selected && value === 0 ? 'selected' : ''}
          data-test-control="true"
          onClick={(event) => canEdit && onInputChange(event, 0)}
        >
          <CheckmarkSimpleIcon />
        </li>
        <li
          className={clsx(
            styles.inspection__input,
            canEdit ? styles['inspection__input--canEdit'] : '',
            selected && value === 1 && styles['inspection__input--selectedOk']
          )}
          data-testid="control-icon-caution"
          data-test={selected && value === 1 ? 'selected' : ''}
          data-test-control="true"
          onClick={(event) => canEdit && onInputChange(event, 1)}
        >
          <CautionSimpleIcon />
        </li>
        <li
          className={clsx(
            styles.inspection__input,
            canEdit ? styles['inspection__input--canEdit'] : '',
            selected &&
              value === 2 &&
              styles['inspection__input--selectedError']
          )}
          data-testid="control-icon-cancel"
          data-test={selected && value === 2 ? 'selected' : ''}
          data-test-control="true"
          onClick={(event) => canEdit && onInputChange(event, 2)}
        >
          <CancelSimpleIcon />
        </li>
      </ul>
    </>
  );
};

ThreeActionCheckExclamation.defaultProps = {
  selected: false,
  canEdit: false,
  value: -1
};

export default ThreeActionCheckExclamation;
