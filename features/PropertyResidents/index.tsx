import { FunctionComponent } from 'react';
import { useMediaQuery } from 'react-responsive';
import residentModel from '../../common/models/yardi/resident';
import occupantModel from '../../common/models/yardi/occupant';
import PropertyModel from '../../common/models/property';
import ResidenceList from './List';
import Header from './Header';
import breakpoints from '../../config/breakpoints';
import SearchBar from '../../common/SearchBar';
import styles from './styles.module.scss';

interface Props {
  isOnline?: boolean;
  isStaging?: boolean;
  isNavOpen?: boolean;
  toggleNavOpen?(): void;
  forceVisible?: boolean;
  residents: residentModel[];
  occupants: occupantModel[];
  property: PropertyModel;
}

const PropertyResidents: FunctionComponent<Props> = ({
  isStaging,
  isOnline,
  residents,
  property
}) => {
  // Responsive queries
  const isMobile = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });

  return (
    <>
      <Header
        property={property}
        isMobile={isMobile}
        isStaging={isStaging}
        isOnline={isOnline}
      />
      <div className={styles.container}>
        {!isMobile && (
          <SearchBar
            searchQuery=""
            onSearchKeyDown={() => {}} // eslint-disable-line @typescript-eslint/no-empty-function
            onClearSearch={() => {}} // eslint-disable-line @typescript-eslint/no-empty-function
          />
        )}

        <ResidenceList residents={residents} isMobile={isMobile} />
      </div>
    </>
  );
};

export default PropertyResidents;
