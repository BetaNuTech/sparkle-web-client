import { FunctionComponent } from 'react';
import Dropdown, {
  DropdownLink,
  DropdownButton
} from '../../../common/Dropdown';

interface Props {
  bidLink: string;
  isBidComplete: boolean;
  onFormAction: (action: string) => void;
}

const DropdownHeader: FunctionComponent<Props> = ({
  bidLink,
  isBidComplete,
  onFormAction
}) => (
  <Dropdown isOnRight>
    {!isBidComplete && (
      <DropdownButton
        onClick={() => onFormAction('save')}
        testid="jobedit-mobile-header-submit"
      >
        Save
      </DropdownButton>
    )}

    <DropdownLink href={bidLink} testid="dropdown-header-cancel">
      Cancel
    </DropdownLink>
  </Dropdown>
);

export default DropdownHeader;
