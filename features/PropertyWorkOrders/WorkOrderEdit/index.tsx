import { ChangeEvent, FunctionComponent, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import propertyModel from '../../../common/models/property';
import workOrderModel, {
  WORK_ORDER_CANCELED_STATUS
} from '../../../common/models/yardi/workOrder';
import customValuesModel from '../../../common/models/yardi/customValues';
import ErrorList from '../../../common/ErrorList';
import LoadingHud from '../../../common/LoadingHud';
import breakpoints from '../../../config/breakpoints';
import features from '../../../config/features';
import useWorkOrderForm from '../hooks/useWorkOrderForm';
import validateWorkOrder, { WorkOrderFieldErrors } from '../utils/validate';
import { getReasons, getSubCategories } from '../utils/customValues';
import Header from './Header';
import Form from './Form';
import Details from './Details';
import CancelPrompt from './CancelPrompt';
import {
  toFormValues,
  toPayload,
  trimValues,
  WorkOrderFormValues
} from './formValues';
import styles from './styles.module.scss';

type userNotifications = (message: string, options?: any) => any;

interface Props {
  isOnline?: boolean;
  isStaging?: boolean;
  isNavOpen?: boolean;
  toggleNavOpen?(): void;
  property: propertyModel;
  workOrder?: workOrderModel; // omitted when creating
  customValues: customValuesModel;
  customValuesStatus: string;
  sendNotification: userNotifications;
  onWorkOrderUpdated?(workOrder: workOrderModel): void;
}

// Work order detail, edit & create
const WorkOrderEdit: FunctionComponent<Props> = ({
  isOnline,
  isStaging,
  property,
  workOrder,
  customValues,
  customValuesStatus,
  sendNotification,
  onWorkOrderUpdated
}) => {
  const isCreating = !workOrder;
  const isMobile = useMediaQuery({ maxWidth: breakpoints.tablet.maxWidth });
  const canWrite = Boolean(features.supportPropertyYardiWorkOrderEdit);
  const hasCustomValues = customValuesStatus === 'success';

  const [isEditing, setIsEditing] = useState(isCreating);
  const [isCancelPromptVisible, setIsCancelPromptVisible] = useState(false);
  const [original, setOriginal] = useState<WorkOrderFormValues>(() =>
    toFormValues(workOrder, customValues)
  );
  const [values, setValues] = useState<WorkOrderFormValues>(original);
  const [clientErrors, setClientErrors] = useState<WorkOrderFieldErrors>({});

  const {
    isLoading,
    fieldErrors: serverErrors,
    generalErrors,
    clearErrors,
    createWorkOrder,
    updateWorkOrder,
    cancelWorkOrder
  } = useWorkOrderForm(sendNotification, property.id);

  // Reload the form when the work order
  // or the picker values change
  useEffect(() => {
    const loaded = toFormValues(workOrder, customValues);
    setOriginal(loaded);
    setValues(loaded);
  }, [workOrder, customValues]);

  const errors: WorkOrderFieldErrors = { ...serverErrors, ...clientErrors };

  const isCanceled =
    `${workOrder?.status || ''}`.toLowerCase() ===
    WORK_ORDER_CANCELED_STATUS.toLowerCase();
  const canEdit = canWrite && hasCustomValues && !isCreating;
  const canCancel = canEdit && !isCanceled;

  const onChange = (
    evt: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, type } = evt.target;
    const value =
      type === 'checkbox'
        ? (evt.target as HTMLInputElement).checked
        : evt.target.value;

    const next = { ...values, [name]: value } as WorkOrderFormValues;

    // Dependent pickers
    if (name === 'category') {
      const subCategories = getSubCategories(customValues, `${value}`);
      if (!subCategories.includes(next.subCategory)) next.subCategory = '';
    }
    if (name === 'status') {
      const reasons = getReasons(customValues, `${value}`).map((r) => r.reason);
      if (!reasons.includes(next.reason)) next.reason = '';
    }

    setValues(next);

    // Clear the field's errors once edited
    if (errors[name]) {
      setClientErrors((prev) => {
        const rest = { ...prev };
        delete rest[name];
        return rest;
      });
      if (serverErrors[name]) clearErrors();
    }
  };

  const onEdit = () => {
    setIsEditing(true);
  };

  const onDiscard = () => {
    setValues(original);
    setClientErrors({});
    clearErrors();
    setIsEditing(false);
  };

  const onSave = async () => {
    const trimmed = trimValues(values);
    const updates = toPayload(trimmed, isCreating ? null : original);
    const validationErrors = validateWorkOrder(
      trimmed,
      customValues,
      isCreating
    );

    // Only the attributes being sent are
    // validated when updating, so a legacy
    // value Yardi already holds never blocks
    // an unrelated edit
    if (!isCreating) {
      const isStatusChange = 'status' in updates || 'reason' in updates;
      Object.keys(validationErrors).forEach((key) => {
        const isRelevant =
          key in updates || (key === 'reason' && isStatusChange);
        if (!isRelevant) delete validationErrors[key];
      });
    }

    setClientErrors(validationErrors);
    if (Object.keys(validationErrors).length) return;

    if (isCreating) {
      await createWorkOrder(updates);
      return;
    }

    if (!Object.keys(updates).length) {
      sendNotification('No changes to save', { type: 'info' });
      setIsEditing(false);
      return;
    }

    const latest = await updateWorkOrder(`${workOrder.id}`, updates);
    if (latest) {
      setIsEditing(false);
      if (onWorkOrderUpdated) onWorkOrderUpdated(latest);
    }
  };

  const onConfirmCancel = async (reason: string) => {
    const latest = await cancelWorkOrder(`${workOrder.id}`, reason);
    if (latest) {
      setIsEditing(false);
      if (onWorkOrderUpdated) onWorkOrderUpdated(latest);
    }
  };

  return (
    <>
      <Header
        property={property}
        workOrderId={`${workOrder?.id || ''}`}
        isOnline={isOnline}
        isStaging={isStaging}
        isMobile={isMobile}
        isCreating={isCreating}
        isEditing={isEditing}
        isLoading={isLoading}
        canEdit={canEdit}
        canCancel={canCancel}
        onEdit={onEdit}
        onDiscard={onDiscard}
        onSave={onSave}
        onCancelWorkOrder={() => setIsCancelPromptVisible(true)}
      />

      <div className={styles.container}>
        {isLoading && <LoadingHud title="Saving…" />}

        {!hasCustomValues && canWrite && (
          <p className={styles.notice} data-testid="work-order-values-notice">
            Yardi&apos;s work order values could not be loaded, so this work
            order cannot be edited right now.
          </p>
        )}

        {generalErrors.length > 0 && (
          <ErrorList
            title="Yardi rejected the request"
            errors={generalErrors}
          />
        )}

        {isEditing ? (
          <Form
            values={values}
            customValues={customValues}
            errors={errors}
            isCreating={isCreating}
            isDisabled={isLoading}
            onChange={onChange}
          />
        ) : (
          <Details workOrder={workOrder} customValues={customValues} />
        )}

        {isMobile && (
          <footer className={styles.footer}>
            {isEditing && !isCreating && (
              <button
                type="button"
                className={styles['action--secondary']}
                disabled={isLoading}
                onClick={onDiscard}
                data-testid="work-order-discard"
              >
                Discard
              </button>
            )}
            {!isEditing && canCancel && (
              <button
                type="button"
                className={styles['action--danger']}
                disabled={isLoading || !isOnline}
                onClick={() => setIsCancelPromptVisible(true)}
                data-testid="work-order-cancel"
              >
                Cancel Work Order
              </button>
            )}
          </footer>
        )}
      </div>

      {!isCreating && (
        <CancelPrompt
          isVisible={isCancelPromptVisible}
          onClose={() => setIsCancelPromptVisible(false)}
          workOrderId={`${workOrder.id}`}
          reasons={getReasons(customValues, WORK_ORDER_CANCELED_STATUS)}
          onConfirm={onConfirmCancel}
        />
      )}
    </>
  );
};

WorkOrderEdit.defaultProps = {
  isOnline: false,
  isStaging: false,
  isNavOpen: false,
  workOrder: null,
  onWorkOrderUpdated: () => null
};

export default WorkOrderEdit;
