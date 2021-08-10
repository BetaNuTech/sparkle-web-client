import { FunctionComponent } from 'react';
import { useFirestore } from 'reactfire';
import LoadingHud from '../../common/LoadingHud';
import useProperty from '../../common/hooks/useProperty';
import useJob from '../../common/hooks/useJob';
import configBids from '../../config/bids';
import useJobBids from './hooks/useJobBids';
import userModel from '../../common/models/user';
import MobileLayout from './MobileLayout';

interface Props {
  user: userModel;
  propertyId: string;
  jobId: string;
  isOnline?: boolean;
  isStaging?: boolean;
  isNavOpen?: boolean;
  toggleNavOpen?(): void;
}

const colors = {
  primary: '-bgc-primary',
  secondary: '-bgc-secondary',
  gray: '-bgc-gray-light',
  info: '-bgc-info',
  alert: '-bgc-alert',
  orange: '-bgc-orange'
};

const JobBids: FunctionComponent<Props> = ({
  propertyId,
  jobId,
  isOnline,
  isStaging,
  toggleNavOpen
}) => {
  const firestore = useFirestore();

  // Fetch the data of property profile
  const { data: property } = useProperty(firestore, propertyId);

  // Fetch the data of job
  const { data: job } = useJob(firestore, jobId);

  // Fetch all jobs for property
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: bids } = useJobBids(firestore, jobId);

  // Loading State
  if (!property || !job) {
    return <LoadingHud title="Loading Bids" />;
  }

  return (
    <MobileLayout
      isOnline={isOnline}
      isStaging={isStaging}
      toggleNavOpen={toggleNavOpen}
      property={property}
      job={job}
      bids={bids}
      propertyId={propertyId}
      colors={colors}
      configBids={configBids}
    />
  );
};

JobBids.defaultProps = {};

export { colors };
export default JobBids;
