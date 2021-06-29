import clsx from 'clsx';
import { FunctionComponent } from 'react';
import styles from './Header.module.scss';
import Dropdown from '../DropdownAdd';
import AddIcon from '../../../public/icons/ios/add.svg';

interface PropertiesHeaderModel {
  sortBy: string;
  sortDir: string;
  onSortChange: any;
}

const Header: FunctionComponent<PropertiesHeaderModel> = ({
  sortBy,
  sortDir,
  onSortChange
}) => (
  <header className={styles.header} data-testid="properties-header">
    {/* Title And Create Button */}
    <h1 className={styles.header__title}>Properties</h1>

    <aside className={styles.header__controls}>
      <div className={styles['header-item']}>
        <button
          className={clsx(
            styles['header-item__createButton'],
            styles['header-item__createButton--dropdown']
          )}
        >
          Create
          <span className="iconAddButton">
            <AddIcon />
          </span>
          <Dropdown />
        </button>
      </div>

      {/* Sort By, Selector */}
      <div className={styles['header-item']}>
        <label
          htmlFor="properties-sort-by"
          className={styles['header-item__label']}
        >
          Sort by:
        </label>

        <select
          id="properties-sort-by"
          value={sortBy}
          onChange={onSortChange('sortBy')}
          className={styles['header-item__menu']}
        >
          <option value="name">Name</option>
          <option value="city">City</option>
          <option value="state">State</option>
          <option value="lastInspectionDate">Last Entry Date</option>
          <option value="lastInspectionScore">Last Entry Score</option>
        </select>
      </div>

      {/* Sort Direction, Selector */}
      <div className={styles['header-item']}>
        <button
          aria-label="Change the sort direction"
          onClick={onSortChange('sortDir')}
          className={clsx(
            styles['header-item__sortDirButton'],
            styles[`-${sortDir}`]
          )}
        />
      </div>
    </aside>
  </header>
);

export default Header;
