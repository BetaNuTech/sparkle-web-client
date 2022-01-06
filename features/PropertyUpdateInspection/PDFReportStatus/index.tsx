import { FunctionComponent } from 'react';
import styles from './styles.module.scss';

interface HeaderModel {
  onCopyReportURL(): void;
  isPdfReportStatusShowing: boolean;
  isPDFReportOutOfDate: boolean;
  isReportGenerating: boolean;
  inspectionReportURL: string;
}

const PDFReportStatus: FunctionComponent<HeaderModel> = ({
  onCopyReportURL,
  isPdfReportStatusShowing,
  isPDFReportOutOfDate,
  isReportGenerating,
  inspectionReportURL
}) => (
  <>
    {isPdfReportStatusShowing && (
      <div className={styles.pdfReport} data-testid="header-pdf-report">
        {isReportGenerating ? (
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
            PDF Report is {isPDFReportOutOfDate ? 'out-of-date' : 'available'}
            <span
              className={styles.pdfReport__status__action}
              onClick={onCopyReportURL}
            >
              Copy URL
            </span>
            |
            <span className={styles.pdfReport__status__action}>
              <a href={inspectionReportURL} target="_blank" rel="noreferrer">
                View Report
              </a>
            </span>
          </p>
        )}
      </div>
    )}
  </>
);

PDFReportStatus.defaultProps = {};

export default PDFReportStatus;
