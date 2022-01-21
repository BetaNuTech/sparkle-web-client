/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import clsx from 'clsx';
import { FunctionComponent, MouseEvent } from 'react';
import ASimpleIcon from '../../../public/icons/sparkle/a-simple.svg';
import BSimpleIcon from '../../../public/icons/sparkle/b-simple.svg';
import CSimpleIcon from '../../../public/icons/sparkle/c-simple.svg';
import styles from '../styles.module.scss';

interface Props {
  selected?: boolean;
  value?: number;
  onChange?(event: MouseEvent<HTMLLIElement>, value: string | number): void;
  canEdit?: boolean;
}

const ThreeActionAbc: FunctionComponent<Props> = ({
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
          data-testid="control-icon-a"
          data-test={selected && value === 0 ? 'selected' : ''}
          data-test-control="true"
          onClick={(event) => canEdit && onInputChange(event, 0)}
        >
          <ASimpleIcon />
        </li>
        <li
          className={clsx(
            styles.inspection__input,
            canEdit ? styles['inspection__input--canEdit'] : '',
            selected && value === 1 && styles['inspection__input--selectedOk']
          )}
          data-testid="control-icon-b"
          data-test={selected && value === 1 ? 'selected' : ''}
          data-test-control="true"
          onClick={(event) => canEdit && onInputChange(event, 1)}
        >
          <BSimpleIcon />
        </li>
        <li
          className={clsx(
            styles.inspection__input,
            canEdit ? styles['inspection__input--canEdit'] : '',
            selected &&
              value === 2 &&
              styles['inspection__input--selectedError']
          )}
          data-testid="control-icon-c"
          data-test={selected && value === 2 ? 'selected' : ''}
          data-test-control="true"
          onClick={(event) => canEdit && onInputChange(event, 2)}
        >
          <CSimpleIcon />
        </li>
      </ul>
    </>
  );
};

ThreeActionAbc.defaultProps = {
  selected: false,
  canEdit: false,
  value: -1
};

export default ThreeActionAbc;
