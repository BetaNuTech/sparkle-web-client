import { ChangeEvent, FunctionComponent } from 'react';
import deficientItemModel from '../models/deficientItem';
import Details from './fields/Details';
import Notes from './fields/Notes';
import CurrentState from './fields/CurrentState';
import PlanToFix from './fields/PlanToFix';
import styles from './styles.module.scss';

interface Props {
  onShowHistory(): void;
  isMobile: boolean;
  onClickViewPhotos(): void;
  deficientItem: deficientItemModel;
  onShowPlanToFix(): void;
  onChangePlanToFix(evt: ChangeEvent<HTMLTextAreaElement>): void;
}

const DeficientItemEditForm: FunctionComponent<Props> = ({
  deficientItem,
  isMobile,
  onShowHistory,
  onClickViewPhotos,
  onShowPlanToFix,
  onChangePlanToFix
}) => {

  const showNotes = Boolean(deficientItem.itemInspectorNotes);

  const isDeferred = deficientItem.state === 'deferred';

  const isUpdatingCurrentCompleteNowReason = false;

  const isUpdatingDeferredDate = false;

  const showCurrentPlanToFixSection =
    deficientItem.state === 'closed'
      ? Boolean(deficientItem.plansToFix)
      : !isDeferred &&
        !isUpdatingDeferredDate &&
        !isUpdatingCurrentCompleteNowReason;

  return (
    <>
      <div className={styles.grid}>
        <div className={styles.grid__container}>
          <aside className={styles.grid__sidebar}>
            <Details
              deficientItem={deficientItem}
              isMobile={isMobile}
              onClickViewPhotos={onClickViewPhotos}
            />
          </aside>
          <div className={styles.grid__main}>
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
          </div>
        </div>
      </div>
    </>
  );
};

export default DeficientItemEditForm;
