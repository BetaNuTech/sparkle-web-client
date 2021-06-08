import clsx from 'clsx';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { setActiveSortOfProperties } from '../../../app/ducks/properties/actionCreators';
import styles from './Header.module.scss';
import { Dropdown } from '../../../common/Dropdown';
import AddIcon from '../../../public/icons/ios/add.svg';

export const Header = ({ activeSort }) => {
  const dispatch = useDispatch();
  const currSort = { ...activeSort };

  const onSortChange = (key) => (event) => {
    // Get value from target and target from event
    const {
      target: { value }
    } = event;

    if (key === 'orderBy') {
      // Update orderBy filter
      if (currSort[key] === 'asc') currSort[key] = 'desc';
      else if (currSort[key] === 'desc') currSort[key] = 'asc';
    } else {
      // Update sortBy filter
      currSort[key] = value;
    }

    // Update Property Filter
    dispatch(setActiveSortOfProperties(currSort));
  };

  return (
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

          <select
            id="sort"
            value={activeSort.sortBy}
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
            onClick={onSortChange('orderBy')}
            className={clsx(
              styles['header-item__sortDirButton'],
              styles[`-${activeSort.orderBy}`]
            )}
          />
        </div>
      </aside>
    </header>
  );
};

Header.propTypes = {
  activeSort: PropTypes.shape({
    sortBy: PropTypes.string.isRequired,
    orderBy: PropTypes.string.isRequired
  }).isRequired
};
