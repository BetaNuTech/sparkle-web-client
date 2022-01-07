import clsx from 'clsx';
import { FunctionComponent } from 'react';
import styles from './styles.module.scss';

interface Props {
  onCopyReportURL(): void;
  isPdfReportStatusShowing: boolean;
  isPdfReportOutOfDate: boolean;
  isPdfReportGenerating: boolean;
  inspectionReportURL: string;
  hasPdfReportGenerationFailed: boolean;
  onRegenerateReport(): void;
}

const PdfReportStatus: FunctionComponent<Props> = ({
  onCopyReportURL,
  isPdfReportStatusShowing,
  isPdfReportOutOfDate,
  isPdfReportGenerating,
  inspectionReportURL,
  hasPdfReportGenerationFailed,
  onRegenerateReport
}) => {
  const PDFStatusText = hasPdfReportGenerationFailed
    ? 'PDF Report generation failed'
    : `PDF Report is ${isPdfReportOutOfDate ? 'out-of-date' : 'available'}`;
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
              {hasPdfReportGenerationFailed ? (
                <span
                  className={clsx(
                    styles.pdfReport__status__action,
                    hasPdfReportGenerationFailed &&
                      styles['pdfReport__status__action--failed']
                  )}
                  onClick={onRegenerateReport}
                >
                  Regenerate Report
                </span>
              ) : (
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
