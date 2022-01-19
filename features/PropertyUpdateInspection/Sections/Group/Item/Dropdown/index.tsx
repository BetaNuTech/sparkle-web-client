import { FunctionComponent } from 'react';
import ActionsIcon from '../../../../../../public/icons/ios/actions.svg';
import Dropdown, { DropdownButton } from '../../../../../../common/Dropdown';
import styles from './styles.module.scss';

interface DropdownProps {
  isItemNA: boolean;
  onChangeItemNA(isItemNA: boolean): void;
}

const ItemDropdown: FunctionComponent<DropdownProps> = ({
  isItemNA,
  onChangeItemNA
}) => (
  <div className={styles.container}>
    <ActionsIcon />

    <Dropdown>
      {isItemNA ? (
        <DropdownButton
          type="button"
          onClick={() => onChangeItemNA(false)}
          data-testid="button-change-NA-add"
        >
          Add
        </DropdownButton>
      ) : (
        <DropdownButton
          type="button"
          onClick={() => onChangeItemNA(true)}
          data-testid="button-change-NA"
        >
          NA
        </DropdownButton>
      )}
    </Dropdown>
  </div>
);

ItemDropdown.defaultProps = {};

export default ItemDropdown;
