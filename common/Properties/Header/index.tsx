import clsx from 'clsx';
import { FunctionComponent } from 'react';
import styles from './styles.module.scss';
import AddIcon from '../../../public/icons/ios/add.svg';
import Dropdown from '../../../features/Properties/DropdownAdd';

interface PropertiesHeaderModel {
  sortBy: string;
  sortDir: string;
  onSortChange: any;
  canAddTeam: boolean;
  canAddProperty: boolean;
  headerTitle?: string;
}

const Header: FunctionComponent<PropertiesHeaderModel> = ({
  sortBy,
  sortDir,
  onSortChange,
  canAddTeam,
  canAddProperty,
  headerTitle
}) => (
  <header className={styles.header} data-testid="properties-header">
    {/* Title And Create Button */}
    <h1 className={styles.header__title}>
      {!headerTitle ? 'Properties' : headerTitle}
    </h1>

    <aside className={styles.header__controls}>
      {(canAddTeam || canAddProperty) && (
        <div className={styles.header__item} data-testid="property-list-create">
          <button
            className={clsx(
              styles.header__item__createButton,
              styles['header__item__createButton--dropdown']
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
      <div className={styles.header__item}>
        <label
          htmlFor="properties-sort-by"
          className={styles.header__item__label}
        >
          Sort by:
        </label>

        <select
          id="properties-sort-by"
          value={sortBy}
          onChange={onSortChange('sortBy')}
          className={styles.header__item__menu}
        >
          <option value="name">Name</option>
          <option value="city">City</option>
          <option value="state">State</option>
          <option value="lastInspectionDate">Last Entry Date</option>
          <option value="lastInspectionScore">Last Entry Score</option>
        </select>
      </div>

      {/* Sort Direction, Selector */}
      <div className={styles.header__item}>
        <button
          aria-label="Change the sort direction"
          onClick={onSortChange('sortDir')}
          className={clsx(
            styles.header__item__sortDirButton,
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
