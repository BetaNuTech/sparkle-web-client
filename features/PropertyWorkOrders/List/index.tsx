import { FunctionComponent } from 'react';
import workOrderModel from '../../../common/models/yardi/workOrder';
import Item from './Item';
import styles from './styles.module.scss';

interface Props {
  workOrders: workOrderModel[];
}

const WorkOrderList: FunctionComponent<Props> = ({ workOrders }) => (
  <div className={styles.container}>
    <ul data-testid="workorders-list">
      {workOrders.map((workOrder) => (
        <Item key={workOrder.id} workOrder={workOrder} />
      ))}
    </ul>
  </div>
);

export default WorkOrderList;
