import { FunctionComponent } from 'react';
import { useMediaQuery } from 'react-responsive';
import propertyModel from '../../common/models/property';
import workOrderModel from '../../common/models/yardi/workOrder';
import breakpoints from '../../config/breakpoints';
import WorkOrderList from './List';
import useSorting from './hooks/useSorting';
import Header from './Header';

interface Props {
  isOnline?: boolean;
  isStaging?: boolean;
  isNavOpen?: boolean;
  forceVisible?: boolean;
  property: propertyModel;
  workOrders: workOrderModel[];
}

const PropertyWorkOrders: FunctionComponent<Props> = ({
  workOrders,
  property,
  isOnline,
  isStaging,
  forceVisible
}) => {
  const {
    sortedWorkOrders,
    userFacingSortBy,
    nextWorkOrdersSort,
    sortDir,
    sortBy
  } = useSorting(workOrders);

  // Responsive queries
  const isMobile = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });

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
      />
      <WorkOrderList
        workOrders={sortedWorkOrders}
        forceVisible={forceVisible}
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
