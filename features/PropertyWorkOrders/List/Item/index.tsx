import { FunctionComponent } from 'react';
import workOrderModel from '../../../../common/models/yardi/workOrder';
import stringUtil from '../../../../common/utils/string';
import dateUtil from '../../../../common/utils/date';
import { phoneNumber } from '../../../../common/utils/humanize';

interface Props {
  workOrder: workOrderModel;
}

const WorkOrderListItem: FunctionComponent<Props> = ({ workOrder }) => {
  const hasUnitOrResident = Boolean(workOrder.unit || workOrder.resident);
  const hasUpdateInfo = Boolean(workOrder.updatedAt || workOrder.updatedBy);
  const hasAnyRequestorContactInfo = Boolean(
    workOrder.requestorName ||
      workOrder.requestorEmail ||
      workOrder.requestorPhone
  );
  const hasCategoryOrPriority = Boolean(
    workOrder.category || workOrder.priority
  );

  return (
    <li>
      <aside>
        <div>
          <span data-testid="order-id">{workOrder.id}</span>
          {workOrder.requestDate && (
            <span data-testid="request-date">{workOrder.requestDate}</span>
          )}
        </div>
        {workOrder.status && (
          <div data-testid="order-status">
            {stringUtil.titleize(workOrder.status)}
          </div>
        )}
      </aside>

      {hasUnitOrResident && (
        <div>
          {workOrder.unit && (
            <div data-testid="work-order-unit">
              <h6>Unit:</h6> {workOrder.unit}
            </div>
          )}
          {workOrder.resident && (
            <div data-testid="work-order-resident">
              <h6>Tenant:</h6> {workOrder.resident}
            </div>
          )}
        </div>
      )}

      {hasUpdateInfo && (
        <div>
          {workOrder.updatedAt && (
            <div data-testid="updated-at">
              <h6>Updated:</h6>
              {dateUtil.toUserDateTimeDisplay(workOrder.updatedAt)}
            </div>
          )}
          {workOrder.updatedBy && (
            <div data-testid="updated-by">
              <h6>By:</h6> {workOrder.updatedBy}
            </div>
          )}
        </div>
      )}

      {workOrder.description && (
        <div data-testid="order-description">
          <h6>Description:</h6> {workOrder.description}
        </div>
      )}

      {hasCategoryOrPriority && (
        <div>
          {workOrder.category && (
            <div data-testid="order-category">
              <h6>Category:</h6> {workOrder.category}
            </div>
          )}
          {workOrder.priority && (
            <div data-testid="order-priority">
              <h6>Priority:</h6> {workOrder.priority}
            </div>
          )}
        </div>
      )}

      {workOrder.problemNotes && (
        <div data-testid="problem-notes">
          <h6>Problem Notes:</h6> {workOrder.problemNotes}
        </div>
      )}

      {workOrder.technicianNotes && (
        <div data-testid="technician-notes">
          <h6>Technician Notes:</h6> {workOrder.technicianNotes}
        </div>
      )}

      {typeof workOrder.tenantCaused !== 'undefined' && (
        <div data-testid="tenant-caused">
          <h6>Tenant Caused:</h6> {workOrder.tenantCaused ? 'YES' : 'NO'}
        </div>
      )}

      {typeof workOrder.permissionToEnter !== 'undefined' && (
        <div data-testid="permission-enter">
          <h6>Has Permission to Enter:</h6>
          {workOrder.permissionToEnter ? 'YES' : 'NO'}
        </div>
      )}

      {hasAnyRequestorContactInfo && (
        <div>
          <h6>Requestor:</h6>
          {workOrder.requestorName && (
            <span data-testid="requestor-name">{workOrder.requestorName}</span>
          )}
          {workOrder.requestorEmail && (
            <span data-testid="requestor-email">
              ({workOrder.requestorEmail}){workOrder.requestorPhone}{' '}
              <span> / </span>
            </span>
          )}
          {workOrder.requestorPhone && (
            <span data-testid="requestor-phone">
              {phoneNumber(workOrder.requestorPhone)}
            </span>
          )}
        </div>
      )}

      {workOrder.origin && (
        <div data-testid="order-origin">
          <h6>Origin:</h6> {workOrder.origin}
        </div>
      )}
    </li>
  );
};

export default WorkOrderListItem;
