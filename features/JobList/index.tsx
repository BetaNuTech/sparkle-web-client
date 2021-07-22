import { FunctionComponent } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useFirestore } from 'reactfire';
import styles from './styles.module.scss';
import LoadingHud from '../../common/LoadingHud';
import useProperty from '../../common/hooks/useProperty';
import usePropertyJobs from './hooks/usePropertyJobs';
import userModel from '../../common/models/user';
import configJobs from '../../config/jobs';
import breakpoints from '../../config/breakpoints';
import Header from './Header';
import MobileLayout from './MobileLayout';
import Grid from './Grid';

interface Props {
  user: userModel;
  propertyId: string;
  isOnline?: boolean;
  isStaging?: boolean;
  isNavOpen?: boolean;
  toggleNavOpen?(): void;
}

const colors = {
  primary: '-bgc-primary',
  secondary: '-bgc-secondary',
  info: '-bgc-info',
  alert: '-bgc-alert',
  orange: '-bgc-orange'
};

const JobList: FunctionComponent<Props> = ({
  propertyId,
  isOnline,
  isStaging,
  toggleNavOpen
}) => {
  const firestore = useFirestore();

  // Fetch the data of property profile
  const { data: property } = useProperty(firestore, propertyId);

  // Fetch all jobs for property
  const { status: jobStatus, data: jobs } = usePropertyJobs(
    firestore,
    propertyId
  );

  // Responsive queries
  const isMobileorTablet = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });
  const isDesktop = useMediaQuery({
    minWidth: breakpoints.desktop.minWidth
  });

  // Loading State
  if (!property) {
    return <LoadingHud title="Loading Jobs" />;
  }

  return (
    <>
      {isMobileorTablet && (
        <MobileLayout
          isOnline={isOnline}
          isStaging={isStaging}
          toggleNavOpen={toggleNavOpen}
          jobs={jobs}
          propertyId={propertyId}
          colors={colors}
          configJobs={configJobs}
        />
      )}

      {/* Desktop Header & Content */}
      {isDesktop && (
        <div className={styles.properties__container}>
          <Header property={property} jobs={jobs} jobStatus={jobStatus} />
          <Grid jobs={jobs} propertyId={propertyId} />
        </div>
      )}
    </>
  );
};

JobList.defaultProps = {
  isOnline: false,
  isStaging: false,
  isNavOpen: false,
  toggleNavOpen: () => {} // eslint-disable-line
};

export { colors };
export default JobList;
