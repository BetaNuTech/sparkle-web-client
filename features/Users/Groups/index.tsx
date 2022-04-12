import clsx from 'clsx';
import { ChangeEvent, FunctionComponent, RefObject } from 'react';
import UserModel from '../../../common/models/user';
import SearchBar, { ClearSearchAction } from '../../../common/SearchBar';
import Item from './Item';
import userConfig from '../../../config/users';
import styles from './styles.module.scss';
import { colorClasses } from '../settings';

const GROUP_COLORS = userConfig.groupColors;

const groupNames = {
  noAccess: 'No Access Users',
  access: 'Access Users',
  disabled: 'Disabled Users'
};

interface Props {
  groups: string[];
  userGroups: Map<string, UserModel[]>;
  scrollElementRef: RefObject<HTMLDivElement>;
  forceVisible: boolean;
  isMobile: boolean;
  searchValue: string;
  onSearchKeyDown(evt: ChangeEvent<HTMLInputElement>): void;
  onClearSearch(): void;
}

const UsersGroups: FunctionComponent<Props> = ({
  groups,
  userGroups,
  scrollElementRef,
  forceVisible,
  isMobile,
  onSearchKeyDown,
  onClearSearch,
  searchValue
}) => (
  <div className={styles.container} ref={scrollElementRef}>
    {!isMobile && (
      <SearchBar
        searchQuery={searchValue}
        onClearSearch={onClearSearch} // eslint-disable-line  @typescript-eslint/no-empty-function
        onSearchKeyDown={onSearchKeyDown} // eslint-disable-line  @typescript-eslint/no-empty-function
      />
    )}

    {groups.map((group) => {
      const users = userGroups.get(group);
      const colorClass = colorClasses[GROUP_COLORS[group]];

      return (
        <div key={group}>
          <h3 className={clsx(styles.heading, colorClass)}>
            {groupNames[group]}
          </h3>
          <ul>
            {users.map((user) => (
              <Item user={user} forceVisible={forceVisible} key={user.id} />
            ))}
          </ul>
        </div>
      );
    })}
    <ClearSearchAction
      searchQuery={searchValue}
      onClearSearch={onClearSearch}
    />
  </div>
);

export default UsersGroups;
