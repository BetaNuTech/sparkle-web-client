import { useSelector, useDispatch } from 'react-redux';
import { selectActiveSortOfProperties } from '../../../app/ducks/properties/selectors';
import { setActiveSortOfProperties } from '../../../app/ducks/properties/actionCreators';
import { filters } from '../../../common/utils/propertiesSorting';
import styles from './FolderSortButton.module.scss';
import FolderIcon from '../../../public/icons/ios/folder.svg';

export const FolderSortButton = () => {
  const dispatch = useDispatch();
  const activeSort = useSelector(selectActiveSortOfProperties);

  const changeSort = () => {
    // Cycle Through Active `_filters`
    const activeFilter =
      filters[filters.indexOf(activeSort.sortBy) + 1] || filters[0]; // Get Next Filter Or Loop To First

    // Update Property Filter
    dispatch(
      setActiveSortOfProperties({
        ...activeSort,
        sortBy: activeFilter
      })
    );
  };

  return (
    <button className={styles.folderSortButton}>
      <FolderIcon onClick={changeSort} />
    </button>
  );
};
