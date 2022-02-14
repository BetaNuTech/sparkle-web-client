import React, { FunctionComponent, Fragment } from 'react';
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
        return <Fragment key={deficientItemState}></Fragment>;
      }

      return (
        <Fragment key={deficientItemState}>
          <Header
            state={deficientItemState}
            itemCount={deficientItems.length}
          />
          <List deficientItems={deficientItems} forceVisible={forceVisible} />
        </Fragment>
      );
    })}
  </div>
);

export default DeficientItemsStateGroups;
