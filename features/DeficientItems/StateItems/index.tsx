import { FunctionComponent } from 'react';
import deficientItemModel from '../../../common/models/deficientItem';
import StateItemHeader from '../StateItemHeader';
import List from '../List';

interface Props {
  deficientItemState: string;
  deficientItemsByState: Map<string, deficientItemModel[]>;
}

const DeficientStateItems: FunctionComponent<Props> = ({
  deficientItemState,
  deficientItemsByState
}) => {
  const deficientItems = deficientItemsByState.get(deficientItemState) || [];
  if (deficientItems.length === 0) {
    return null;
  }

  return (
    <>
      <StateItemHeader
        state={deficientItemState}
        itemCount={deficientItems.length}
      />
      <List deficientItems={deficientItems} />
    </>
  );
};

export default DeficientStateItems;
