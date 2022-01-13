import { FunctionComponent } from 'react';
import deficientItemModel from '../../../common/models/deficientItem';
import Item from '../Item';

interface Props {
  deficientItems: deficientItemModel[];
}

const List: FunctionComponent<Props> = ({ deficientItems }) => (
  <ul>
    {deficientItems.map((item) => (
      <Item key={item.id} deficientItem={item} />
    ))}
  </ul>
);

export default List;
