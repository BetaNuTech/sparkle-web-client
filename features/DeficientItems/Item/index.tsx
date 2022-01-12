import { FunctionComponent } from 'react';
import LinkFeature from '../../../common/LinkFeature';
import DeficientItemModel from '../../../common/models/deficientItem';
import features from '../../../config/features';

interface Props {
  deficientItem: DeficientItemModel;
}

const Item: FunctionComponent<Props> = ({ deficientItem }) => (
  <li>
    <LinkFeature
      href={`/properties/${deficientItem.property}/deficient-items/edit/${deficientItem.id}`}
      legacyHref={`/properties/${deficientItem.property}/deficient-items/${deficientItem.id}`}
      featureEnabled={features.supportBetaDeficientItemEdit}
    >
      {deficientItem.id}
    </LinkFeature>
  </li>
);

export default Item;
