import { forwardRef } from 'react';
import { UseFormRegister } from 'react-hook-form';
import jobsConfig from '../../../../../config/jobs';
import styles from '../../../styles.module.scss';

interface Props {
  jobType: string;
  isLoading: boolean;
  isJobComplete: boolean;
}

const JobTitle = forwardRef<
  HTMLInputElement,
  Props & ReturnType<UseFormRegister<any>>
>(({ jobType, isLoading, isJobComplete, ...props }, ref) => (
  <div className={styles.jobNew__formGroup} data-testid="job-form-type">
    <label htmlFor="jobType">
      Project Type <span>*</span>
    </label>
    {Object.keys(jobsConfig.types).map((jobConfigType, index) => (
      <label
        key={jobConfigType}
        className={styles.jobNew__formGroup__radioList}
      >
        <input
          type="radio"
          name="type"
          value={jobConfigType}
          ref={ref}
          {...(isJobComplete
            ? {
                checked: jobType && jobType === jobConfigType
              }
            : {
                defaultChecked:
                  (jobType && jobType === jobConfigType) ||
                  (!jobType && index === 0)
              })}
          data-testid="job-form-type-radio"
          disabled={isLoading || isJobComplete}
          {...props}
        />
        <div className={styles.jobNew__formGroup__radioText}>
          <span
            className={styles.jobNew__formGroup__radioText__heading}
            data-testid="job-form-type-text"
          >
            {jobsConfig.types[jobConfigType].title}
          </span>
          <span
            className={styles.jobNew__formGroup__radioText__desc}
            data-testid="job-form-type-desc"
          >
            {jobsConfig.types[jobConfigType].description}
          </span>
        </div>
      </label>
    ))}
  </div>
));

JobTitle.displayName = 'JobTitle';

export default JobTitle;
