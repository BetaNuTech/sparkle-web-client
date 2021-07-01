import userModel from '../../../common/models/user';
import {
  canDeleteInspection,
  canReassignInspectionProperty
} from '../../../common/utils/userPermissions';

// Checks that the user can re-assign inspection entry against a property
const hasInsepectionUpdate = (user: userModel): boolean =>
  canDeleteInspection(user) || canReassignInspectionProperty(user);

export default hasInsepectionUpdate;
