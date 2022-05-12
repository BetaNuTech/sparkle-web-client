import { FunctionComponent } from 'react';
import clsx from 'clsx';

import styles from './styles.module.scss';

import CheckedIcon from '../../../../../public/icons/sparkle/checked.svg';
import NotCheckedIcon from '../../../../../public/icons/sparkle/not-checked.svg';
import {
  trelloBoard,
  trelloList
} from '../../../../../common/services/api/trello';

interface Props {
  selectedOption: trelloList | trelloBoard;
  onSelect: (item: trelloList | trelloBoard) => void;
  item: trelloList;
}

const Item: FunctionComponent<Props> = ({ selectedOption, onSelect, item }) => (
  <li className={styles.item} key={item.id}>
    <input
      type="checkbox"
      id={item.id}
      data-testid={`checkbox-item-${item.id}`}
      className={styles.item__input}
      checked={selectedOption.id === item.id}
      onChange={() => onSelect(item)}
      value={item.id}
    />
    <label
      htmlFor={item.id}
      className={clsx(
        styles.item__label,
        ['-ml-none', '-d-flex'],
        selectedOption.id === item.id && styles['-isChecked']
      )}
    >
      <div>{item.name}</div>
      {selectedOption.id === item.id ? (
        <CheckedIcon className={styles.item__label__icon} />
      ) : (
        <NotCheckedIcon className={styles.item__label__icon} />
      )}
    </label>
  </li>
);

export default Item;
