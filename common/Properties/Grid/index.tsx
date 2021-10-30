import { FunctionComponent } from 'react';
import propertyModel from '../../models/property';
import styles from './styles.module.scss';
import Item from './Item';

interface Props {
  properties: Array<propertyModel>;
  forceVisible?: boolean;
}

const PropertyGrid: FunctionComponent<Props> = ({
  properties,
  forceVisible
}) => (
  <ul className={styles.propertyGrid} data-testid="properties-list">
    {properties.map((property) => (
      <Item key={property.id} property={property} forceVisible={forceVisible} />
    ))}
  </ul>
);

PropertyGrid.defaultProps = {
  forceVisible: false
};

export default PropertyGrid;
