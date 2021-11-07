import { FunctionComponent } from 'react';
import clsx from 'clsx';
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
    {properties.length ? (
      properties.map((property) => (
        <Item
          key={property.id}
          property={property}
          forceVisible={forceVisible}
        />
      ))
    ) : (
      <h5 className={clsx('-pt', '-pl')}>Team has no properties</h5>
    )}
  </ul>
);

PropertyGrid.defaultProps = {
  forceVisible: false
};

export default PropertyGrid;
