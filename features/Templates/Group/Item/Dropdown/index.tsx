import { FunctionComponent } from 'react';
import clsx from 'clsx';
import ActionsIcon from '../../../../../public/icons/ios/actions.svg';
import Dropdown, {
  DropdownButton,
  DropdownLink
} from '../../../../../common/Dropdown';
import styles from './styles.module.scss';

interface Props {
  canEdit: boolean;
  templateId: string;
}

const TemplateItemDropDown: FunctionComponent<Props> = ({
  canEdit,
  templateId
}) => (
  <div className={styles.container}>
    <ActionsIcon />

    <Dropdown>
      <DropdownButton type="button">Copy</DropdownButton>
      <DropdownLink
        type="button"
        className={clsx(!canEdit && styles['item--disabled'])}
        href={`/templates/edit/${templateId}`}
        legacyHref={`/templates/update/${templateId}`}
      >
        Edit
      </DropdownLink>
      <DropdownButton type="button">Delete</DropdownButton>
    </Dropdown>
  </div>
);

TemplateItemDropDown.defaultProps = {};

export default TemplateItemDropDown;
