import { FunctionComponent } from 'react';
import residentModel from '../../../common/models/yardi/resident';
import Item from './Item';
import styles from './styles.module.scss';

interface Props {
  residents: residentModel[];
  isMobile: boolean;
  forceVisible?: boolean;
}

const ResidentList: FunctionComponent<Props> = ({
  residents,
  isMobile,
  forceVisible
}) => (
  <div>
    <h3 className={styles.header}>Residents</h3>
    <ul>
      {residents.map((resident) => (
        <Item
          key={resident.id}
          resident={resident}
          isMobile={isMobile}
          forceVisible={forceVisible}
        />
      ))}
    </ul>
  </div>
);

export default ResidentList;
