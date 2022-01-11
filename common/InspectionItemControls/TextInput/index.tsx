import { FunctionComponent } from 'react';
import parentStyles from '../styles.module.scss';
import styles from './styles.module.scss';

interface Props {
  onMainInputChange?(
    event: React.ChangeEvent<HTMLInputElement>,
    value: string | number
  ): void;
  selected: boolean;
  textInputValue: string;
  isDisabled?: boolean;
}

const TextInput: FunctionComponent<Props> = ({
  onMainInputChange,
  textInputValue,
  isDisabled
}) => (
  <ul className={parentStyles.inspection}>
    <li className={parentStyles.inspection__textInputItem}>
      <input
        type="text"
        className={styles.input}
        defaultValue={textInputValue}
        data-testid="item-text-input"
        placeholder="Enter Text"
        onChange={(event) => onMainInputChange(event, event.target.value)}
        disabled={isDisabled}
      />
    </li>
  </ul>
);

TextInput.defaultProps = {
  isDisabled: false
};

export default TextInput;
