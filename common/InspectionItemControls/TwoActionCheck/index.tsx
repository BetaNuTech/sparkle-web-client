/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import clsx from 'clsx';
import { FunctionComponent, MouseEvent } from 'react';
import CheckmarkSimpleIcon from '../../../public/icons/sparkle/checkmark-simple.svg';
import CancelSimpleIcon from '../../../public/icons/sparkle/cancel-simple.svg';
import InspectionTemplateItemModal from '../../models/inspectionTemplateItem';
import styles from '../styles.module.scss';

interface Props {
  item: InspectionTemplateItemModal;
  selected?: boolean;
  value?: number;
  onChange?(event: MouseEvent<HTMLLIElement>, value: string | number): void;
  canEdit?: boolean;
  showValues?: boolean;
}

const TwoActionCheck: FunctionComponent<Props> = ({
  selected,
  value,
  onChange,
  canEdit,
  showValues,
  item
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
          selected && value === 0 && styles['inspection__input--selected']
        )}
        data-testid="control-checkmark"
        data-test={selected && value === 0 ? 'selected' : ''}
        data-test-control="true"
        onClick={(event) => canEdit && onInputChange(event, 0)}
      >
        <CheckmarkSimpleIcon />
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
          selected && value === 1 && styles['inspection__input--selectedError']
        )}
        data-testid="control-cancel"
        data-test={selected && value === 1 ? 'selected' : ''}
        data-test-control="true"
        onClick={(event) => canEdit && onInputChange(event, 1)}
      >
        <CancelSimpleIcon />
        {showValues && (
          <span className={styles.inspection__inputValue}>
            {item.mainInputOneValue}
          </span>
        )}
      </li>
    </ul>
  );
};

TwoActionCheck.defaultProps = {
  selected: false,
  canEdit: false,
  value: -1,
  showValues: false
};

export default TwoActionCheck;
