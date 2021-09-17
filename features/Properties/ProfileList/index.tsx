import { FunctionComponent } from 'react';
import propertyModel from '../../../common/models/property';
import styles from './styles.module.scss';
import Item from './Item';

interface Props {
  properties: Array<propertyModel>;
  forceVisible?: boolean;
}

const ProfileList: FunctionComponent<Props> = ({
  properties,
  forceVisible
}) => (
  <ul className={styles.profileList} data-testid="properties-list">
    {properties.map((property) => (
      <Item key={property.id} property={property} forceVisible={forceVisible} />
    ))}
  </ul>
);

ProfileList.defaultProps = {
  forceVisible: false
};

export default ProfileList;
