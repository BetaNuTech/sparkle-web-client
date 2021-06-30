import { FunctionComponent } from 'react';
import Dropdown, { DropdownLink } from '../../../common/Dropdown';

const DropdownAdd: FunctionComponent = () => (
  <Dropdown>
    <DropdownLink href="/teams/create/">Add Team</DropdownLink>
    <DropdownLink href="/properties/update/">Add Property</DropdownLink>
  </Dropdown>
);

export default DropdownAdd;
