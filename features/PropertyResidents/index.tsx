import { FunctionComponent } from 'react';
import { useMediaQuery } from 'react-responsive';
import residentModel from '../../common/models/yardi/resident';
import occupantModel from '../../common/models/yardi/occupant';
import ResidenceList from './List';
import Header from './Header';
import breakpoints from '../../config/breakpoints';

interface Props {
  isOnline?: boolean;
  isStaging?: boolean;
  isNavOpen?: boolean;
  toggleNavOpen?(): void;
  forceVisible?: boolean;
  residents: residentModel[];
  occupants: occupantModel[];
  propertyId: string;
}

const PropertyResidents: FunctionComponent<Props> = ({
  isStaging,
  isOnline,
  residents,
  propertyId
}) => {
  // Responsive queries
  const isMobile = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });

  return (
    <>
      <Header
        propertyId={propertyId}
        isMobile={isMobile}
        isStaging={isStaging}
        isOnline={isOnline}
      />
      {/* <header className={styles.header} data-testid="workorders-header">
      <h1 className={styles.header__title}>Residents List</h1>
    </header> */}
      <ResidenceList residents={residents} />
    </>
  );
};

export default PropertyResidents;
