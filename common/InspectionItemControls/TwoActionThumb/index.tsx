/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { FunctionComponent } from 'react';
import clsx from 'clsx';
import ThumbsUpSimpleIcon from '../../../public/icons/sparkle/thumbs-up-simple.svg';
import ThumbsDownSimpleIcon from '../../../public/icons/sparkle/thumbs-down-simple.svg';
import styles from '../styles.module.scss';

interface Props {
  selected?: boolean;
  selectedValue?: number;
  onMainInputChange?(
    event: React.MouseEvent<HTMLLIElement>,
    value: string|number
  ): void;
}

const TwoActionThumb: FunctionComponent<Props> = ({
  selected,
  selectedValue,
  onMainInputChange
}) => (
  <ul className={styles.inspection}>
    <li
      className={clsx(
        styles.inspection__input,
        selected && selectedValue === 0 && styles['inspection__input--selected']
      )}
      data-testid="control-thumbs-up"
      data-test={selected && selectedValue === 0 ? 'selected' : ''}
      onClick={(event) => onMainInputChange(event, 0)}
    >
      <ThumbsUpSimpleIcon />
    </li>
    <li
      className={clsx(
        styles.inspection__input,
        selected &&
          selectedValue === 1 &&
          styles['inspection__input--selectedError']
      )}
      data-testid="control-thumbs-down"
      data-test={selected && selectedValue === 1 ? 'selected' : ''}
      onClick={(event) => onMainInputChange(event, 1)}
    >
      <ThumbsDownSimpleIcon />
    </li>
  </ul>
);

TwoActionThumb.defaultProps = {};

export default TwoActionThumb;
