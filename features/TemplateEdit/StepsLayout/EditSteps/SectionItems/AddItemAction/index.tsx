import { FunctionComponent } from 'react';
import clsx from 'clsx';
import AddIcon from '../../../../../../public/icons/ios/add.svg';
import InspectionItemIcon from '../../../../../../public/icons/sparkle/inspection-item.svg';
import TextInputIcon from '../../../../../../public/icons/sparkle/text-input.svg';
import QuillIcon from '../../../../../../public/icons/sparkle/quill.svg';
import Dropdown, { DropdownButton } from '../../../../../../common/Dropdown';
import styles from './styles.module.scss';
import stepsStyles from '../../styles.module.scss';

type InputType = {
  label: string;
  value: string;
};

interface AddItemActionProps {
  inputTypes: InputType[];
  sectionId: string;
  addItem(sectionId: string, itemType: string): void;
}

const AddItemAction: FunctionComponent<AddItemActionProps> = ({
  inputTypes,
  sectionId,
  addItem
}) => (
  <div className={clsx(styles.container, stepsStyles.action)}>
    <span>Add new item</span>
    <button className={stepsStyles.action__icon}>
      <AddIcon />
    </button>

    <Dropdown>
      {inputTypes.map((type) => (
        <DropdownButton
          className={styles.button}
          key={type.value}
          type="button"
          onClick={() => addItem(sectionId, type.value)}
        >
          {getIcon(type.value)}
          {type.label}
        </DropdownButton>
      ))}
    </Dropdown>
  </div>
);

AddItemAction.defaultProps = {};

export default AddItemAction;

const getIcon = (itemType: string) => {
  let icon = <InspectionItemIcon className={styles.icon} />;
  if (itemType === 'signature') {
    icon = <QuillIcon className={styles.icon} />;
  }
  if (itemType === 'text_input') {
    icon = <TextInputIcon className={styles.icon} />;
  }
  return icon;
};
