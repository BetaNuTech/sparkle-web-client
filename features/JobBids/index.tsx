import { FunctionComponent } from 'react';
import { useFirestore } from 'reactfire';
import LoadingHud from '../../common/LoadingHud';
import useProperty from '../../common/hooks/useProperty';
import useJobsBids from './hooks/useJobsBids';
import userModel from '../../common/models/user';
import styles from './styles.module.scss';

interface Props {
  user: userModel;
  propertyId: string;
  jobId: string;
}

const JobBids: FunctionComponent<Props> = ({ propertyId, jobId }) => {
  const firestore = useFirestore();

  // Fetch the data of property profile
  const { data: property } = useProperty(firestore, propertyId);

  // Fetch all jobs for property
  const { status: jobStatus, data: jobs } = useJobsBids(firestore, jobId);

  // Loading State
  if (!property) {
    return <LoadingHud title="Loading Bids" />;
  }

  return <p>Job Bids page</p>;
};

JobBids.defaultProps = {};

export default JobBids;
