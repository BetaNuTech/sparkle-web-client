import { FunctionComponent } from 'react';
import propertyModel from '../../../common/models/property';
import styles from './styles.module.scss';
import Item from './Item';

interface Props {
  properties: Array<propertyModel>;
}

const ProfileList: FunctionComponent<Props> = ({ properties }) => (
  <ul className={styles.profileList} data-testid="properties-list">
    {properties.map((property) => (
      <Item key={property.id} property={property} />
    ))}
  </ul>
);

export default ProfileList;
