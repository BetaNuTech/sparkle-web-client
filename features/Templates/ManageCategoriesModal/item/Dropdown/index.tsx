import { FunctionComponent } from 'react';
import ActionsIcon from '../../../../../public/icons/ios/actions.svg';
import Dropdown, { DropdownButton } from '../../../../../common/Dropdown';
import styles from './styles.module.scss';

interface Props {
  onDeleteCategory(): void;
}

const ManageCategoriesDropdown: FunctionComponent<Props> = ({
  onDeleteCategory
}) => (
  <div className={styles.container}>
    <ActionsIcon />
    <Dropdown>
      <DropdownButton onClick={onDeleteCategory} type="button">
        Delete
      </DropdownButton>
    </Dropdown>
  </div>
);

export default ManageCategoriesDropdown;
