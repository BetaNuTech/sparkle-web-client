import { FunctionComponent } from 'react';
import styles from '../styles.module.scss';
import ErrorList from '../../../common/ErrorList';

interface Props {
  teamName?: string;
  handleChange: (e) => void;
  error?: string[];
}

const TeamForm: FunctionComponent<Props> = ({
  teamName,
  handleChange,
  error
}) => (
  <>
    <form className={styles.teamEdit__form}>
      {/* Name */}
      <div className={styles.teamEdit__formGroup}>
        <label htmlFor="name" className={styles.teamEdit__formGroup__label}>
          Team Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          data-testid="team-name"
          onChange={(e) => handleChange(e.target.value)}
          value={teamName || ''}
          className={styles.teamEdit__formGroup__input}
        />
      </div>

      <div className={styles.teamEdit__formGroup}>
        <ErrorList errors={error} />
      </div>
    </form>
  </>
);

export default TeamForm;
