import clsx from 'clsx';
import { FunctionComponent } from 'react';
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
  isRequestingReport
}) => {
  const isPubishingDisabled =
    !(hasUpdates && isOnline) || isPdfReportGenerating || isPdfReportQueued;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.header__search}>
          <input
            type="search"
            className={styles.header__search__input}
            placeholder="Search"
          />
        </div>

        <div className={styles.header__content}>
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
              isInStatusBar={true} // eslint-disable-line react/jsx-boolean-value
            />
          ) : (
            <span data-testid="status-bar-percentage-status">
              {inspCompletionPercentage}% Done
            </span>
          )}
        </div>

        {showAction ? (
          <div className={styles.header__action}>
            {canEnableEditMode && (
              <button
                type="button"
                className={clsx(
                  styles.header__action__button,
                  styles['header__action__button--dark']
                )}
                data-testid="status-bar-edit-button"
                onClick={onEnableAdminEditMode}
              >
                Edit
              </button>
            )}
            {canUpdateCompleteInspection ? (
              <button
                type="button"
                className={clsx(styles.header__action__button)}
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
                className={clsx(styles.header__action__button)}
                disabled={isPubishingDisabled}
                data-testid="status-bar-save-button"
                onClick={onSaveInspection}
              >
                Save
              </button>
            )}
          </div>
        ) : (
          <div className={styles.header__action}></div>
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
