import { FunctionComponent } from 'react';
import Dropdown, {
  DropdownLink,
  DropdownButton
} from '../../../common/Dropdown';
import { JobApiResult } from '../hooks/useJobForm';

interface Props {
  jobLink: string;
  apiState: JobApiResult;
  isJobComplete: boolean;
  onSubmit: (any?) => Promise<void>;
}

const DropdownAdd: FunctionComponent<Props> = ({
  jobLink,
  apiState,
  isJobComplete,
  onSubmit
}) => (
  <Dropdown isOnRight>
    {!isJobComplete && (
      <DropdownButton disabled={apiState.isLoading} onClick={onSubmit} testid="jobedit-mobile-header-submit">
        Submit
      </DropdownButton>
    )}

    <DropdownLink href={jobLink} testid="dropdown-header-cancel">
      Cancel
    </DropdownLink>
  </Dropdown>
);

export default DropdownAdd;
