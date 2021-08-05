import { FunctionComponent } from 'react';
import { useMediaQuery } from 'react-responsive';
import {
  useForm,
  SubmitHandler,
  UseFormRegister,
  FormState
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import clsx from 'clsx';
import Link from 'next/link';
import getConfig from 'next/config';
import propertyModel from '../../../common/models/property';
import LoadingHud from '../../../common/LoadingHud';
import jobModel from '../../../common/models/job';
import MobileHeader from '../../../common/MobileHeader';
import ErrorLabel from '../../../common/ErrorLabel';
import ErrorList from '../../../common/ErrorList';
import breakpoints from '../../../config/breakpoints';
import jobsConfig from '../../../config/jobs';
import ActionsIcon from '../../../public/icons/ios/actions.svg';
import { JobApiResult } from '../hooks/useJobForm';
import DropdownHeader from '../DropdownHeader';
import Header from '../Header';
import styles from '../styles.module.scss';
import formErrors from './errors';

interface Props {
  property: propertyModel;
  job: jobModel;
  apiState: JobApiResult;
  postJobCreate(propertyId: string, job: jobModel): void;
  putJobUpdate(propertyId: string, job: jobModel): void;
  isOnline?: boolean;
  isStaging?: boolean;
  isNavOpen?: boolean;
  toggleNavOpen?(): void;
}

type Inputs = {
  title: string;
  need: string;
  scopeOfWork: string;
  type: string;
};

const Layout: FunctionComponent<{
  isMobile: boolean;
  jobLink: string;
  job: jobModel;
  apiState: JobApiResult;
  onSubmit: (any?) => Promise<void>;
  register: UseFormRegister<Inputs>;
  formState: FormState<Inputs>;
}> = ({ isMobile, job, jobLink, apiState, onSubmit, register, formState }) => {
  const apiErrors =
    apiState.statusCode === 400 && apiState.response.errors
      ? apiState.response.errors.map((e) => e.detail)
      : [];

  return (
    <div
      className={clsx(
        styles.form__grid,
        !isMobile && styles.form__grid__desktop
      )}
    >
      <ErrorList errors={apiErrors} />

      <form onSubmit={onSubmit}>
        <div className={styles.jobNew__formGroup}>
          <label htmlFor="jobTitle">
            Title <span>*</span>
          </label>
          <div className={styles.jobNew__formGroup__control}>
            <input
              id="jobTitle"
              type="text"
              name="title"
              className={styles.jobNew__input}
              defaultValue={job.title}
              data-testid="job-form-title"
              {...register('title')}
              disabled={apiState.isLoading}
            />
            <ErrorLabel formName="title" errors={formState.errors} />
          </div>
        </div>
        <div className={styles.jobNew__formGroup}>
          <label htmlFor="jobDescription">Required</label>
          <div className={styles.jobNew__formGroup__control}>
            <textarea
              id="jobDescription"
              className="form-control"
              rows={4}
              name="need"
              defaultValue={job.need}
              data-testid="job-form-description"
              {...register('need')}
              disabled={apiState.isLoading}
            ></textarea>
            <ErrorLabel formName="need" errors={formState.errors} />
          </div>
        </div>
        <div className={styles.jobNew__formGroup}>
          <label htmlFor="jobType">Job Type</label>
          <select
            name="type"
            id="jobType"
            data-testid="job-form-type"
            defaultValue={job.type}
            {...register('type')}
            disabled={apiState.isLoading}
          >
            {Object.keys(jobsConfig.types).map((t) => (
              <option key={t} value={t}>
                {jobsConfig.types[t]}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.jobNew__formGroup}>
          <label htmlFor="jobScope">Scope of work</label>
          <div className={styles.jobNew__formGroup__control}>
            <textarea
              id="jobScope"
              className="form-control"
              rows={6}
              name="scopeOfWork"
              defaultValue={job.scopeOfWork}
              data-testid="job-form-scope"
              {...register('scopeOfWork')}
              disabled={apiState.isLoading}
            ></textarea>
            <ErrorLabel formName="scopeOfWork" errors={formState.errors} />
          </div>
        </div>
        <div className={clsx(styles.button__group, '-mt-lg')}>
          <button
            type="submit"
            data-testid="job-form-submit"
            disabled={apiState.isLoading}
            className={clsx(
              styles.button__submit,
              isMobile && styles.button__fullwidth
            )}
          >
            Submit
          </button>
        </div>
        {isMobile && (
          <div
            className={clsx(styles.button__group, styles.button__group__margin)}
          >
            <Link href={jobLink}>
              <a
                className={clsx(
                  styles.button__cancel,
                  styles.button__fullwidth,
                  '-ta-center'
                )}
                data-testid="mobile-form-cancel"
              >
                Cancel
              </a>
            </Link>
          </div>
        )}
      </form>
    </div>
  );
};

const JobForm: FunctionComponent<Props> = ({
  property,
  job,
  isOnline,
  isStaging,
  apiState,
  postJobCreate,
  putJobUpdate,
  toggleNavOpen
}) => {
  // Responsive queries
  const isMobileorTablet = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });
  const isDesktop = useMediaQuery({
    minWidth: breakpoints.desktop.minWidth
  });
  const config = getConfig() || {};
  const publicRuntimeConfig = config.publicRuntimeConfig || {};
  const basePath = publicRuntimeConfig.basePath || '';
  const jobLink = `${basePath}/properties/${property.id}/jobs`;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const formJob = {
      ...data
    } as jobModel;

    // Check if we have job data
    // Means it is an edit form
    if (Object.keys(job).length > 0) {
      formJob.id = job.id;
      // Update request
      putJobUpdate(property.id, formJob);
    } else {
      // Save request
      postJobCreate(property.id, formJob);
    }
  };

  // Setup form validations
  const validationSchema = yup.object().shape({
    title: yup.string().required(formErrors.titleRequired)
  });

  // Setup form submissions
  const { register, handleSubmit, formState } = useForm<Inputs>({
    mode: 'all',
    resolver: yupResolver(validationSchema)
  });

  const submitHandler = handleSubmit(onSubmit);

  // Mobile Header actions buttons
  const mobileHeaderActions = (headStyle) => (
    <>
      {apiState.isLoading && <LoadingHud title="Saving..." />}
      <div
        className={clsx(
          headStyle.header__button,
          headStyle['header__button--dropdown'],
          styles.jobNew__header__icon
        )}
      >
        <ActionsIcon />
        <DropdownHeader
          jobLink={jobLink}
          apiState={apiState}
          onSubmit={submitHandler}
        />
      </div>
    </>
  );

  return (
    <>
      {isMobileorTablet && (
        <>
          <MobileHeader
            title="Create New Job"
            toggleNavOpen={toggleNavOpen}
            isOnline={isOnline}
            isStaging={isStaging}
            actions={mobileHeaderActions}
            className={styles.jobNew__header}
          />
          <Layout
            isMobile={isMobileorTablet}
            job={job || ({} as jobModel)}
            jobLink={jobLink}
            onSubmit={submitHandler}
            register={register}
            formState={formState}
            apiState={apiState}
          />
        </>
      )}

      {/* Desktop Header & Content */}
      {isDesktop && (
        <div data-testid="desktop-form">
          {apiState.isLoading && <LoadingHud title="Saving..." />}
          <Header property={property} apiState={apiState} />
          <Layout
            isMobile={isMobileorTablet}
            job={job || ({} as jobModel)}
            jobLink={jobLink}
            onSubmit={submitHandler}
            register={register}
            formState={formState}
            apiState={apiState}
          />
        </div>
      )}
    </>
  );
};

export default JobForm;
