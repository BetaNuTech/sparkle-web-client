import { useState } from 'react';
import inspectionApi from '../../../common/services/api/inspections';
import inspectionModel from '../../../common/models/inspection';
import errorReports from '../../../common/services/api/errorReports';
import BaseError from '../../../common/models/errors/baseError';
import ErrorBadRequest from '../../../common/models/errors/badRequest';
import ErrorForbidden from '../../../common/models/errors/forbidden';
import dateUtils from '../../../common/utils/date';

const PREFIX = 'features: EditBid: hooks: usePDFReport:';

interface usePdfReportResult {
  generatePdfReport(): void;
  isPdfReportStatusShowing: boolean;
  isPdfReportOutOfDate: boolean;
  isPdfReportGenerating: boolean;
  isPdfReportQueued: boolean;
  showRestartAction: boolean;
  hasPdfReportGenerationFailed: boolean;
  isRequestingReport: boolean;
}

type userNotifications = (message: string, options?: any) => any;

export default function usePDFReport(
  inspection: inspectionModel,
  sendNotification: userNotifications,
  isOnline: boolean,
  hasUpdates: boolean
): usePdfReportResult {
  const [isRequestingReport, setIsRequestingReport] = useState(false);

  const handleErrorResponse = (apiError: BaseError) => {
    let errorMessage =
      'Unexpected error. Please try again, or contact an admin.';
    if (apiError instanceof ErrorForbidden) {
      // User not allowed to request to generate PDF report
      errorMessage = 'You are not allowed to generate a PDF';
    } else if (apiError instanceof ErrorBadRequest) {
      errorMessage =
        'Bad request, there was an issue regenerating the PDF Report, please contact an admin';
    }

    sendNotification(errorMessage, {
      type: 'error'
    });

    // eslint-disable-next-line no-case-declarations
    const wrappedErr = Error(`${PREFIX} handleErrorResponse: ${apiError}`);

    // Log issue and send error report
    // eslint-disable-next-line import/no-named-as-default-member
    errorReports.send(wrappedErr);
  };

  const generatePdfReport = async () => {
    setIsRequestingReport(true);
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      await inspectionApi.generatePdfReport(inspection.id);
    } catch (err) {
      handleErrorResponse(err);
    }
    setIsRequestingReport(false);
  };

  // Determine if PDF report status can be displayed
  const isPdfReportStatusShowing = inspection.inspectionCompleted && isOnline;

  // Determine if PDF report status up-to-date or not
  const isPdfReportOutOfDate =
    hasUpdates ||
    inspection.updatedAt > inspection.inspectionReportUpdateLastDate;

  // Determine if PDF report is generating
  const isPdfReportGenerating =
    inspection.inspectionReportStatus === 'generating';

  // Determine if PDF report is queued
  const isPdfReportQueued = inspection.inspectionReportStatus === 'queued';

  // Get minutes diffference from current time
  // to  inspection seport status changed
  // to determine if user can request agian for PDF Report
  const reportStatusChangedTimeFromNow = dateUtils.getTimeDifferenceInMinutes(
    inspection.inspectionReportStatusChanged
  );

  // Determine if PDF report is generation failed
  const hasPdfReportGenerationFailed =
    inspection.inspectionReportStatus === 'completed_failure';

  // Determine if user can request for PDF report
  // if PDF report is generation failed
  // or if report is queued or generating and has been for over 3 minutes
  // and generate request is not in flight
  const showRestartAction =
    !isRequestingReport &&
    (((isPdfReportQueued || isPdfReportGenerating) &&
      reportStatusChangedTimeFromNow < -3) ||
      hasPdfReportGenerationFailed);

  return {
    generatePdfReport,
    isPdfReportStatusShowing,
    isPdfReportOutOfDate,
    isPdfReportGenerating,
    isPdfReportQueued,
    showRestartAction,
    hasPdfReportGenerationFailed,
    isRequestingReport
  };
}
