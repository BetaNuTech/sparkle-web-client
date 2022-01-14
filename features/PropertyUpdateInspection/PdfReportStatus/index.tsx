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
  showRequestAgainAction: boolean;
  hasPdfReportGenerationFailed: boolean;
  onRegenerateReport(): void;
}

const PdfReportStatus: FunctionComponent<Props> = ({
  onCopyReportURL,
  isPdfReportStatusShowing,
  isPdfReportOutOfDate,
  isPdfReportGenerating,
  isPdfReportQueued,
  showRequestAgainAction,
  inspectionReportURL,
  hasPdfReportGenerationFailed,
  onRegenerateReport
}) => {
  let PDFStatusText = `PDF Report is ${
    isPdfReportOutOfDate ? 'out-of-date' : 'available'
  }`;

  if (hasPdfReportGenerationFailed) {
    PDFStatusText = 'PDF Report generation failed';
  }

  if (isPdfReportQueued) {
    PDFStatusText = 'PDF report in queue';
  }

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
          {isPdfReportGenerating ? (
            <p
              data-testid="header-pdf-report-generating"
              className={styles.pdfReport__generating}
            >
              Generating PDF
            </p>
          ) : (
            <p
              className={styles.pdfReport__status}
              data-testid="header-pdf-report-text"
            >
              {PDFStatusText}&nbsp;&nbsp;
              {hasPdfReportGenerationFailed || showRequestAgainAction ? (
                <span
                  className={clsx(
                    styles.pdfReport__status__action,
                    hasPdfReportGenerationFailed &&
                      styles['pdfReport__status__action--failed']
                  )}
                  onClick={onRegenerateReport}
                >
                  {showRequestAgainAction
                    ? 'Request Again'
                    : 'Regenerate Report'}
                </span>
              ) : (
                !isPdfReportQueued && (
                  <>
                    <span
                      className={styles.pdfReport__status__action}
                      onClick={onCopyReportURL}
                    >
                      Copy URL
                    </span>
                    |
                    <span className={styles.pdfReport__status__action}>
                      <a
                        href={inspectionReportURL}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Report
                      </a>
                    </span>
                  </>
                )
              )}
            </p>
          )}
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
