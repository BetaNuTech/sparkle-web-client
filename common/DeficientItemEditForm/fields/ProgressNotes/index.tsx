import { ChangeEvent, FunctionComponent, useMemo } from 'react';
import clsx from 'clsx';
import DeficientItemModel from '../../../models/deficientItem';
import fieldStyles from '../styles.module.scss';

interface Props {
  deficientItem: DeficientItemModel;
  onShowProgressNotes(): void;
  onChangeProgressNote(evt: ChangeEvent<HTMLTextAreaElement>): void;
  isMobile: boolean;
  isVisible: boolean;
  isEditable: boolean;
}

const DeficientItemEditFormProgressNotes: FunctionComponent<Props> = ({
  deficientItem,
  onShowProgressNotes,
  onChangeProgressNote,
  isMobile,
  isVisible,
  isEditable
}) => {
  const showHeaderAction = deficientItem.progressNotes && !isMobile;
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
      <header className={fieldStyles.label}>
        <h4 className={fieldStyles.heading}>Progress Note(s)</h4>
        {showHeaderAction && (
          <button
            onClick={onShowProgressNotes}
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
                !deficientItem.progressNotes &&
                fieldStyles['field__textarea--empty']
            )}
            onChange={onChangeProgressNote}
            data-testid="item-progress-note-textarea"
          />
        )}
        {latestProgressNote && (
          <strong
            className={clsx(fieldStyles.richText, '-pl -pr -pt-sm -d-block')}
            data-testid="item-progress-note-text"
          >
            {latestProgressNote}
          </strong>
        )}
      </div>
      {showFooterAction && (
        <footer className={fieldStyles.section__footer}>
          <button
            onClick={onShowProgressNotes}
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
