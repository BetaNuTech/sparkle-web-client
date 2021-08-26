import { FunctionComponent } from 'react';
import Dropdown, {
  DropdownLink,
  DropdownButton
} from '../../../common/Dropdown';

interface Props {
  fileUrl: string;
}

const DropdownAttachment: FunctionComponent<Props> = ({ fileUrl }) => (
  <Dropdown isOnRight>
    <DropdownLink href={fileUrl} target="_blank">Open</DropdownLink>
    <DropdownButton>Delete</DropdownButton>
  </Dropdown>
);

export default DropdownAttachment;
