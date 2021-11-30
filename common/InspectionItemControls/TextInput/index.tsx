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
}

const TextInput: FunctionComponent<Props> = ({
  onMainInputChange,
  textInputValue
}) => (
  <ul className={parentStyles.inspection}>
    <li className={parentStyles.inspection__textInputItem}>
      <input
        type="text"
        className={styles.input}
        defaultValue={textInputValue}
        placeholder="Enter Text"
        onChange={(event) => onMainInputChange(event, event.target.value)}
      />
    </li>
  </ul>
);

TextInput.defaultProps = {};

export default TextInput;
