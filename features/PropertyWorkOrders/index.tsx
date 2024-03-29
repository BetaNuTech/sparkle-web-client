import { FunctionComponent, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import propertyModel from '../../common/models/property';
import WorkOrderModel from '../../common/models/yardi/workOrder';
import breakpoints from '../../config/breakpoints';
import WorkOrderList from './List';
import useSorting from './hooks/useSorting';
import Header from './Header';
import ContactModal from '../../common/Yardi/ContactModal';
import useSearching from '../../common/hooks/useSearching';
import settings from './settings';

interface Props {
  isOnline?: boolean;
  isStaging?: boolean;
  isNavOpen?: boolean;
  forceVisible?: boolean;
  property: propertyModel;
  workOrders: WorkOrderModel[];
}

const PropertyWorkOrders: FunctionComponent<Props> = ({
  workOrders,
  property,
  isOnline,
  isStaging,
  forceVisible
}) => {
  // Work order search setup
  const { onSearchKeyDown, filteredItems, searchValue, onClearSearch } =
    useSearching(workOrders, settings.workOrderAttributes);
  const filteredWorkOrders = filteredItems.map((itm) => itm as WorkOrderModel);

  const {
    sortedWorkOrders,
    userFacingSortBy,
    nextWorkOrdersSort,
    sortDir,
    sortBy,
    onSortChange,
    onSortDirChange
  } = useSorting(filteredWorkOrders);

  // Responsive queries
  const isMobile = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });

  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const onClickWorkOrder = (workOrder: WorkOrderModel) => {
    setSelectedWorkOrder(workOrder);
  };

  return (
    <>
      <Header
        property={property}
        sortDir={sortDir}
        sortBy={sortBy}
        userFacingSortBy={userFacingSortBy}
        nextResidentsSort={nextWorkOrdersSort}
        isOnline={isOnline}
        isStaging={isStaging}
        isMobile={isMobile}
        searchQuery={searchValue}
        onSearchKeyDown={onSearchKeyDown}
        onClearSearch={onClearSearch}
        onSortChange={onSortChange}
        onSortDirChange={onSortDirChange}
      />
      <WorkOrderList
        workOrders={sortedWorkOrders}
        forceVisible={forceVisible}
        onClickWorkOrder={onClickWorkOrder}
        searchQuery={searchValue}
        onSearchKeyDown={onSearchKeyDown}
        onClearSearch={onClearSearch}
        isMobile={isMobile}
      />
      <ContactModal
        isVisible={Boolean(selectedWorkOrder)}
        onClose={() => setSelectedWorkOrder(null)}
        data={selectedWorkOrder}
        type="workOrder"
      />
    </>
  );
};

PropertyWorkOrders.defaultProps = {
  isOnline: false,
  isStaging: false,
  isNavOpen: false,
  forceVisible: false
};

export default PropertyWorkOrders;
