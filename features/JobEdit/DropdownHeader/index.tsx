import { FunctionComponent } from 'react';
import Dropdown, {
  DropdownLink,
  DropdownButton
} from '../../../common/Dropdown';

interface Props {
  jobLink: string;
  isLoading: boolean;
  isJobComplete: boolean;
  canApprove: boolean;
  canAuthorize: boolean;
  canExpedite: boolean;
  onFormAction: (action: string) => void;
}

const DropdownAdd: FunctionComponent<Props> = ({
  jobLink,
  isLoading,
  isJobComplete,
  canApprove,
  canAuthorize,
  canExpedite,
  onFormAction
}) => (
  <Dropdown isOnRight>
    {!isJobComplete && (
      <DropdownButton
        disabled={isLoading}
        onClick={() => onFormAction('save')}
        testid="jobedit-mobile-header-submit"
      >
        Save
      </DropdownButton>
    )}
    {canApprove && (
      <DropdownButton
        disabled={isLoading}
        onClick={() => onFormAction('approved')}
        testid="jobedit-mobile-header-approve"
      >
        Approve
      </DropdownButton>
    )}
    {canAuthorize && (
      <DropdownButton
        disabled={isLoading}
        onClick={() => onFormAction('authorized')}
        testid="jobedit-mobile-header-authorize"
      >
        Authorize
      </DropdownButton>
    )}
    {canExpedite && (
      <DropdownButton
        disabled={isLoading}
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
