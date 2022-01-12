import { FunctionComponent } from 'react';
import DeficientItemModel from '../../../common/models/deficientItem';
import StateItemHeader from '../StateItemHeader';
import List from '../List';

interface Props {
  deficientItemState: string;
  deficientItemsByState: Map<string, DeficientItemModel[]>;
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
    <div>
      <StateItemHeader
        state={deficientItemState}
        itemCount={deficientItems.length}
      />
      <List deficientItems={deficientItems} />
    </div>
  );
};

export default DeficientStateItems;
