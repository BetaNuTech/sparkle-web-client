import { useState } from 'react';
import Router from 'next/router';
import yardiApi from '../../../common/services/api/yardi';
import workOrderModel, {
  yardiWorkOrderWritable,
  WORK_ORDER_CANCELED_STATUS
} from '../../../common/models/yardi/workOrder';
import errorReports from '../../../common/services/api/errorReports';
import ErrorForbidden from '../../../common/models/errors/forbidden';
import ErrorNotFound from '../../../common/models/errors/notFound';
import ErrorBadRequest from '../../../common/models/errors/badRequest';
import ErrorBadGateway from '../../../common/models/errors/badGateway';
import ErrorProxyForbidden from '../../../common/models/errors/proxyForbidden';
import ErrorItem from '../../../common/models/errors/item';
import { WorkOrderFieldErrors } from '../utils/validate';

const PREFIX = 'features: PropertyWorkOrders: hooks: useWorkOrderForm:';

type userNotifications = (message: string, options?: any) => any;

interface useWorkOrderFormResult {
  isLoading: boolean;
  errors: ErrorItem[];
  fieldErrors: WorkOrderFieldErrors;
  generalErrors: string[];
  clearErrors(): void;
  createWorkOrder(payload: yardiWorkOrderWritable): Promise<workOrderModel>;
  updateWorkOrder(
    workOrderId: string,
    updates: yardiWorkOrderWritable
  ): Promise<workOrderModel>;
  cancelWorkOrder(
    workOrderId: string,
    reason?: string
  ): Promise<workOrderModel>;
}

// Convert an API error pointer like
// "/data/attributes/unit" or "/unit"
// into the form field it belongs to
export function toFieldName(pointer = ''): string {
  return `${pointer}`.split('/').filter(Boolean).pop() || '';
}

// Split API errors into those naming a
// form field and those that do not
export function toFieldErrors(errors: ErrorItem[]): {
  fieldErrors: WorkOrderFieldErrors;
  generalErrors: string[];
} {
  const fieldErrors: WorkOrderFieldErrors = {};
  const generalErrors: string[] = [];

  errors.forEach((err) => {
    const field = toFieldName(err.name);
    const message = err.detail || err.title || 'Rejected by Yardi';
    const isKnownField =
      field && field !== 'unknown' && field !== 'body' && field !== 'data';

    if (isKnownField && !fieldErrors[field]) {
      fieldErrors[field] = message;
    } else {
      generalErrors.push(message);
    }
  });

  return { fieldErrors, generalErrors };
}

// Create, update & cancel work orders,
// surfacing Yardi's rejections per field
export default function useWorkOrderForm(
  sendNotification: userNotifications,
  propertyId: string
): useWorkOrderFormResult {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<ErrorItem[]>([]);

  const { fieldErrors, generalErrors } = toFieldErrors(errors);

  const clearErrors = () => setErrors([]);

  const handleErrorResponse = (apiError: Error, action: string) => {
    if (apiError instanceof ErrorBadRequest) {
      setErrors(apiError.errors);
      sendNotification(`Yardi rejected the work order ${action}`, {
        type: 'error'
      });
    } else if (apiError instanceof ErrorForbidden) {
      sendNotification(
        `You do not have permission to ${action} work orders for this property`,
        { type: 'error' }
      );
    } else if (apiError instanceof ErrorProxyForbidden) {
      sendNotification(
        'Either the organization or this property is not properly configured for Yardi',
        { type: 'error' }
      );
    } else if (apiError instanceof ErrorNotFound) {
      sendNotification('This work order could not be found in Yardi', {
        type: 'error'
      });
    } else if (apiError instanceof ErrorBadGateway) {
      sendNotification(
        `Yardi could not process the work order ${action}, please try again.`,
        { type: 'error' }
      );
    } else {
      sendNotification(
        `Work order ${action} failed for unexpected reasons, please try again or contact an admin.`,
        { type: 'error' }
      );
      // eslint-disable-next-line import/no-named-as-default-member
      errorReports.send(
        Error(`${PREFIX} Could not complete work order ${action} operation`)
      );
    }
  };

  const createWorkOrder = async (
    payload: yardiWorkOrderWritable
  ): Promise<workOrderModel> => {
    setIsLoading(true);
    setErrors([]);

    try {
      const workOrder = await yardiApi.createWorkOrderRequest(
        propertyId,
        payload
      );
      sendNotification(`Work order ${workOrder.id} created`, {
        type: 'success'
      });
      Router.push(
        `/properties/${propertyId}/yardi-work-orders/${workOrder.id}`
      );
      return workOrder;
    } catch (err) {
      handleErrorResponse(err, 'create');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateWorkOrder = async (
    workOrderId: string,
    updates: yardiWorkOrderWritable
  ): Promise<workOrderModel> => {
    setIsLoading(true);
    setErrors([]);

    try {
      const workOrder = await yardiApi.updateWorkOrderRequest(
        propertyId,
        workOrderId,
        updates
      );
      sendNotification(`Work order ${workOrderId} updated`, {
        type: 'success'
      });
      return workOrder;
    } catch (err) {
      handleErrorResponse(err, 'update');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Cancelling is a status update
  const cancelWorkOrder = async (
    workOrderId: string,
    reason?: string
  ): Promise<workOrderModel> => {
    const updates: yardiWorkOrderWritable = {
      status: WORK_ORDER_CANCELED_STATUS
    };
    if (reason) updates.reason = reason;

    setIsLoading(true);
    setErrors([]);

    try {
      const workOrder = await yardiApi.updateWorkOrderRequest(
        propertyId,
        workOrderId,
        updates
      );
      sendNotification(`Work order ${workOrderId} cancelled`, {
        type: 'success'
      });
      return workOrder;
    } catch (err) {
      handleErrorResponse(err, 'cancel');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    errors,
    fieldErrors,
    generalErrors,
    clearErrors,
    createWorkOrder,
    updateWorkOrder,
    cancelWorkOrder
  };
}
