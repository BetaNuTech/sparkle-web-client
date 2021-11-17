import { FunctionComponent } from 'react';
import workOrderModel from '../../common/models/yardi/workOrder';
import WorkOrderList from './List';
import styles from './styles.module.scss';

interface Props {
  isOnline?: boolean;
  isStaging?: boolean;
  isNavOpen?: boolean;
  toggleNavOpen?(): void;
  forceVisible?: boolean;
  workOrders: workOrderModel[];
}

const PropertyWorkOrders: FunctionComponent<Props> = ({ workOrders }) => (
  <>
    <header className={styles.header} data-testid="workorders-header">
      <h1 className={styles.header__title}>Work Orders</h1>
    </header>
    <WorkOrderList workOrders={workOrders} />
  </>
);

PropertyWorkOrders.defaultProps = {
  isOnline: false,
  isStaging: false,
  isNavOpen: false,
  toggleNavOpen: () => {}, // eslint-disable-line
  forceVisible: false
};

export default PropertyWorkOrders;
