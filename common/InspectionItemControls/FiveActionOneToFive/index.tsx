/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import clsx from 'clsx';
import { FunctionComponent, MouseEvent } from 'react';
import OneSimpleIcon from '../../../public/icons/sparkle/one-simple.svg';
import TwoSimpleIcon from '../../../public/icons/sparkle/two-simple.svg';
import ThreeSimpleIcon from '../../../public/icons/sparkle/three-simple.svg';
import FourSimpleIcon from '../../../public/icons/sparkle/four-simple.svg';
import FiveSimpleIcon from '../../../public/icons/sparkle/five-simple.svg';
import styles from '../styles.module.scss';

interface Props {
  selected?: boolean;
  value?: number;
  onChange?(
    event: React.MouseEvent<HTMLLIElement>,
    value: string | number
  ): void;
  canEdit?: boolean;
}

const canAddClass = (
  selected: boolean,
  selectedValue: number,
  index: number
): boolean => {
  let canAdd = false;
  if (selected && index <= selectedValue) {
    if (selectedValue < 2) {
      canAdd = true;
    }
    if (selectedValue === 2) {
      canAdd = true;
    }
    if (selectedValue > 2) {
      canAdd = true;
    }
  }
  return canAdd;
};

const getSelectionStyle = (
  selected: boolean,
  selectedValue: number,
  index: number
): string => {
  if (canAddClass(selected, selectedValue, index) && selectedValue < 2) {
    return styles['inspection__input--selectedError'];
  }
  if (canAddClass(selected, selectedValue, index) && selectedValue === 2) {
    return styles['inspection__input--selectedOk'];
  }
  if (canAddClass(selected, selectedValue, index) && selectedValue > 2) {
    return styles['inspection__input--selected'];
  }
  return '';
};

const FiveActionOneToFive: FunctionComponent<Props> = ({
  selected,
  value,
  onChange,
  canEdit
}) => {
  const onInputChange = (event: MouseEvent<HTMLLIElement>, update: number) => {
    onChange(event, update);
  };

  return (
    <ul className={styles.inspection}>
      <li
        className={clsx(
          styles.inspection__input,
          getSelectionStyle(selected, value, 0)
        )}
        data-testid="control-icon-0"
        data-test-control="true"
        onClick={(event) => canEdit && onInputChange(event, 0)}
      >
        <OneSimpleIcon />
      </li>
      <li
        className={clsx(
          styles.inspection__input,
          getSelectionStyle(selected, value, 1)
        )}
        data-testid="control-icon-1"
        data-test-control="true"
        onClick={(event) => canEdit && onInputChange(event, 1)}
      >
        <TwoSimpleIcon />
      </li>
      <li
        className={clsx(
          styles.inspection__input,
          getSelectionStyle(selected, value, 2)
        )}
        data-testid="control-icon-2"
        data-test-control="true"
        onClick={(event) => canEdit && onInputChange(event, 2)}
      >
        <ThreeSimpleIcon />
      </li>
      <li
        className={clsx(
          styles.inspection__input,
          getSelectionStyle(selected, value, 3)
        )}
        data-testid="control-icon-3"
        data-test-control="true"
        onClick={(event) => canEdit && onInputChange(event, 3)}
      >
        <FourSimpleIcon />
      </li>
      <li
        className={clsx(
          styles.inspection__input,
          getSelectionStyle(selected, value, 4)
        )}
        data-testid="control-icon-4"
        data-test-control="true"
        onClick={(event) => canEdit && onInputChange(event, 4)}
      >
        <FiveSimpleIcon />
      </li>
    </ul>
  );
};

FiveActionOneToFive.defaultProps = {
  selected: false,
  canEdit: false,
  value: -1
};

export { canAddClass };
export default FiveActionOneToFive;
