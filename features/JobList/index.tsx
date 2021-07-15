import { FunctionComponent } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useFirestore } from 'reactfire';
import styles from './styles.module.scss';
import LoadingHud from '../../common/LoadingHud';
import useProperty from '../../common/hooks/useProperty';
import usePropertyJobs from './hooks/usePropertyJobs';
import userModel from '../../common/models/user';
import breakpoints from '../../config/breakpoints';

interface Props {
  user: userModel;
  propertyId: string;
  isOnline?: boolean;
  isStaging?: boolean;
  isNavOpen?: boolean;
  toggleNavOpen?(): void;
}

const JobList: FunctionComponent<Props> = ({
  user,
  propertyId,
  isOnline,
  isStaging,
  toggleNavOpen
}) => {
  const firestore = useFirestore();

  // Fetch the data of property profile
  const { data: property } = useProperty(firestore, propertyId);

  // Fetch all jobs for property
  const { data: jobs } = usePropertyJobs(firestore, propertyId);

  // Responsive queries
  const isMobileorTablet = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });
  const isDesktop = useMediaQuery({
    minWidth: breakpoints.desktop.minWidth
  });

  // Loading State
  if (!property || jobs.length === 0) {
    // TODO: Move loading hud here
  }
  return <LoadingHud title="Loading Jobs" />;
};

JobList.defaultProps = {
  isOnline: false,
  isStaging: false,
  isNavOpen: false,
  toggleNavOpen: () => {} // eslint-disable-line
};

export default JobList;
