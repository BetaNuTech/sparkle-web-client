import { ChangeEvent, FunctionComponent, useMemo } from 'react';
import clsx from 'clsx';
import DeficientItemModel from '../../../models/deficientItem';
import fieldStyles from '../styles.module.scss';

interface Props {
  deficientItem: DeficientItemModel;
  updates: DeficientItemModel;
  onShowHistory(): void;
  onChange(evt: ChangeEvent<HTMLTextAreaElement>): void;
  isMobile: boolean;
  isVisible: boolean;
  isEditable: boolean;
  isBulkUpdate: boolean;
}

const DeficientItemEditFormProgressNotes: FunctionComponent<Props> = ({
  deficientItem,
  updates,
  onShowHistory,
  onChange,
  isMobile,
  isVisible,
  isEditable,
  isBulkUpdate
}) => {
  const showHeaderAction =
    deficientItem.progressNotes && !isMobile && !isBulkUpdate;
  const showFooterAction = deficientItem.progressNotes && isMobile;
  const { progressNotes } = deficientItem;

  const latestProgressNote = useMemo(() => {
    const sortedProgressNotes = Object.keys(progressNotes || {})
      // create new merged sections
      .map((id) => ({ id, ...progressNotes[id] }))
      .sort(
        ({ createdAt: aCreatedAt }, { createdAt: bCreatedAt }) =>
          bCreatedAt - aCreatedAt
      );

    return sortedProgressNotes && sortedProgressNotes.length
      ? sortedProgressNotes[0].progressNote
      : '';
  }, [progressNotes]);

  if (!isVisible) {
    return <></>;
  }

  return (
    <section className={fieldStyles.section} data-testid="item-progress-note">
      <header
        className={clsx(
          fieldStyles.label,
          isBulkUpdate && '-br-bottom-none -mb-sm -p-none'
        )}
      >
        <h4
          className={clsx(
            fieldStyles.heading,
            isBulkUpdate && fieldStyles['heading--small'],
            isBulkUpdate && '-fw-bold'
          )}
        >
          Progress Note(s)
        </h4>
        {showHeaderAction && (
          <button
            onClick={onShowHistory}
            className={fieldStyles.textButton}
            data-testid="show-previous-progress-note-btn"
          >
            Show All
          </button>
        )}
      </header>
      <div className={clsx(fieldStyles.section__main, isEditable && '-p-none')}>
        {isEditable && (
          <textarea
            placeholder="NEW"
            className={clsx(
              fieldStyles.formInput,
              deficientItem.state === 'requires-progress-update' &&
                !updates?.progressNote &&
                fieldStyles['formInput--empty'],
              fieldStyles['formInput--progressNote']
            )}
            defaultValue={updates?.progressNote || ''}
            onChange={onChange}
            data-testid="item-progress-note-textarea"
          />
        )}
        {latestProgressNote && (
          <strong
            className={clsx(
              fieldStyles.richText,
              '-pt-sm -d-block',
              isMobile && '-pl'
            )}
            data-testid="item-progress-note-text"
          >
            {latestProgressNote}
          </strong>
        )}
      </div>
      {showFooterAction && (
        <footer className={fieldStyles.section__footer}>
          <button
            onClick={onShowHistory}
            className={fieldStyles.textButton}
            data-testid="show-previous-progress-note-btn"
          >
            Show All Progress Notes
          </button>
        </footer>
      )}
    </section>
  );
};

export default DeficientItemEditFormProgressNotes;
