import clsx from 'clsx';
import { FunctionComponent } from 'react';
import styles from './Header.module.scss';
import AddIcon from '../../../public/icons/ios/add.svg';
import Dropdown from '../DropdownAdd';

interface PropertiesHeaderModel {
  sortBy: string;
  sortDir: string;
  onSortChange: any;
  canAddTeam: boolean;
  canAddProperty: boolean;
}

const Header: FunctionComponent<PropertiesHeaderModel> = ({
  sortBy,
  sortDir,
  onSortChange,
  canAddTeam,
  canAddProperty
}) => (
  <header className={styles.header} data-testid="properties-header">
    {/* Title And Create Button */}
    <h1 className={styles.header__title}>Properties</h1>

    <aside className={styles.header__controls}>
      {(canAddTeam || canAddProperty) && (
        <div
          className={styles['header-item']}
          data-testid="property-list-create"
        >
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
            <Dropdown canAddTeam={canAddTeam} canAddProperty={canAddProperty} />
          </button>
        </div>
      )}

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

Header.defaultProps = {
  sortBy: 'name',
  sortDir: 'asc'
};

export default Header;
