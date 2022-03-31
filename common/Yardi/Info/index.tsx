import { FunctionComponent } from 'react';
import styles from './styles.module.scss';

interface Props {
  label?: string;
  value?: string | number;
}

export const InfoLabel: FunctionComponent<Props> = ({ label }) => (
  <p className={styles.label}>{label}:</p>
);

export const InfoValue: FunctionComponent<Props> = ({ value, ...props }) => (
  <span className={styles.value} {...props}>
    {value}
  </span>
);

const Info: FunctionComponent<Props> = ({ label, value, ...props }) => (
  <div>
    <InfoLabel label={label} />
    <InfoValue value={value} {...props} />
  </div>
);

Info.defaultProps = {
  label: '',
  value: ''
};

export default Info;
