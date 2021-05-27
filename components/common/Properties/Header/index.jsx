import clsx from 'clsx';
import PropTypes from 'prop-types';
import styles from './Header.module.scss';
import { Dropdown } from '../../../shared/Dropdown';
import AddIcon from '../../../../public/icons/ios/add.svg';

export const Header = ({ isAscendingSort, setIsAscendingSort }) => (
  <header className={styles.header}>
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
        <label htmlFor="sort" className={styles['header-item__label']}>
          Sort by:
        </label>

        <select id="sort" className={styles['header-item__menu']}>
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
          onClick={() => setIsAscendingSort(!isAscendingSort)}
          className={
            isAscendingSort
              ? clsx(styles['header-item__sortDirButton'], styles['-asc'])
              : clsx(styles['header-item__sortDirButton'], styles['-desc'])
          }
        />
      </div>
    </aside>
  </header>
);

Header.propTypes = {
  isAscendingSort: PropTypes.bool.isRequired,
  setIsAscendingSort: PropTypes.func.isRequired
};
