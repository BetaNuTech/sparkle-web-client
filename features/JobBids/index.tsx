import { FunctionComponent } from 'react';
import { useFirestore } from 'reactfire';
import LoadingHud from '../../common/LoadingHud';
import useProperty from '../../common/hooks/useProperty';
import useJob from '../../common/hooks/useJob';
import useJobBids from './hooks/useJobBids';
import userModel from '../../common/models/user';

interface Props {
  user: userModel;
  propertyId: string;
  jobId: string;
}

const JobBids: FunctionComponent<Props> = ({ propertyId, jobId }) => {
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

  return <p>Job Bids page</p>;
};

JobBids.defaultProps = {};

export default JobBids;
