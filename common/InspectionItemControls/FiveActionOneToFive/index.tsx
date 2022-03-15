/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import clsx from 'clsx';
import { FunctionComponent, MouseEvent } from 'react';
import OneSimpleIcon from '../../../public/icons/sparkle/one-simple.svg';
import TwoSimpleIcon from '../../../public/icons/sparkle/two-simple.svg';
import ThreeSimpleIcon from '../../../public/icons/sparkle/three-simple.svg';
import FourSimpleIcon from '../../../public/icons/sparkle/four-simple.svg';
import FiveSimpleIcon from '../../../public/icons/sparkle/five-simple.svg';
import InspectionTemplateItemModal from '../../models/inspectionTemplateItem';
import styles from '../styles.module.scss';

interface Props {
  item: InspectionTemplateItemModal;
  selected?: boolean;
  value?: number;
  onChange?(event: MouseEvent<HTMLLIElement>, value: string | number): void;
  onMouseDown?(event: MouseEvent<HTMLLIElement>, value: number): void;
  canEdit?: boolean;
  showValues?: boolean;
  selectedToScore?: number;
}

const FiveActionOneToFive: FunctionComponent<Props> = ({
  selected,
  value,
  onChange,
  onMouseDown,
  canEdit,
  showValues,
  item,
  selectedToScore
}) => {
  const onInputChange = (event: MouseEvent<HTMLLIElement>, update: number) => {
    onChange(event, update);
  };

  return (
    <ul
      className={clsx(
        styles.inspection,
        showValues && '-pb-mlg -jc-flex-start -cu-pointer'
      )}
    >
      <li
        className={clsx(
          styles.inspection__input,
          canEdit ? styles['inspection__input--canEdit'] : '',
          getSelectionStyle(selected, value, 0),
          getSelectingScoreStyle(selectedToScore, 0, showValues)
        )}
        data-testid="control-icon-0"
        data-test-control="true"
        data-test-selecting-score={getIsSelectingScore(
          selectedToScore,
          0,
          showValues
        )}
        onClick={(event) => canEdit && onInputChange(event, 0)}
        onMouseDown={(event) => onMouseDown && onMouseDown(event, 0)}
      >
        <OneSimpleIcon />
        {showValues && (
          <span className={styles.inspection__inputValue}>
            {item.mainInputZeroValue}
          </span>
        )}
      </li>
      <li
        className={clsx(
          styles.inspection__input,
          canEdit ? styles['inspection__input--canEdit'] : '',
          getSelectionStyle(selected, value, 1),
          getSelectingScoreStyle(selectedToScore, 1, showValues)
        )}
        data-testid="control-icon-1"
        data-test-control="true"
        data-test-selecting-score={getIsSelectingScore(
          selectedToScore,
          1,
          showValues
        )}
        onClick={(event) => canEdit && onInputChange(event, 1)}
        onMouseDown={(event) => onMouseDown && onMouseDown(event, 1)}
      >
        <TwoSimpleIcon />
        {showValues && (
          <span className={styles.inspection__inputValue}>
            {item.mainInputOneValue}
          </span>
        )}
      </li>
      <li
        className={clsx(
          styles.inspection__input,
          canEdit ? styles['inspection__input--canEdit'] : '',
          getSelectionStyle(selected, value, 2),
          getSelectingScoreStyle(selectedToScore, 2, showValues)
        )}
        data-testid="control-icon-2"
        data-test-control="true"
        data-test-selecting-score={getIsSelectingScore(
          selectedToScore,
          2,
          showValues
        )}
        onClick={(event) => canEdit && onInputChange(event, 2)}
        onMouseDown={(event) => onMouseDown && onMouseDown(event, 2)}
      >
        <ThreeSimpleIcon />
        {showValues && (
          <span className={styles.inspection__inputValue}>
            {item.mainInputTwoValue}
          </span>
        )}
      </li>
      <li
        className={clsx(
          styles.inspection__input,
          canEdit ? styles['inspection__input--canEdit'] : '',
          getSelectionStyle(selected, value, 3),
          getSelectingScoreStyle(selectedToScore, 3, showValues)
        )}
        data-testid="control-icon-3"
        data-test-control="true"
        data-test-selecting-score={getIsSelectingScore(
          selectedToScore,
          3,
          showValues
        )}
        onClick={(event) => canEdit && onInputChange(event, 3)}
        onMouseDown={(event) => onMouseDown && onMouseDown(event, 3)}
      >
        <FourSimpleIcon />
        {showValues && (
          <span className={styles.inspection__inputValue}>
            {item.mainInputThreeValue}
          </span>
        )}
      </li>
      <li
        className={clsx(
          styles.inspection__input,
          canEdit ? styles['inspection__input--canEdit'] : '',
          getSelectionStyle(selected, value, 4),
          getSelectingScoreStyle(selectedToScore, 4, showValues)
        )}
        data-testid="control-icon-4"
        data-test-control="true"
        data-test-selecting-score={getIsSelectingScore(
          selectedToScore,
          4,
          showValues
        )}
        onClick={(event) => canEdit && onInputChange(event, 4)}
        onMouseDown={(event) => onMouseDown && onMouseDown(event, 4)}
      >
        <FiveSimpleIcon />
        {showValues && (
          <span className={styles.inspection__inputValue}>
            {item.mainInputFourValue}
          </span>
        )}
      </li>
    </ul>
  );
};

FiveActionOneToFive.defaultProps = {
  selected: false,
  canEdit: false,
  value: -1,
  showValues: false,
  selectedToScore: -1
};

export default FiveActionOneToFive;

// Logic to conditionally apply
// the score selection styles
function getSelectingScoreStyle(
  selectedValue: number,
  index: number,
  showValues: boolean
): string {
  if (selectedValue === index && showValues) {
    return styles['inspection__input--selectingScore'];
  }
  return '';
}

function getIsSelectingScore(
  selectedValue: number,
  index: number,
  showValues: boolean
): boolean {
  return selectedValue === index && showValues;
}

// Lookup the selection style
// for an input at an index/selection
function getSelectionStyle(
  selected: boolean,
  selectedValue: number,
  index: number
): string {
  if (!canAddSelectionStyles(selected, selectedValue, index)) {
    return '';
  }

  if (selectedValue < 2) {
    return styles['inspection__input--selectedError'];
  }

  if (selectedValue === 2) {
    return styles['inspection__input--selectedOk'];
  }

  if (selectedValue > 2) {
    return styles['inspection__input--selected'];
  }

  return '';
}

// Item may apply the relevant
// selection styles to the inputs
export function canAddSelectionStyles(
  selected: boolean,
  selectedValue: number,
  index: number
): boolean {
  if (!selected || index > selectedValue) {
    return false;
  }

  if (selectedValue < 2) {
    return true;
  }
  if (selectedValue === 2) {
    return true;
  }
  if (selectedValue > 2) {
    return true;
  }

  return false;
}
