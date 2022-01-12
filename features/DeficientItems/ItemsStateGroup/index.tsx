import { FunctionComponent } from 'react';
import DeficientItemModel from '../../../common/models/deficientItem';
import deficientItemStateOrder from '../../../config/deficient';
import StateItems from '../StateItems';

interface Props {
  deficientItemsListByState: Map<string, DeficientItemModel[]>;
}

const DeficientItemsStateGroup: FunctionComponent<Props> = ({
  deficientItemsListByState
}) => (
  <>
    {deficientItemStateOrder.map((deficientItemState) => (
      <StateItems
        key={deficientItemState}
        deficientItemState={deficientItemState}
        deficientItemsByState={deficientItemsListByState}
      />
    ))}
  </>
);

export default DeficientItemsStateGroup;
