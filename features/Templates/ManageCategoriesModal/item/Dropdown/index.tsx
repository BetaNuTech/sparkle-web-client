import { FunctionComponent } from 'react';
import ActionsIcon from '../../../../../public/icons/ios/actions.svg';
import Dropdown, { DropdownButton } from '../../../../../common/Dropdown';
import styles from './styles.module.scss';

const ManageCategoriesDropdown: FunctionComponent = () => (
  <div className={styles.container}>
    <ActionsIcon />
    <Dropdown>
      <DropdownButton type="button">Delete</DropdownButton>
    </Dropdown>
  </div>
);

export default ManageCategoriesDropdown;
