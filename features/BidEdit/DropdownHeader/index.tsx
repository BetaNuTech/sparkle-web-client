import { FunctionComponent } from 'react';
import Dropdown, {
  DropdownLink,
  DropdownButton
} from '../../../common/Dropdown';

interface Props {
  bidLink: string;
  showSaveButton: boolean;
  isBidComplete: boolean;
  onFormAction: (action: string) => void;
}

const DropdownHeader: FunctionComponent<Props> = ({
  bidLink,
  showSaveButton,
  isBidComplete,
  onFormAction
}) => (
  <Dropdown isOnRight>
    {showSaveButton && !isBidComplete && (
      <DropdownButton
        onClick={() => onFormAction('save')}
        testid="jobedit-mobile-header-submit"
      >
        Save
      </DropdownButton>
    )}

    <DropdownLink href={bidLink} testid="dropdown-header-cancel" featureEnabled>
      Cancel
    </DropdownLink>
  </Dropdown>
);

export default DropdownHeader;
