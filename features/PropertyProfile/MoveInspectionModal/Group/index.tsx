import clsx from 'clsx';
import React, { FunctionComponent } from 'react';
import PropertyModel from '../../../../common/models/property';
import TeamModel from '../../../../common/models/team';
import styles from './styles.module.scss';

interface Props {
  selectedProperty: string;
  onSelectProperty(propertyId: string): void;
  team: TeamModel;
  properties: PropertyModel[];
}

const PropertiesGroup: FunctionComponent<Props> = ({
  selectedProperty,
  onSelectProperty,
  team,
  properties
}) => (
  <li className={styles.group} data-testid="move-inspection-properties-team">
    <header className={styles.group__header}>{team.name}</header>
    <ul>
      {properties.map((property) => (
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        <li
          key={property.id}
          className={clsx(
            styles.item,
            selectedProperty === property.id && styles['item--selected']
          )}
          onClick={() => onSelectProperty(property.id)}
          data-testid="move-inspection-property-item"
          data-group={team.id}
          data-property={property.id}
          data-selected={selectedProperty === property.id ? 'selected' : ''}
        >
          {property.name}
        </li>
      ))}
    </ul>
  </li>
);

export default PropertiesGroup;
