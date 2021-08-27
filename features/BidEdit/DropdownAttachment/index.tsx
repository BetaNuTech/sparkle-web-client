import { FunctionComponent } from 'react';
import Dropdown, {
  DropdownLink,
  DropdownButton
} from '../../../common/Dropdown';

interface Props {
  fileUrl: string;
  onDelete: () => void;
}

const DropdownAttachment: FunctionComponent<Props> = ({
  fileUrl,
  onDelete
}) => (
  <Dropdown isOnRight>
    <DropdownLink href={fileUrl} target="_blank">
      Open
    </DropdownLink>
    <DropdownButton type="button" onClick={onDelete} data-testid="button-delete-attachment">Delete</DropdownButton>
  </Dropdown>
);

export default DropdownAttachment;
