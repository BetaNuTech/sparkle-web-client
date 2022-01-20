import { FunctionComponent } from 'react';
import DeficientItemModel from '../../../models/deficientItem';
import styles from '../styles.module.scss';

interface Props {
  deficientItem: DeficientItemModel;
  isVisible: boolean;
}

const DeficientItemEditFormNotes: FunctionComponent<Props> = ({
  deficientItem,
  isVisible
}) =>
  isVisible ? (
    <section className={styles.field} data-testid="item-notes">
      <header className={styles.label}>Item Notes</header>
      <div className={styles.field__main}>
        <strong className={styles.richText} data-testid="item-inspector-notes">
          {deficientItem.itemInspectorNotes}
        </strong>
      </div>
    </section>
  ) : null;

export default DeficientItemEditFormNotes;
