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
  isInStatusBar?: boolean;
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
  isInStatusBar,
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
    !isRequestingReport &&
    !isPdfReportOutOfDate;

  return (
    <>
      {isPdfReportStatusShowing && (
        <div
          className={clsx(
            styles.pdfReport,

            isInStatusBar && styles['pdfReport--bgTransparent']
          )}
          data-testid="header-pdf-report"
        >
          <p
            className={clsx(
              styles.pdfReport__status,
              isPdfReportGenerating && styles.pdfReport__generating,
              hasPdfReportGenerationFailed &&
                styles['pdfReport__status--failed'],
              isInStatusBar && styles['pdfReport__status--small'],
              isInStatusBar && styles['pdfReport__status--gray']
            )}
            data-testid="header-pdf-report-text"
          >
            {PDFStatusText}&nbsp;&nbsp;
            {showRestartAction && (
              <span
                className={clsx(
                  styles.pdfReport__status__action,
                  hasPdfReportGenerationFailed &&
                    styles['pdfReport__status--failed'],
                  isInStatusBar && styles['pdfReport__status--gray']
                )}
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
                    isInStatusBar && styles['pdfReport__status--gray']
                  )}
                >
                  View PDF Report
                </a>
                |
                <span
                  className={clsx(
                    styles.pdfReport__status__action,
                    isInStatusBar && styles['pdfReport__status--gray']
                  )}
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
  isInStatusBar: false
};

export default PdfReportStatus;
