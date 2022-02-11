import { FunctionComponent } from 'react';
import deficientItemModel from '../../../common/models/deficientItem';
import { deficientItemStateOrder } from '../../../config/deficientItems';
import Header from './Header';
import List from './List';
import styles from './styles.module.scss';

interface Props {
  deficientItemsByState: Map<string, deficientItemModel[]>;
  forceVisible?: boolean;
}

const DeficientItemsStateGroups: FunctionComponent<Props> = ({
  deficientItemsByState,
  forceVisible
}) => (
  <div className={styles.container}>
    {deficientItemStateOrder.map((deficientItemState) => {
      const deficientItems =
        deficientItemsByState.get(deficientItemState) || [];

      if (deficientItems.length === 0) {
        return <></>;
      }

      return (
        <>
          <Header
            state={deficientItemState}
            itemCount={deficientItems.length}
          />
          <List deficientItems={deficientItems} forceVisible={forceVisible} />
        </>
      );
    })}
  </div>
);

export default DeficientItemsStateGroups;
