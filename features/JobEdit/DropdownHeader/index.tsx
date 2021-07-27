import { FunctionComponent } from 'react';
import Dropdown, {
  DropdownLink,
  DropdownButton
} from '../../../common/Dropdown';

interface Props {
  jobLink: string;
}

const DropdownAdd: FunctionComponent<Props> = ({ jobLink }) => (
  <Dropdown isOnRight>
    <DropdownButton>Submit</DropdownButton>
    <DropdownLink href={jobLink} testid="dropdown-header-cancel">
      Cancel
    </DropdownLink>
  </Dropdown>
);

export default DropdownAdd;
