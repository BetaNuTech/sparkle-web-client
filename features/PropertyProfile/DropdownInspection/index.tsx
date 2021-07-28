import { FunctionComponent } from 'react';
import userModel from '../../../common/models/user';
import {
  canDeleteInspection,
  canReassignInspectionProperty
} from '../../../common/utils/userPermissions';
import Dropdown, {
  DropdownLink,
  DropdownButton
} from '../../../common/Dropdown';
import features from '../../../config/features';

interface Props {
  user: userModel;
  propertyId: string;
  inspectionId: string;
  onDeleteClick?: () => any;
}

const DropdownInspection: FunctionComponent<Props> = ({
  user,
  propertyId,
  inspectionId,
  onDeleteClick
}) => (
  <Dropdown>
    {canDeleteInspection(user) ? (
      <DropdownButton onClick={onDeleteClick}>Delete</DropdownButton>
    ) : null}
    {canReassignInspectionProperty(user) ? (
      <DropdownLink
        href={`/properties/${propertyId}/reassign-inspection/${inspectionId}`}
        featureEnabled={features.supportBetaPropertyInspectionMove}
      >
        Move
      </DropdownLink>
    ) : null}
  </Dropdown>
);

export default DropdownInspection;
