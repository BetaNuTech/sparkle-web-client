import { FunctionComponent } from 'react';
import ActionsIcon from '../../../../../public/icons/ios/actions.svg';
import Dropdown, {
  DropdownButton,
  DropdownLink
} from '../../../../../common/Dropdown';
import styles from './styles.module.scss';

interface Props {
  canEdit: boolean;
  canDelete: boolean;
  canCreate: boolean;
  templateId: string;
}

const TemplateItemDropDown: FunctionComponent<Props> = ({
  canEdit,
  canDelete,
  canCreate,
  templateId
}) => (
  <div className={styles.container} data-testid="template-item-dropdown">
    <ActionsIcon />

    <Dropdown>
      {canCreate && (
        <DropdownButton
          type="button"
          data-testid="template-item-dropdown-copy-action"
        >
          Copy
        </DropdownButton>
      )}
      {canEdit && (
        <DropdownLink
          type="button"
          href={`/templates/edit/${templateId}`}
          legacyHref={`/templates/update/${templateId}`}
          data-testid="template-item-dropdown-edit-link"
        >
          Edit
        </DropdownLink>
      )}
      {canDelete && (
        <DropdownButton
          type="button"
          data-testid="template-item-dropdown-delete-action"
        >
          Delete
        </DropdownButton>
      )}
    </Dropdown>
  </div>
);

TemplateItemDropDown.defaultProps = {};

export default TemplateItemDropDown;
