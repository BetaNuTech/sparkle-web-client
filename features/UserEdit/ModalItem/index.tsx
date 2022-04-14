import clsx from 'clsx';
import { FunctionComponent } from 'react';
import PropertyModel from '../../../common/models/property';
import TeamModel from '../../../common/models/team';
import CheckedIcon from '../../../public/icons/sparkle/checked.svg';
import NotCheckedIcon from '../../../public/icons/sparkle/not-checked.svg';
import styles from './styles.module.scss';

interface Props {
  item: PropertyModel | TeamModel;
  onClick(itemId: string): void;
  isSelected: boolean;
}

const ModalItem: FunctionComponent<Props> = ({ item, onClick, isSelected }) => (
  // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
  <li
    key={item.id}
    className={clsx(styles.item, isSelected && styles['item--selected'])}
    onClick={() => onClick(item.id)}
  >
    <span>{item.name}</span>
    <span>
      {isSelected ? (
        <CheckedIcon className={styles.icon} />
      ) : (
        <NotCheckedIcon className={styles.icon} />
      )}
    </span>
  </li>
);

export default ModalItem;
