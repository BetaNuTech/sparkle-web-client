import { ChangeEvent, FunctionComponent, KeyboardEvent } from 'react';
import workOrderModel from '../../../common/models/yardi/workOrder';
import SearchBar, { ClearSearchAction } from '../../../common/SearchBar';
import Item from './Item';
import styles from './styles.module.scss';

interface Props {
  workOrders: workOrderModel[];
  forceVisible?: boolean;
  searchQuery: string;
  onSearchKeyDown: (
    ev: KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>
  ) => void;
  onClearSearch(): void;
  isMobile: boolean;
}

const WorkOrderList: FunctionComponent<Props> = ({
  workOrders,
  forceVisible,
  searchQuery,
  onSearchKeyDown,
  onClearSearch,
  isMobile
}) => (
  <div className={styles.container}>
    {!isMobile && (
      <SearchBar
        searchQuery={searchQuery}
        onSearchKeyDown={onSearchKeyDown}
        onClearSearch={onClearSearch}
      />
    )}
    <ul data-testid="workorders-list">
      {workOrders.map((workOrder) => (
        <Item
          key={workOrder.id}
          workOrder={workOrder}
          forceVisible={forceVisible}
        />
      ))}
    </ul>

    {workOrders.length === 0 && (
      <h3 className="-c-gray-light -pt-sm -pl-sm -pb-sm -ta-center">
        {searchQuery
          ? 'No work orders match your search'
          : 'No work orders Found'}
      </h3>
    )}
    <ClearSearchAction
      searchQuery={searchQuery}
      onClearSearch={onClearSearch}
    />
  </div>
);

export default WorkOrderList;
