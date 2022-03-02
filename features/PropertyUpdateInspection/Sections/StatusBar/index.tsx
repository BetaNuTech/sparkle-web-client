import clsx from 'clsx';
import { ChangeEvent, FunctionComponent } from 'react';
import FileUploadIcon from '../../../../public/icons/sparkle/file-upload.svg';
import PdfReportStatus from '../../PdfReportStatus';
import styles from './styles.module.scss';

interface Props {
  showAction: boolean;
  inspCompletionPercentage: number;
  onSaveInspection(): void;
  canEnableEditMode: boolean;
  onEnableAdminEditMode(): void;
  canUpdateCompleteInspection: boolean;
  isOnline: boolean;
  hasUpdates: boolean;
  onCopyReportURL(): void;
  isPdfReportStatusShowing: boolean;
  isPdfReportOutOfDate: boolean;
  isPdfReportGenerating: boolean;
  isPdfReportQueued: boolean;
  showRestartAction: boolean;
  hasPdfReportGenerationFailed: boolean;
  onRegenerateReport(): void;
  inspectionReportURL: string;
  isRequestingReport: boolean;
  searchQuery: string;
  onSearchKeyDown: (
    ev: React.KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>
  ) => void;
  onClearSearch(): void;
}

const StatusBar: FunctionComponent<Props> = ({
  showAction,
  inspCompletionPercentage,
  onSaveInspection,
  canEnableEditMode,
  onEnableAdminEditMode,
  canUpdateCompleteInspection,
  hasUpdates,
  isOnline,
  onCopyReportURL,
  isPdfReportStatusShowing,
  isPdfReportOutOfDate,
  isPdfReportGenerating,
  isPdfReportQueued,
  showRestartAction,
  hasPdfReportGenerationFailed,
  onRegenerateReport,
  inspectionReportURL,
  isRequestingReport,
  searchQuery,
  onSearchKeyDown,
  onClearSearch
}) => {
  const isPubishingDisabled =
    !(hasUpdates && isOnline) || isPdfReportGenerating || isPdfReportQueued;

  const showClearSearch = Boolean(searchQuery);

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.main__search}>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search"
            value={searchQuery}
            onChange={onSearchKeyDown}
            data-testid="status-bar-search-input"
          />
        </div>

        {showClearSearch && (
          <div className="-pr">
            <button
              className={styles.clearButton}
              onClick={onClearSearch}
              data-testid="status-bar-search-clear"
            >
              Clear Search
            </button>
          </div>
        )}
        {!showClearSearch && (
          <>
            <div
              className={styles.main__content}
              data-testid="status-bar-content"
            >
              {isPdfReportStatusShowing ? (
                <PdfReportStatus
                  isPdfReportStatusShowing={isPdfReportStatusShowing}
                  isPdfReportGenerating={isPdfReportGenerating}
                  isPdfReportOutOfDate={isPdfReportOutOfDate}
                  isPdfReportQueued={isPdfReportQueued}
                  showRestartAction={showRestartAction}
                  inspectionReportURL={inspectionReportURL}
                  onCopyReportURL={onCopyReportURL}
                  hasPdfReportGenerationFailed={hasPdfReportGenerationFailed}
                  onRegenerateReport={onRegenerateReport}
                  isRequestingReport={isRequestingReport}
                  isSmallGray={true} // eslint-disable-line react/jsx-boolean-value
                />
              ) : (
                <span data-testid="status-bar-percentage-status">
                  {inspCompletionPercentage}% Done
                </span>
              )}
            </div>

            {showAction ? (
              <div
                className={styles.main__action}
                data-testid="status-bar-actions"
              >
                {canEnableEditMode && (
                  <button
                    type="button"
                    className={clsx(styles.button, styles['button--dark'])}
                    data-testid="status-bar-edit-button"
                    onClick={onEnableAdminEditMode}
                  >
                    Edit
                  </button>
                )}
                {canUpdateCompleteInspection ? (
                  <button
                    type="button"
                    className={clsx(styles.button)}
                    disabled={isPubishingDisabled}
                    data-testid="status-bar-complete-button"
                    onClick={onSaveInspection}
                  >
                    Complete
                    <span>
                      <FileUploadIcon />
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className={clsx(styles.button)}
                    disabled={isPubishingDisabled}
                    data-testid="status-bar-save-button"
                    onClick={onSaveInspection}
                  >
                    Save
                  </button>
                )}
              </div>
            ) : (
              <div className={styles.main__action}></div>
            )}
          </>
        )}
      </div>
      <div className={styles.progress}>
        <div
          className={styles.progress__fill}
          style={{ width: `${inspCompletionPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

StatusBar.defaultProps = {};

export default StatusBar;
