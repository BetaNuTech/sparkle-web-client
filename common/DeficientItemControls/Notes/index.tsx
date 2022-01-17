import { FunctionComponent } from 'react';
import DeficientItemModel from '../../models/deficientItem';
import styles from '../styles.module.scss';

interface Props {
  deficientItem: DeficientItemModel;
  isVisible: boolean;
}

const DeficientItemsNotes: FunctionComponent<Props> = ({
  deficientItem,
  isVisible
}) =>
  isVisible ? (
    <section
      className={styles.deficientItemControls__item}
      data-testid="item-notes"
    >
      <header className={styles.deficientItemControls__item__label}>
        Item Notes
      </header>
      <div className={styles.deficientItemControls__item__container}>
        <strong
          className={styles.deficientItemControls__item__richText}
          data-testid="item-inspector-notes"
        >
          {deficientItem.itemInspectorNotes}
        </strong>
      </div>
    </section>
  ) : null;

export default DeficientItemsNotes;
