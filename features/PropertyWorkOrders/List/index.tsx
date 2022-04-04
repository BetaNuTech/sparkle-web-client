import { ChangeEvent, FunctionComponent, KeyboardEvent } from 'react';
import WorkOrderModel from '../../../common/models/yardi/workOrder';
import SearchBar, { ClearSearchAction } from '../../../common/SearchBar';
import Item from './Item';
import styles from './styles.module.scss';

interface Props {
  workOrders: WorkOrderModel[];
  onClickWorkOrder(workOrder: WorkOrderModel): void;
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
  onClickWorkOrder,
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
          onClickWorkOrder={onClickWorkOrder}
          forceVisible={forceVisible}
          isMobile={isMobile}
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
