import clsx from 'clsx';
import { FunctionComponent } from 'react';
import parentStyles from '../styles.module.scss';
import styles from './styles.module.scss';

interface Props {
  onChange?(
    event: React.ChangeEvent<HTMLInputElement>,
    value: string | number
  ): void;
  selected: boolean;
  value: string;
  canEdit?: boolean;
  showValues?: boolean;
}

const TextInput: FunctionComponent<Props> = ({
  onChange,
  value,
  canEdit,
  showValues
}) => (
  <ul className={parentStyles.inspection}>
    <li className={parentStyles.inspection__textInputItem}>
      <input
        type="text"
        className={clsx(styles.input, showValues && '-full-max-width')}
        defaultValue={value}
        data-testid="item-text-input"
        placeholder="Enter Text"
        onChange={(event) => canEdit && onChange(event, event.target.value)}
        disabled={!canEdit}
      />
    </li>
  </ul>
);

TextInput.defaultProps = {
  canEdit: false,
  selected: false,
  showValues: false
};

export default TextInput;
