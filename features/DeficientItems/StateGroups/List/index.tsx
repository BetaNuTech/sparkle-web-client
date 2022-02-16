import { FunctionComponent } from 'react';
import deficientItemModel from '../../../../common/models/deficientItem';
import Item from './Item';

interface Props {
  deficientItems: deficientItemModel[];
  forceVisible?: boolean;
  isMobile: boolean;
  onSelectDeficiency(state: string, deficiencyId: string): void;
  selectedDeficiencies: string[];
}

const DeficientItemsStateGroupsList: FunctionComponent<Props> = ({
  deficientItems,
  forceVisible,
  isMobile,
  onSelectDeficiency,
  selectedDeficiencies
}) => (
  <ul>
    {deficientItems.map((item) => (
      <Item
        key={item.id}
        deficientItem={item}
        forceVisible={forceVisible}
        isMobile={isMobile}
        onSelectDeficiency={onSelectDeficiency}
        selectedDeficiencies={selectedDeficiencies}
      />
    ))}
  </ul>
);

export default DeficientItemsStateGroupsList;
