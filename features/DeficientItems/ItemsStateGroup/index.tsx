import { FunctionComponent } from 'react';
import deficientItemModel from '../../../common/models/deficientItem';
import { deficientItemStateOrder } from '../../../config/deficientItems';
import StateItems from '../StateItems';
import styles from './styles.module.scss';

interface Props {
  deficientItemsByState: Map<string, deficientItemModel[]>;
}

const DeficientItemsStateGroup: FunctionComponent<Props> = ({
  deficientItemsByState
}) => (
  <div className={styles.container}>
    {deficientItemStateOrder.map((deficientItemState) => (
      <StateItems
        key={deficientItemState}
        deficientItemState={deficientItemState}
        deficientItemsByState={deficientItemsByState}
      />
    ))}
  </div>
);

export default DeficientItemsStateGroup;
