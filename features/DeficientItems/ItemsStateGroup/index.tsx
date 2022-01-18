import { FunctionComponent } from 'react';
import deficientItemModel from '../../../common/models/deficientItem';
import { deficientItemStateOrder } from '../../../config/deficientItems';
import StateItems from '../StateItems';

interface Props {
  deficientItemsByState: Map<string, deficientItemModel[]>;
}

const DeficientItemsStateGroup: FunctionComponent<Props> = ({
  deficientItemsByState
}) => (
  <>
    {deficientItemStateOrder.map((deficientItemState) => (
      <StateItems
        key={deficientItemState}
        deficientItemState={deficientItemState}
        deficientItemsByState={deficientItemsByState}
      />
    ))}
  </>
);

export default DeficientItemsStateGroup;
