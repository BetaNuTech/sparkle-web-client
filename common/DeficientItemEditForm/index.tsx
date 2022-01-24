import { ChangeEvent, FunctionComponent } from 'react';
import moment from 'moment';
import deficientItemModel from '../models/deficientItem';
import Details from './fields/Details';
import Notes from './fields/Notes';
import CurrentState from './fields/CurrentState';
import PlanToFix from './fields/PlanToFix';
import DueDate from './fields/DueDate';
import ResponsibilityGroups from './fields/ResponsibilityGroups';
import styles from './styles.module.scss';

interface Props {
  onShowHistory(): void;
  isMobile: boolean;
  isUpdatingCurrentCompleteNowReason: boolean;
  isUpdatingDeferredDate: boolean;
  onClickViewPhotos(): void;
  deficientItem: deficientItemModel;
  onShowPlanToFix(): void;
  onChangePlanToFix(evt: ChangeEvent<HTMLTextAreaElement>): void;
  onShowDueDates(): void;
  onChangeDueDate(evt: ChangeEvent<HTMLInputElement>): void;
  onShowResponsibilityGroups(): void;
  onChangeResponsibilityGroup(evt: ChangeEvent<HTMLSelectElement>): void;
}

const DeficientItemEditForm: FunctionComponent<Props> = ({
  deficientItem,
  isMobile,
  isUpdatingCurrentCompleteNowReason,
  isUpdatingDeferredDate,
  onShowHistory,
  onClickViewPhotos,
  onShowPlanToFix,
  onChangePlanToFix,
  onShowDueDates,
  onChangeDueDate,
  onShowResponsibilityGroups,
  onChangeResponsibilityGroup
}) => {
  // set default date to tomorrow
  const defaultDate = moment().add(1, 'days').format('YYYY-MM-DD');

  // set maximum selectable date to 2 weeks from current date
  const maxDate = moment().add(14, 'days').format('YYYY-MM-DD');

  const showNotes = Boolean(deficientItem.itemInspectorNotes);

  const isDeferred = deficientItem.state === 'deferred';

  // Determine to show/hide plan to fix section
  const showCurrentPlanToFixSection =
    deficientItem.state === 'closed'
      ? Boolean(deficientItem.plansToFix)
      : !isDeferred &&
        !isUpdatingDeferredDate &&
        !isUpdatingCurrentCompleteNowReason;

  // Determine to show/hide due date section
  const showCurrentDueDateSection =
    deficientItem.state === 'closed'
      ? Boolean(deficientItem.dueDates)
      : !isDeferred &&
        !isUpdatingDeferredDate &&
        !isUpdatingCurrentCompleteNowReason;

  // Determine to show/hide responsibility section
  const showResponsibilityGroupSection =
    deficientItem.state === 'closed'
      ? Boolean(deficientItem.responsibilityGroups)
      : !isDeferred &&
        !isUpdatingDeferredDate &&
        !isUpdatingCurrentCompleteNowReason;

  return (
    <div className={styles.container}>
      <aside className={styles.container__sidebar}>
        <Details
          deficientItem={deficientItem}
          isMobile={isMobile}
          onClickViewPhotos={onClickViewPhotos}
        />
      </aside>
      <div className={styles.container__main}>
        <Notes deficientItem={deficientItem} isVisible={showNotes} />
        <CurrentState
          deficientItem={deficientItem}
          onShowHistory={onShowHistory}
          isMobile={isMobile}
        />
        <PlanToFix
          onShowPlanToFix={onShowPlanToFix}
          onChangePlanToFix={onChangePlanToFix}
          deficientItem={deficientItem}
          isMobile={isMobile}
          isVisible={showCurrentPlanToFixSection}
        />
        <ResponsibilityGroups
          onShowResponsibilityGroups={onShowResponsibilityGroups}
          onChangeResponsibilityGroup={onChangeResponsibilityGroup}
          deficientItem={deficientItem}
          isMobile={isMobile}
          isVisible={showResponsibilityGroupSection}
        />
        <DueDate
          onShowDueDates={onShowDueDates}
          onChangeDueDate={onChangeDueDate}
          deficientItem={deficientItem}
          isMobile={isMobile}
          isVisible={showCurrentDueDateSection}
          defaultDate={defaultDate}
          maxDate={maxDate}
        />
      </div>
    </div>
  );
};

export default DeficientItemEditForm;
