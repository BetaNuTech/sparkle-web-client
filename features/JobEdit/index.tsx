import { FunctionComponent } from 'react';
import { useFirestore } from 'reactfire';
import LoadingHud from '../../common/LoadingHud';
import useProperty from '../../common/hooks/useProperty';
import userModel from '../../common/models/user';
import useJob from '../../common/hooks/useJob';
import JobForm from './form';

interface Props {
  user: userModel;
  propertyId: string;
  jobId: string;
  isOnline?: boolean;
  isStaging?: boolean;
  isNavOpen?: boolean;
  toggleNavOpen?(): void;
}

const JobNew: FunctionComponent<Props> = ({
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
  const { data: job } =
    jobId === 'new' ? { data: null } : useJob(firestore, jobId);

  // Loading State
  if (!property) {
    return <LoadingHud title="Loading Property" />;
  }

  return (
    <JobForm
      property={property}
      isOnline={isOnline}
      isStaging={isStaging}
      toggleNavOpen={toggleNavOpen}
      job={job}
    />
  );
};

JobNew.defaultProps = {};

export default JobNew;
