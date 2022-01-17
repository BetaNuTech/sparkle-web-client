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
  isRequestingReport: boolean;
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
  isRequestingReport
}) => {
  let PDFStatusText = '';

  if (isPdfReportOutOfDate) {
    PDFStatusText = 'PDF Report is out-of-date';
  }

  if (hasPdfReportGenerationFailed) {
    PDFStatusText = 'PDF Report failed';
  }

  if (isPdfReportQueued) {
    PDFStatusText = 'PDF report in queue';
  }

  if (isPdfReportGenerating) {
    PDFStatusText = 'Generating PDF';
  }

  const showActions =
    !isPdfReportQueued &&
    !showRestartAction &&
    !isPdfReportGenerating &&
    !isRequestingReport;

  return (
    <>
      {isPdfReportStatusShowing && (
        <div
          className={clsx(
            styles.pdfReport,
            hasPdfReportGenerationFailed && styles['pdfReport--failed']
          )}
          data-testid="header-pdf-report"
        >
          <p
            className={clsx(
              styles.pdfReport__status,
              isPdfReportGenerating && styles.pdfReport__generating
            )}
            data-testid="header-pdf-report-text"
          >
            {PDFStatusText}&nbsp;&nbsp;
            {showRestartAction && (
              <span
                className={clsx(
                  styles.pdfReport__status__action,
                  hasPdfReportGenerationFailed &&
                    styles['pdfReport__status__action--failed']
                )}
                onClick={onRegenerateReport}
              >
                Restart
              </span>
            )}
            {showActions && (
              <>
                <span className={styles.pdfReport__status__action}>
                  <a
                    href={inspectionReportURL}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View PDF Report
                  </a>
                </span>
                |
                <span
                  className={styles.pdfReport__status__action}
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
  hasPdfReportGenerationFailed: false
};

export default PdfReportStatus;
