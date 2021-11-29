import { FunctionComponent } from 'react';
import residentModel from '../../common/models/yardi/resident';
import occupantModel from '../../common/models/yardi/occupant';
import ResidenceList from './List';
import styles from './styles.module.scss';

interface Props {
  isOnline?: boolean;
  isStaging?: boolean;
  isNavOpen?: boolean;
  toggleNavOpen?(): void;
  forceVisible?: boolean;
  residents: residentModel[];
  occupants: occupantModel[];
}

const PropertyResidents: FunctionComponent<Props> = ({ residents }) => (
  <>
    <header className={styles.header} data-testid="workorders-header">
      <h1 className={styles.header__title}>Residents List</h1>
    </header>
    <ResidenceList residents={residents} />
  </>
);

export default PropertyResidents;
