import { useState } from 'react';
import inspectionApi from '../../../common/services/api/inspections';
import inspectionModel from '../../../common/models/inspection';
import errorReports from '../../../common/services/api/errorReports';
import ErrorServerInternal from '../../../common/models/errors/serverInternal';

const PREFIX = 'features: EditBid: hooks: usePDFReport:';

interface usePdfReportResult {
  generatePdfReport(): void;
  isPdfReportStatusShowing: boolean;
  isPdfReportOutOfDate: boolean;
  isPdfReportGenerating: boolean;
  hasPdfReportGenerationFailed: boolean;
}

type userNotifications = (message: string, options?: any) => any;

export default function usePDFReport(
  inspection: inspectionModel,
  sendNotification: userNotifications,
  isOnline: boolean,
  hasUpdates: boolean
): usePdfReportResult {
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  const handleErrorResponse = (apiError: Error) => {
    if (apiError instanceof ErrorServerInternal) {
      sendNotification(
        'Unexpected error. Please try again, or contact an admin.',
        {
          type: 'error'
        }
      );
    } else {
      sendNotification(apiError.message, {
        type: 'error'
      });
      // Log issue and send error report
      // of user's missing properties
      // eslint-disable-next-line no-case-declarations
      const wrappedErr = Error(`${PREFIX} handleErrorResponse: ${apiError}`);
      // eslint-disable-next-line import/no-named-as-default-member
      errorReports.send(wrappedErr);
    }
  };

  const generatePdfReport = async () => {
    if (isGeneratingReport) {
      return;
    }
    setIsGeneratingReport(true);
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      await inspectionApi.generatePdfReport(inspection.id);
    } catch (err) {
      handleErrorResponse(err);
    }
    setIsGeneratingReport(false);
  };

  // Determine if PDF report status can be displayed
  const isPdfReportStatusShowing =
    inspection.inspectionCompleted &&
    Boolean(inspection.inspectionReportURL) &&
    isOnline;

  // Determine if PDF report status up-to-date or not
  const isPdfReportOutOfDate =
    inspection.inspectionReportUpdateLastDate !== inspection.updatedAt ||
    hasUpdates;

  // Determine if PDF report is generating
  const isPdfReportGenerating =
    inspection.inspectionReportStatus === 'generating';

  // Determine if PDF report is generation failed
  const hasPdfReportGenerationFailed =
    inspection.inspectionReportStatus === 'completed_failure';

  return {
    generatePdfReport,
    isPdfReportStatusShowing,
    isPdfReportOutOfDate,
    isPdfReportGenerating,
    hasPdfReportGenerationFailed
  };
}
