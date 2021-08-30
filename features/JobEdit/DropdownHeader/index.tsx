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
  canApprove: boolean;
  canAuthorize: boolean;
  canExpedite: boolean;
  onFormAction: (action: string) => void;
}

const DropdownAdd: FunctionComponent<Props> = ({
  jobLink,
  apiState,
  isJobComplete,
  canApprove,
  canAuthorize,
  canExpedite,
  onFormAction
}) => (
  <Dropdown isOnRight>
    {!isJobComplete && (
      <DropdownButton
        disabled={apiState.isLoading}
        onClick={() => onFormAction('save')}
        testid="jobedit-mobile-header-submit"
      >
        Save
      </DropdownButton>
    )}
    {canApprove && (
      <DropdownButton
        disabled={apiState.isLoading}
        onClick={() => onFormAction('approved')}
        testid="jobedit-mobile-header-approve"
      >
        Approve
      </DropdownButton>
    )}
    {canAuthorize && (
      <DropdownButton
        disabled={apiState.isLoading}
        onClick={() => onFormAction('authorized')}
        testid="jobedit-mobile-header-authorize"
      >
        Authorize
      </DropdownButton>
    )}
    {canExpedite && (
      <DropdownButton
        disabled={apiState.isLoading}
        onClick={() => onFormAction('expedite')}
        testid="jobedit-mobile-header-expedite"
      >
        Expedite
      </DropdownButton>
    )}

    <DropdownLink href={jobLink} testid="dropdown-header-cancel" featureEnabled>
      Cancel
    </DropdownLink>
  </Dropdown>
);

export default DropdownAdd;
