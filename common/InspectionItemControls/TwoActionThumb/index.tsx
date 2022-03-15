/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import clsx from 'clsx';
import { FunctionComponent, MouseEvent } from 'react';
import ThumbsUpSimpleIcon from '../../../public/icons/sparkle/thumbs-up-simple.svg';
import ThumbsDownSimpleIcon from '../../../public/icons/sparkle/thumbs-down-simple.svg';
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

const TwoActionThumb: FunctionComponent<Props> = ({
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
          selected && value === 0 && styles['inspection__input--selected'],
          showValues &&
            selectedToScore === 0 &&
            styles['inspection__input--selectingScore']
        )}
        data-testid="control-thumbs-up"
        data-test={selected && value === 0 ? 'selected' : ''}
        data-test-selecting-score={showValues && selectedToScore === 0}
        data-test-control="true"
        onClick={(event) => canEdit && onInputChange(event, 0)}
        onMouseDown={(event) => onMouseDown && onMouseDown(event, 0)}
      >
        <ThumbsUpSimpleIcon />
        {showValues && (
          <span className={styles.inspection__inputValue}>
            {item?.mainInputZeroValue}
          </span>
        )}
      </li>
      <li
        className={clsx(
          styles.inspection__input,
          canEdit ? styles['inspection__input--canEdit'] : '',
          selected && value === 1 && styles['inspection__input--selectedError'],
          showValues &&
            selectedToScore === 1 &&
            styles['inspection__input--selectingScore']
        )}
        data-testid="control-thumbs-down"
        data-test={selected && value === 1 ? 'selected' : ''}
        data-test-selecting-score={showValues && selectedToScore === 1}
        data-test-control="true"
        onClick={(event) => canEdit && onInputChange(event, 1)}
        onMouseDown={(event) => onMouseDown && onMouseDown(event, 1)}
      >
        <ThumbsDownSimpleIcon />
        {showValues && (
          <span className={styles.inspection__inputValue}>
            {item?.mainInputOneValue}
          </span>
        )}
      </li>
    </ul>
  );
};

TwoActionThumb.defaultProps = {
  selected: false,
  canEdit: false,
  value: -1,
  showValues: false,
  selectedToScore: -1
};

export default TwoActionThumb;
