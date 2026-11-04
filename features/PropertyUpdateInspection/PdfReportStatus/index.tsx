import clsx from 'clsx';
import { FunctionComponent } from 'react';
import styles from './styles.module.scss';

interface Props {
  onCopyReportURL(): void;
  isPdfReportStatusShowing: boolean;
  isPdfReportOutOfDate: boolean;
  isPdfReportGenerating: boolean;
  inspectionReportURL: string;
  isPdfReportQueued: boolean;
  showRestartAction: boolean;
  hasPdfReportGenerationFailed: boolean;
  onRegenerateReport(): void;
  isSmallGray?: boolean;
  isRequestingReport: boolean;
  pendingUploadsCount?: number;
}

const PdfReportStatus: FunctionComponent<Props> = ({
  onCopyReportURL,
  isPdfReportStatusShowing,
  isPdfReportOutOfDate,
  isPdfReportGenerating,
  isPdfReportQueued,
  showRestartAction,
  inspectionReportURL,
  hasPdfReportGenerationFailed,
  onRegenerateReport,
  isSmallGray,
  isRequestingReport,
  pendingUploadsCount
}) => {
  const hasPendingUploads = pendingUploadsCount > 0;
  let PDFStatusText = '';

  if (isPdfReportOutOfDate) {
    PDFStatusText = 'PDF Report is out-of-date';
  }

  if (hasPdfReportGenerationFailed) {
    PDFStatusText = 'PDF Report failed';
  }

  // The API will not build a report until the
  // inspector's device finishes uploading, so
  // explain the wait instead of offering a restart
  if (hasPendingUploads) {
    const noun = pendingUploadsCount === 1 ? 'photo' : 'photos';
    PDFStatusText = `${pendingUploadsCount} ${noun} still uploading from the inspector's device`;
  }

  if (isPdfReportQueued) {
    PDFStatusText = 'PDF report in queue';
  }

  if (isPdfReportGenerating) {
    PDFStatusText = 'Generating PDF';
  }

  const showRestart = showRestartAction && !hasPendingUploads;

  const showActions =
    inspectionReportURL &&
    !isPdfReportQueued &&
    !showRestartAction &&
    !isPdfReportGenerating &&
    !isRequestingReport &&
    !isPdfReportOutOfDate &&
    !hasPendingUploads;

  return (
    <>
      {isPdfReportStatusShowing && (
        <div
          className={clsx(styles.pdfReport, isSmallGray ? '-mr-none' : '')}
          data-testid="header-pdf-report"
        >
          <p
            className={clsx(
              styles.pdfReport__status,
              isPdfReportGenerating && styles.pdfReport__generating,
              hasPdfReportGenerationFailed &&
                !hasPendingUploads &&
                styles['pdfReport__status--failed'],
              hasPendingUploads && styles['pdfReport__status--pending'],
              isSmallGray ? styles['pdfReport__status--small'] : '',
              isSmallGray ? styles['pdfReport__status--gray'] : ''
            )}
            data-testid="header-pdf-report-text"
          >
            {PDFStatusText}&nbsp;&nbsp;
            {showRestart && (
              <span
                className={clsx(
                  styles.pdfReport__status__action,
                  hasPdfReportGenerationFailed &&
                    styles['pdfReport__status--failed'],
                  isSmallGray ? styles['pdfReport__status--gray'] : ''
                )}
                data-testid="pdf-report-restart-action"
                onClick={onRegenerateReport}
              >
                Restart
              </span>
            )}
            {showActions && (
              <>
                <a
                  href={inspectionReportURL}
                  target="_blank"
                  rel="noreferrer"
                  className={clsx(
                    styles.pdfReport__status__action,
                    isSmallGray ? styles['pdfReport__status--gray'] : ''
                  )}
                >
                  View PDF Report
                </a>
                |
                <span
                  className={clsx(
                    styles.pdfReport__status__action,
                    isSmallGray ? styles['pdfReport__status--gray'] : ''
                  )}
                  data-testid="pdf-report-copy-url-action"
                  onClick={onCopyReportURL}
                >
                  Copy PDF Link
                </span>
              </>
            )}
          </p>
        </div>
      )}
    </>
  );
};

PdfReportStatus.defaultProps = {
  isPdfReportStatusShowing: false,
  isPdfReportOutOfDate: false,
  isPdfReportGenerating: false,
  hasPdfReportGenerationFailed: false,
  isSmallGray: false,
  pendingUploadsCount: 0
};

export default PdfReportStatus;
