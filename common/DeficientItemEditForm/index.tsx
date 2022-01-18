import { FunctionComponent } from 'react';
import deficientItemModel from '../models/deficientItem';
import Details from './fields/Details';
import Notes from './fields/Notes';
import CurrentState from './fields/CurrentState';
import styles from './styles.module.scss';

interface Props {
  onShowHistory(): void;
  isMobile: boolean;
  onClickViewPhotos(): void;
  deficientItem: deficientItemModel;
}

const DeficientItemEditForm: FunctionComponent<Props> = ({
  deficientItem,
  isMobile,
  onShowHistory,
  onClickViewPhotos
}) => {
  const showNotes = Boolean(deficientItem.itemInspectorNotes);

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
          </div>
        </div>
      </div>
    </>
  );
};

export default DeficientItemEditForm;
