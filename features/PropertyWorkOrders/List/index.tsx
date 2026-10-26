import { ChangeEvent, FunctionComponent, KeyboardEvent } from 'react';
import WorkOrderModel from '../../../common/models/yardi/workOrder';
import SearchBar, { ClearSearchAction } from '../../../common/SearchBar';
import SkeletonLoader from '../../../common/SkeletonLoader';
import Item from './Item';
import styles from './styles.module.scss';

interface Props {
  workOrders: WorkOrderModel[];
  onClickWorkOrder(workOrder: WorkOrderModel): void;
  isLoading?: boolean;
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
  isLoading,
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
    {isLoading ? (
      <SkeletonLoader rows={4} className="-p" />
    ) : (
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
    )}

    {!isLoading && workOrders.length === 0 && (
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

WorkOrderList.defaultProps = {
  isLoading: false,
  forceVisible: false
};

export default WorkOrderList;
