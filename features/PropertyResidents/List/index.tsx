import { FunctionComponent } from 'react';
import residentModel from '../../../common/models/yardi/resident';
import Item from './Item';
import styles from './styles.module.scss';

interface Props {
  residents: residentModel[];
  isMobile:boolean;
}

const ResidentList: FunctionComponent<Props> = ({ residents,isMobile }) => (
  <div>
    <h3 className={styles.header}>Residents</h3>
    <ul>
      {residents.map((resident) => (
        <Item key={resident.id} resident={resident} isMobile={isMobile} />
      ))}
    </ul>
  </div>
);

export default ResidentList;
