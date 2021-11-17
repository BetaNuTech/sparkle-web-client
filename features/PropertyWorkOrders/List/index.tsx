import { FunctionComponent } from 'react';
import workOrderModel from '../../../common/models/yardi/workOrder';
import Item from './Item';

interface Props {
  workOrders: workOrderModel[];
}

const WorkOrderList: FunctionComponent<Props> = ({ workOrders }) => (
  <ul data-testid="workorders-list">
    {workOrders.map((workOrder) => (
      <Item key={workOrder.id} workOrder={workOrder} />
    ))}
  </ul>
);

export default WorkOrderList;
