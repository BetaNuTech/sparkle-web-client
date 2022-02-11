import { FunctionComponent } from 'react';
import deficientItemModel from '../../../../common/models/deficientItem';
import Item from './Item';

interface Props {
  deficientItems: deficientItemModel[];
  forceVisible?: boolean;
}

const DeficientItemsStateGroupsList: FunctionComponent<Props> = ({
  deficientItems,
  forceVisible
}) => (
  <ul>
    {deficientItems.map((item) => (
      <Item key={item.id} deficientItem={item} forceVisible={forceVisible} />
    ))}
  </ul>
);

export default DeficientItemsStateGroupsList;
