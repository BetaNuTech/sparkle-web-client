import { ChangeEvent, FunctionComponent } from 'react';
import deficientItemModel from '../models/deficientItem';
import Details from './fields/Details';
import Notes from './fields/Notes';
import CurrentState from './fields/CurrentState';
import PlanToFix from './fields/PlanToFix';
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
  onShowResponsibilityGroups,
  onChangeResponsibilityGroup
}) => {
  const showNotes = Boolean(deficientItem.itemInspectorNotes);

  const isDeferred = deficientItem.state === 'deferred';

  const showCurrentPlanToFixSection =
    deficientItem.state === 'closed'
      ? Boolean(deficientItem.plansToFix)
      : !isDeferred &&
        !isUpdatingDeferredDate &&
        !isUpdatingCurrentCompleteNowReason;

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
      </div>
    </div>
  );
};

export default DeficientItemEditForm;
