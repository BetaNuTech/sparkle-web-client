import { FunctionComponent } from 'react';
import Dropdown, {
  DropdownLink,
  DropdownButton
} from '../../../common/Dropdown';
import { JobApiResult } from '../hooks/useJobForm';

interface Props {
  jobLink: string;
  apiState: JobApiResult;
  onSubmit: (any?) => Promise<void>;
}

const DropdownAdd: FunctionComponent<Props> = ({
  jobLink,
  apiState,
  onSubmit
}) => (
  <Dropdown isOnRight>
    <DropdownButton disabled={apiState.isLoading} onClick={onSubmit}>
      Submit
    </DropdownButton>
    <DropdownLink href={jobLink} testid="dropdown-header-cancel">
      Cancel
    </DropdownLink>
  </Dropdown>
);

export default DropdownAdd;
