import { FunctionComponent } from 'react';
import residentModel from '../../../common/models/yardi/resident';
import Item from './Item';
import styles from './styles.module.scss';

interface Props {
  residents: residentModel[];
  isMobile: boolean;
  forceVisible?: boolean;
  onClickResident(resident: residentModel): void;
}

const ResidentList: FunctionComponent<Props> = ({
  residents,
  isMobile,
  forceVisible,
  onClickResident
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
          onClick={() => onClickResident(resident)}
        />
      ))}
    </ul>
  </div>
);

export default ResidentList;
