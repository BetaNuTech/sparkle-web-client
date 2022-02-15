import { FunctionComponent } from 'react';
import deficientItemModel from '../../../../common/models/deficientItem';
import Item from './Item';

interface Props {
  deficientItems: deficientItemModel[];
  forceVisible?: boolean;
  isMobile: boolean;
}

const DeficientItemsStateGroupsList: FunctionComponent<Props> = ({
  deficientItems,
  forceVisible,
  isMobile
}) => (
  <ul>
    {deficientItems.map((item) => (
      <Item
        key={item.id}
        deficientItem={item}
        forceVisible={forceVisible}
        isMobile={isMobile}
      />
    ))}
  </ul>
);

export default DeficientItemsStateGroupsList;
