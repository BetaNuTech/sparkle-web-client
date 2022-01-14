/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import clsx from 'clsx';
import { FunctionComponent, MouseEvent } from 'react';
import ThumbsUpSimpleIcon from '../../../public/icons/sparkle/thumbs-up-simple.svg';
import ThumbsDownSimpleIcon from '../../../public/icons/sparkle/thumbs-down-simple.svg';
import styles from '../styles.module.scss';

interface Props {
  selected?: boolean;
  value?: number;
  onChange?(event: MouseEvent<HTMLLIElement>, value: string | number): void;
  canEdit?: boolean;
}

const TwoActionThumb: FunctionComponent<Props> = ({
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
          selected && value === 0 && styles['inspection__input--selected']
        )}
        data-testid="control-thumbs-up"
        data-test={selected && value === 0 ? 'selected' : ''}
        data-test-control="true"
        onClick={(event) => canEdit && onInputChange(event, 0)}
      >
        <ThumbsUpSimpleIcon />
      </li>
      <li
        className={clsx(
          styles.inspection__input,
          selected && value === 1 && styles['inspection__input--selectedError']
        )}
        data-testid="control-thumbs-down"
        data-test={selected && value === 1 ? 'selected' : ''}
        data-test-control="true"
        onClick={(event) => canEdit && onInputChange(event, 1)}
      >
        <ThumbsDownSimpleIcon />
      </li>
    </ul>
  );
};

TwoActionThumb.defaultProps = {
  selected: false,
  canEdit: false,
  value: -1
};

export default TwoActionThumb;
