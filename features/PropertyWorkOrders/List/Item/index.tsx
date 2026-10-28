import { FunctionComponent, useRef } from 'react';
import clsx from 'clsx';
import WorkOrderModel from '../../../../common/models/yardi/workOrder';
import dateUtil from '../../../../common/utils/date';
import { phoneNumber } from '../../../../common/utils/humanize';
import Info, { InfoLabel, InfoValue } from '../../../../common/Yardi/Info';
import Badge from '../../../../common/Yardi/Badge';
import styles from './styles.module.scss';
import useVisibility from '../../../../common/hooks/useVisibility';
import Pill from '../../../../common/Yardi/Pill';
import PaperclipIcon from '../../../../public/icons/sparkle/paperclip.svg';

interface Props {
  workOrder: WorkOrderModel;
  forceVisible?: boolean;
  onClickWorkOrder(workOrder: WorkOrderModel): void;
  isMobile: boolean;
}

const WorkOrderListItem: FunctionComponent<Props> = ({
  workOrder,
  onClickWorkOrder,
  forceVisible,
  isMobile
}) => {
  const hasUpdateInfo = Boolean(workOrder.updatedAt || workOrder.updatedBy);

  const hasRequestorContactInfo = Boolean(
    workOrder.requestorEmail || workOrder.requestorPhone
  );

  const hasAnyRequestorInfo =
    Boolean(workOrder.requestorName) || hasRequestorContactInfo;

  const hasCategoryOrPriority = Boolean(
    workOrder.category || workOrder.priority
  );

  const categoryLabel = [workOrder.category, workOrder.subCategory]
    .filter(Boolean)
    .join(' / ');

  // Read defensively: older API
  // responses carry no flag at all
  const hasAttachments = Boolean(workOrder.hasAttachments);

  const placeholderRef = useRef();
  const { isVisible } = useVisibility(placeholderRef, {}, forceVisible);

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <li
      className={clsx(styles.container, '-cu-pointer')}
      ref={placeholderRef}
      onClick={() => onClickWorkOrder(workOrder)}
      data-testid="work-order-item"
    >
      {isVisible && (
        <>
          <div className={styles.container__left}>
            {isMobile ? (
              <div className="-mb-sm -flex-spread-content">
                <span className={styles.idBadge}>
                  {workOrder.id && (
                    <Badge
                      type="secondary"
                      text={`${workOrder.id} ${workOrder.requestDate || ''}`}
                      data-testid="order-id-and-requestDate"
                    />
                  )}
                  {hasAttachments && (
                    <span
                      className={styles.attachments}
                      title="Has attachments"
                      data-testid="work-order-has-attachments"
                    >
                      <PaperclipIcon />
                    </span>
                  )}
                </span>

                {workOrder.status && (
                  <Badge
                    type="primary"
                    text={workOrder.status}
                    data-testid="order-status"
                  />
                )}
              </div>
            ) : (
              <>
                {workOrder.id && (
                  <div className="-d-flex">
                    <Info
                      label="ID"
                      value={`${workOrder.id} ${workOrder.requestDate || ''}`}
                      data-testid="order-id-and-requestDate"
                    />
                    {hasAttachments && (
                      <span
                        className={styles.attachments}
                        title="Has attachments"
                        data-testid="work-order-has-attachments"
                      >
                        <PaperclipIcon />
                      </span>
                    )}
                  </div>
                )}

                {workOrder.status && (
                  <Info
                    label="Status"
                    value={workOrder.status}
                    data-testid="order-status"
                  />
                )}
              </>
            )}

            <div className="-d-flex">
              <InfoLabel label="Unit" />
              <InfoValue
                value={workOrder.unit || 'No unit'}
                data-testid="work-order-unit"
              />
              {workOrder.resident && (
                <>
                  <InfoLabel label="Tenant" />
                  <InfoValue
                    value={workOrder.resident}
                    data-testid="work-order-resident"
                  />
                </>
              )}
            </div>

            {workOrder.briefDescription && (
              <Info
                label="Summary"
                value={workOrder.briefDescription}
                data-testid="order-brief-description"
              />
            )}

            {workOrder.dueDate && (
              <Info
                label="Due"
                value={workOrder.dueDate}
                data-testid="order-due-date"
              />
            )}

            {hasUpdateInfo && isMobile && (
              <div className="-d-flex">
                {workOrder.updatedAt && (
                  <>
                    <InfoLabel label="Updated" />
                    <InfoValue
                      value={dateUtil.toUserDateTimeDisplay(
                        workOrder.updatedAt
                      )}
                      data-testid="updated-at"
                    />
                  </>
                )}
                {workOrder.updatedBy && (
                  <>
                    <InfoLabel label="By" />
                    <InfoValue
                      value={workOrder.updatedBy}
                      data-testid="updated-by"
                    />
                  </>
                )}
              </div>
            )}

            {workOrder.description && (
              <Info
                label="Description"
                value={workOrder.description}
                data-testid="order-description"
              />
            )}

            {hasCategoryOrPriority && isMobile && (
              <div className="-d-flex">
                {workOrder.category && (
                  <>
                    <InfoLabel label="Category" />
                    <InfoValue
                      value={categoryLabel}
                      data-testid="order-category"
                    />
                  </>
                )}
                {workOrder.priority && (
                  <>
                    <InfoLabel label="Priority" />
                    <InfoValue
                      value={workOrder.priority}
                      data-testid="order-priority"
                    />
                  </>
                )}
              </div>
            )}

            {workOrder.problemNotes && (
              <Info
                label="Problem Notes"
                value={workOrder.problemNotes}
                data-testid="problem-notes"
              />
            )}

            {workOrder.technicianNotes && (
              <Info
                label="Technician Notes"
                value={workOrder.technicianNotes}
                data-testid="technician-notes"
              />
            )}

            {typeof workOrder.tenantCaused !== 'undefined' && (
              <Info
                label="Tenant Caused"
                value={workOrder.tenantCaused ? 'YES' : 'NO'}
                data-testid="tenant-caused"
              />
            )}

            {typeof workOrder.permissionToEnter !== 'undefined' && (
              <Info
                label="Has Permission to Enter"
                value={workOrder.permissionToEnter ? 'YES' : 'NO'}
                data-testid="permission-enter"
              />
            )}

            {hasAnyRequestorInfo && (
              <>
                <InfoLabel label="Requestor" />

                {workOrder.requestorName && (
                  <InfoValue
                    value={workOrder.requestorName}
                    data-testid="requestor-name"
                  />
                )}

                {(workOrder.requestorEmail || workOrder.requestorPhone) && (
                  <InfoValue
                    value={`(${workOrder.requestorEmail} / ${phoneNumber(
                      workOrder.requestorPhone
                    )})`}
                    data-testid="requestor-email-phone"
                  />
                )}
              </>
            )}

            {workOrder.origin && (
              <Info
                label="Origin"
                value={workOrder.origin}
                data-testid="order-origin"
              />
            )}
          </div>

          {!isMobile && (
            <div className={styles.right}>
              <Pill>
                {workOrder.updatedAt && (
                  <Info
                    label="Updated"
                    value={dateUtil.toUserDateTimeDisplay(workOrder.updatedAt)}
                    data-testid="updated-at"
                  />
                )}
                {workOrder.updatedBy && (
                  <Info
                    label="Updated By"
                    value={workOrder.updatedBy}
                    data-testid="updated-at"
                  />
                )}

                {hasCategoryOrPriority && !isMobile && (
                  <div className="-d-flex">
                    {workOrder.category && (
                      <>
                        <InfoLabel label="Category" />
                        <InfoValue
                          value={categoryLabel}
                          data-testid="order-category"
                        />
                      </>
                    )}
                    {workOrder.priority && (
                      <>
                        <InfoLabel label="Priority" />
                        <InfoValue
                          value={workOrder.priority}
                          data-testid="order-priority"
                        />
                      </>
                    )}
                  </div>
                )}
              </Pill>
            </div>
          )}
        </>
      )}
    </li>
  );
};

export default WorkOrderListItem;
