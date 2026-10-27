import { FunctionComponent } from 'react';
import clsx from 'clsx';
import workOrderModel from '../../../../common/models/yardi/workOrder';
import customValuesModel from '../../../../common/models/yardi/customValues';
import Info, { InfoLabel } from '../../../../common/Yardi/Info';
import dateUtil from '../../../../common/utils/date';
import { phoneNumber } from '../../../../common/utils/humanize';
import {
  getCategoryNames,
  getStatusNames,
  toDisplayValue
} from '../../utils/customValues';
import styles from '../styles.module.scss';

interface Props {
  workOrder: workOrderModel;
  customValues: customValuesModel;
}

const toYesNo = (value?: boolean): string => {
  if (typeof value === 'undefined') return '';
  return value ? 'YES' : 'NO';
};

// Read-only view of a work order
const WorkOrderDetails: FunctionComponent<Props> = ({
  workOrder,
  customValues
}) => {
  const status = toDisplayValue(getStatusNames(customValues), workOrder.status);
  const priority = toDisplayValue(customValues.priorities, workOrder.priority);
  const category = toDisplayValue(
    getCategoryNames(customValues),
    workOrder.category
  );

  const rows: { label: string; value: string; name: string; wide?: boolean }[] =
    [
      { name: 'id', label: 'ID', value: `${workOrder.id || ''}` },
      { name: 'status', label: 'Status', value: status },
      { name: 'unit', label: 'Unit', value: workOrder.unit },
      { name: 'resident', label: 'Tenant', value: workOrder.resident },
      {
        name: 'brief-description',
        label: 'Summary',
        value: workOrder.briefDescription,
        wide: true
      },
      {
        name: 'description',
        label: 'Description',
        value: workOrder.description,
        wide: true
      },
      { name: 'priority', label: 'Priority', value: priority },
      {
        name: 'category',
        label: 'Category',
        value: [category, workOrder.subCategory].filter(Boolean).join(' / ')
      },
      { name: 'reason', label: 'Reason', value: workOrder.reason },
      { name: 'resolution', label: 'Resolution', value: workOrder.resolution },
      { name: 'vendor', label: 'Vendor', value: workOrder.vendor },
      { name: 'due-date', label: 'Due', value: workOrder.dueDate },
      {
        name: 'request-date',
        label: 'Requested',
        value: workOrder.requestDate
      },
      { name: 'origin', label: 'Origin', value: workOrder.origin },
      {
        name: 'permission-to-enter',
        label: 'Permission to Enter',
        value: toYesNo(workOrder.permissionToEnter)
      },
      {
        name: 'tenant-caused',
        label: 'Tenant Caused',
        value: toYesNo(workOrder.tenantCaused)
      },
      {
        name: 'access-notes',
        label: 'Access Notes',
        value: workOrder.accessNotes,
        wide: true
      },
      {
        name: 'problem-notes',
        label: 'Problem Notes',
        value: workOrder.problemNotes,
        wide: true
      },
      {
        name: 'technician-notes',
        label: 'Technician Notes',
        value: workOrder.technicianNotes,
        wide: true
      },
      {
        name: 'updated-at',
        label: 'Updated',
        value: workOrder.updatedAt
          ? dateUtil.toUserDateTimeDisplay(workOrder.updatedAt)
          : ''
      },
      { name: 'updated-by', label: 'Updated By', value: workOrder.updatedBy },
      {
        name: 'created-at',
        label: 'Created',
        value:
          typeof workOrder.createdAt === 'number'
            ? dateUtil.toUserDateTimeDisplay(workOrder.createdAt)
            : `${workOrder.createdAt || ''}`
      }
    ];

  const hasRequestor = Boolean(
    workOrder.requestorName ||
      workOrder.requestorEmail ||
      workOrder.requestorPhone
  );

  return (
    <div className={styles.details} data-testid="work-order-details">
      <div className={styles.details__grid}>
        {rows
          .filter((row) => Boolean(row.value))
          .map((row) => (
            <div
              key={row.name}
              className={clsx(row.wide && styles.details__wide)}
            >
              <Info
                label={row.label}
                value={row.value}
                data-testid={`work-order-detail-${row.name}`}
              />
            </div>
          ))}

        {hasRequestor && (
          <div className={styles.details__wide}>
            <InfoLabel label="Requestor" />
            {workOrder.requestorName && (
              <span
                className="-mr"
                data-testid="work-order-detail-requestor-name"
              >
                {workOrder.requestorName}
              </span>
            )}
            {workOrder.requestorEmail && (
              <a
                href={`mailto:${workOrder.requestorEmail}`}
                className={styles.details__contact}
                data-testid="work-order-detail-requestor-email"
              >
                {workOrder.requestorEmail}
              </a>
            )}
            {workOrder.requestorPhone && (
              <a
                href={`tel:${workOrder.requestorPhone}`}
                className={styles.details__contact}
                data-testid="work-order-detail-requestor-phone"
              >
                {phoneNumber(workOrder.requestorPhone)}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkOrderDetails;
