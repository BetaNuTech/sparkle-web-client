import { FunctionComponent } from 'react';
import styles from './styles.module.scss';

interface Props {
  teamName?: string;
  handleChange: (e) => void;
}

const TeamForm: FunctionComponent<Props> = ({ teamName, handleChange }) => (
  <>
    <form className={styles.teamEditForm__form}>
      {/* Name */}
      <div className={styles.teamEditForm__formGroup}>
        <label htmlFor="name" className={styles.teamEditForm__formGroup__label}>
          Team Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          data-testid="team-name"
          onChange={(e) => handleChange(e.target.value)}
          value={teamName || ''}
          className={styles.teamEditForm__formGroup__input}
        />
      </div>
    </form>
  </>
);

export default TeamForm;
