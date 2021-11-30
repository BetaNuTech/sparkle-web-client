/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { FunctionComponent } from 'react';
import clsx from 'clsx';
import OneSimpleIcon from '../../../public/icons/sparkle/one-simple.svg';
import TwoSimpleIcon from '../../../public/icons/sparkle/two-simple.svg';
import ThreeSimpleIcon from '../../../public/icons/sparkle/three-simple.svg';
import FourSimpleIcon from '../../../public/icons/sparkle/four-simple.svg';
import FiveSimpleIcon from '../../../public/icons/sparkle/five-simple.svg';
import styles from '../styles.module.scss';

interface Props {
  selected?: boolean;
  selectedValue?: number;
  onMainInputChange?(
    event: React.MouseEvent<HTMLLIElement>,
    value: string | number
  ): void;
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
  selectedValue,
  onMainInputChange
}) => (
  <ul className={styles.inspection}>
    <li
      className={clsx(
        styles.inspection__input,
        getSelectionStyle(selected, selectedValue, 0)
      )}
      onClick={(event) => onMainInputChange(event, 0)}
    >
      <OneSimpleIcon />
    </li>
    <li
      className={clsx(
        styles.inspection__input,
        getSelectionStyle(selected, selectedValue, 1)
      )}
      onClick={(event) => onMainInputChange(event, 1)}
    >
      <TwoSimpleIcon />
    </li>
    <li
      className={clsx(
        styles.inspection__input,
        getSelectionStyle(selected, selectedValue, 2)
      )}
      onClick={(event) => onMainInputChange(event, 2)}
    >
      <ThreeSimpleIcon />
    </li>
    <li
      className={clsx(
        styles.inspection__input,
        getSelectionStyle(selected, selectedValue, 3)
      )}
      onClick={(event) => onMainInputChange(event, 3)}
    >
      <FourSimpleIcon />
    </li>
    <li
      className={clsx(
        styles.inspection__input,
        getSelectionStyle(selected, selectedValue, 4)
      )}
      onClick={(event) => onMainInputChange(event, 4)}
    >
      <FiveSimpleIcon />
    </li>
  </ul>
);

FiveActionOneToFive.defaultProps = {};

export { canAddClass };
export default FiveActionOneToFive;
