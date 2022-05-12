import clsx from 'clsx';
import { FunctionComponent } from 'react';
import SortDropdown from '../../SortDropdown';
import parentStyles from '../styles.module.scss';
import styles from './styles.module.scss';
import AddIcon from '../../../public/icons/ios/add.svg';
import Dropdown from '../../../features/Properties/DropdownAdd';

const sortOptions = [
  { label: 'Name', value: 'name' },
  { label: 'City', value: 'city' },
  { label: 'State', value: 'state' },
  { label: 'Last Entry Date', value: 'lastInspectionDate' },
  { label: 'Last Entry Score', value: 'lastInspectionScore' }
];

interface Props {
  sortBy: string;
  sortDir: string;
  onSortChange: any;
  canAddTeam: boolean;
  canAddProperty: boolean;
  headerTitle?: string;
  onAddTeam?: () => void;
}

const Header: FunctionComponent<Props> = ({
  sortBy,
  sortDir,
  onSortChange,
  canAddTeam,
  canAddProperty,
  headerTitle,
  onAddTeam
}) => (
  <header
    className={clsx(parentStyles.container__header, styles.header)}
    data-testid="properties-header"
  >
    {/* Title And Create Button */}
    <h1 className={styles.header__title}>
      {!headerTitle ? 'Properties' : headerTitle}
    </h1>

    <aside className={styles.header__controls}>
      {(canAddTeam || canAddProperty) && (
        <div className={styles.header__item} data-testid="property-list-create">
          <div
            className={clsx(
              styles.header__item__createButton,
              styles['header__item__createButton--dropdown']
            )}
          >
            Create
            <span className="iconAddButton">
              <AddIcon />
            </span>
            <Dropdown
              canAddTeam={canAddTeam}
              canAddProperty={canAddProperty}
              onAddTeam={onAddTeam}
            />
          </div>
        </div>
      )}

      {/* Sort By, Selector */}
      <SortDropdown
        options={sortOptions}
        onSortChange={onSortChange('sortBy')}
        onSortDirChange={onSortChange('sortDir')}
        sortBy={sortBy}
        sortDir={sortDir}
      />
    </aside>
  </header>
);

Header.defaultProps = {
  sortBy: 'name',
  sortDir: 'asc'
};

export default Header;
