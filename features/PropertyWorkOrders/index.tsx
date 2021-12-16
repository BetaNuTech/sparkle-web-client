import clsx from 'clsx';
import { FunctionComponent } from 'react';
import propertyModel from '../../common/models/property';
import workOrderModel from '../../common/models/yardi/workOrder';
import WorkOrderList from './List';
import useSorting from './hooks/useSorting';
import FolderIcon from '../../public/icons/ios/folder.svg';
import MobileHeader from '../../common/MobileHeader';
import styles from './styles.module.scss';

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
  isStaging
}) => {
  const { sortedWorkOrders, userFacingSortBy, nextWorkOrdersSort } =
    useSorting(workOrders);

  // Mobile Header actions buttons
  const mobileHeaderActions = (headStyle) => (
    <>
      <button
        className={headStyle.header__button}
        data-testid="mobile-property-profile-sort-by"
        onClick={nextWorkOrdersSort}
      >
        <FolderIcon />
      </button>
    </>
  );

  return (
    <>
      <MobileHeader
        title={`${property.name.toUpperCase()} WOs`}
        isOnline={isOnline}
        isStaging={isStaging}
        actions={mobileHeaderActions}
      />
      <footer
        className={clsx(styles.header__footer)}
        data-testid="property-workOrders-mobile-footer"
      >
        Sorted by {userFacingSortBy}
      </footer>
      <WorkOrderList workOrders={sortedWorkOrders} />
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
