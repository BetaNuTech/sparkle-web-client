import { FunctionComponent } from 'react';
import DeficientItemModel from '../../../common/models/deficientItem';
import Item from '../Item';

interface Props {
  deficientItems: DeficientItemModel[];
}

const List: FunctionComponent<Props> = ({ deficientItems }) => (
  <ul>
    {deficientItems.map((item) => (
      <Item key={item.id} deficientItem={item} />
    ))}
  </ul>
);

export default List;
