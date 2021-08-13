import { FunctionComponent, useState, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useForm, UseFormRegister, FormState } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import clsx from 'clsx';
import Link from 'next/link';
import getConfig from 'next/config';
import moment from 'moment';
import propertyModel from '../../../common/models/property';
import jobModel from '../../../common/models/job';
import bidModel from '../../../common/models/bid';
import bidAttachmentModel from '../../../common/models/bidAttachment';
import utilString from '../../../common/utils/string';
import ErrorLabel from '../../../common/ErrorLabel';
import MobileHeader from '../../../common/MobileHeader';
import breakpoints from '../../../config/breakpoints';
import bidsConfig from '../../../config/bids';
import formats from '../../../config/formats';
import AddIcon from '../../../public/icons/ios/add.svg';
import ActionsIcon from '../../../public/icons/ios/actions.svg';
import DropdownHeader from '../DropdownHeader';
import Header from '../Header';
import styles from '../styles.module.scss';
import formErrors from './errors';

interface Props {
  property: propertyModel;
  job: jobModel;
  bid: bidModel;
  isNewBid: boolean;
  isOnline?: boolean;
  isStaging?: boolean;
  isNavOpen?: boolean;
  toggleNavOpen?(): void;
}

type Inputs = {
  vendor: string;
  costMin: number;
  costMax: number;
  startAt: string;
  completeAt: string;
  vendorDetails: string;
};

interface LayoutProps {
  isMobile: boolean;
  job: jobModel;
  bid: bidModel;
  bidLink: string;
  isNewBid: boolean;
  isBidComplete: boolean;
  onSubmit: (action: string) => void;
  register: UseFormRegister<Inputs>;
  formState: FormState<Inputs>;
}

const Layout: FunctionComponent<LayoutProps> = ({
  isMobile,
  job,
  bid,
  bidLink,
  isNewBid,
  isBidComplete,
  onSubmit,
  register,
  formState
}) => {
  const nextState = !isNewBid && bidsConfig.nextState[bid.state];
  const [isFixedCostType, setFixedCostType] = useState(
    isNewBid ? true : bid.costMin === bid.costMax
  );
  const inputFile = useRef(null);

  let startAt = null;
  let completeAt = null;
  let attachments: bidAttachmentModel[] = [];
  if (!isNewBid) {
    startAt =
      bid.startAt &&
      moment.unix(bid.startAt).format(formats.browserDateDisplay);
    completeAt =
      bid.completeAt &&
      moment.unix(bid.completeAt).format(formats.browserDateDisplay);
    attachments = bid.attachments;
  }

  const onUploadClick = () => {
    if (inputFile && inputFile.current) {
      inputFile.current.click();
    }
  };

  return (
    <div className={styles.form__grid}>
      {!isNewBid && (
        <>
          {isMobile && (
            <h1
              data-testid="bid-form-title-mobile"
              className={styles.mobileTitle}
            >
              {job.title}
            </h1>
          )}
          <div className={styles.form__grid__info}>
            <div className={styles.bid__info}>
              <div className={styles.bid__info__box}>
                <p>Bid Status{!isMobile && <> :&nbsp;</>}</p>
                <h3 data-testid="bid-form-edit-state">
                  {utilString.titleize(bid.state)}
                </h3>
              </div>
              {nextState && (
                <div className={styles.bid__info__box}>
                  <p>Requires{!isMobile && <> :&nbsp;</>}</p>
                  <h3 data-testid="bid-form-edit-nextstatus">{nextState}</h3>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <form>
        <div className={styles.form__fields}>
          <div className={styles.form__fields__leftColumn}>
            <div className={styles.form__group}>
              <label htmlFor="bidVendor">
                Vendor <span>*</span>
              </label>
              <div className={styles.form__group__control}>
                <input
                  id="bidVendor"
                  type="text"
                  name="vendor"
                  className={styles.form__input}
                  defaultValue={bid.vendor}
                  data-testid="bid-form-vendor"
                  {...register('vendor')}
                />
                <ErrorLabel formName="vendor" errors={formState.errors} />
              </div>
            </div>
            <div className={styles.form__formCost}>
              <label>Cost</label>
              <div className={styles.form__formCost__select}>
                <button
                  type="button"
                  className={clsx(isFixedCostType && styles.active)}
                  onClick={() => setFixedCostType(true)}
                >
                  Fixed Cost
                </button>
                <span className={styles.form__formCost__separator}></span>
                <button
                  type="button"
                  className={clsx(!isFixedCostType && styles.active)}
                  onClick={() => setFixedCostType(false)}
                >
                  Range
                </button>
              </div>
            </div>
            <div className={styles.form__row}>
              <div
                className={clsx(
                  styles.form__row__cell,
                  isFixedCostType ? styles['form__row__cell--fillRow'] : ''
                )}
              >
                <div className={styles.form__group}>
                  <div className={styles.form__group__control}>
                    <input
                      type="number"
                      name="costMin"
                      className={styles.form__input}
                      placeholder={isFixedCostType ? '' : 'Minimum'}
                      defaultValue={bid.costMin}
                      data-testid="bid-form-cost-min"
                      {...register('costMin')}
                    />
                    <ErrorLabel formName="costMin" errors={formState.errors} />
                  </div>
                </div>
              </div>
              {!isFixedCostType && (
                <div className={styles.form__row__cell}>
                  <div className={styles.form__group}>
                    <div className={styles.form__group__control}>
                      <input
                        type="number"
                        name="costMax"
                        className={styles.form__input}
                        placeholder="Maximum"
                        defaultValue={bid.costMax}
                        data-testid="bid-form-cost-max"
                        {...register('costMax')}
                      />
                      <ErrorLabel
                        formName="costMax"
                        errors={formState.errors}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className={styles.form__row}>
              <div
                className={clsx(
                  styles.form__row__cell,
                  styles['form__row__cell--twoColumns']
                )}
              >
                <div className={styles.form__group}>
                  <label htmlFor="bidStartAt">Start Date</label>
                  <div className={styles.form__group__control}>
                    <input
                      id="bidStartAt"
                      type="date"
                      name="startAt"
                      className={styles.form__input}
                      defaultValue={startAt}
                      data-testid="bid-form-start-at"
                      {...register('startAt')}
                    />
                    <ErrorLabel formName="startAt" errors={formState.errors} />
                  </div>
                </div>
              </div>
              <div
                className={clsx(
                  styles.form__row__cell,
                  styles['form__row__cell--twoColumns']
                )}
              >
                <div className={styles.form__group}>
                  <label htmlFor="bidVendor">Complete Date</label>
                  <div className={styles.form__group__control}>
                    <input
                      id="bidCompleteAt"
                      type="date"
                      name="vendor"
                      className={styles.form__input}
                      defaultValue={completeAt}
                      data-testid="bid-form-complete-at"
                      {...register('completeAt')}
                    />
                    <ErrorLabel
                      formName="completeAt"
                      errors={formState.errors}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.form__group}>
              <label htmlFor="bidVendorDetails">Vendor Details</label>
              <div className={styles.form__group__control}>
                <textarea
                  id="bidVendorDetails"
                  className="form-control"
                  rows={7}
                  name="vendorDetails"
                  defaultValue={bid.vendorDetails}
                  data-testid="bid-form-vendor-details"
                  {...register('vendorDetails')}
                ></textarea>
                <ErrorLabel formName="need" errors={formState.errors} />
              </div>
            </div>
          </div>

          <div className={styles.form__fields__rightColumn}>
            <div className={styles.form__group}>
              <div className={styles.form__formSeparatedLabel}>
                <label htmlFor="bidVendorDetails">Attachments</label>
                <button
                  type="button"
                  className={styles.form__upload}
                  onClick={onUploadClick}
                >
                  <AddIcon /> Upload
                  <input
                    type="file"
                    ref={inputFile}
                    className={styles.form__formInput}
                  />
                </button>
              </div>
              {attachments.length === 0 ? (
                <h3>No Attachments</h3>
              ) : (
                <ul className={styles.form__attachmentList}>
                  {attachments.map((ba) => (
                    <li
                      className={styles.form__attachmentList__item}
                      key={ba.name}
                    >
                      {ba.name}
                      <ActionsIcon />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {!isBidComplete && (
          <div className={clsx(styles.button__group, '-mt-lg', '-mr-none')}>
            <button
              type="button"
              data-testid="bid-form-submit"
              className={clsx(
                styles.button__submit,
                isMobile && styles.button__fullwidth
              )}
              onClick={() => onSubmit('save')}
            >
              Save
            </button>
          </div>
        )}

        {isMobile && (
          <div className={clsx(styles.button__group, '-mt-lg', '-mr-none')}>
            <Link href={bidLink}>
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
  bid,
  isNewBid,
  isOnline,
  isStaging,
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
  const bidLink = `${basePath}/properties/${property.id}/jobs/${job.id}/bids`;

  const validationShape = {
    vendor: yup.string().required(formErrors.vendorRequired),
    need: yup.string(),
    scopeOfWork: yup.string()
  };

  // Setup form validations
  const validationSchema = yup.object().shape(validationShape);

  const isBidComplete = !isNewBid && bid.state === 'complete';

  // Setup form submissions
  const {
    register,
    trigger: triggerFormValidation,
    formState
  } = useForm<Inputs>({
    mode: 'all',
    resolver: yupResolver(validationSchema)
  });

  // Handle form submissions
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSubmit = async (action) => {
    // Check if form is valid
    await triggerFormValidation();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const hasErrors = Boolean(Object.keys(formState.errors).length);
    // eslint-disable-next-line no-useless-return
    return;
  };

  // Mobile Header actions buttons
  const mobileHeaderActions = (headStyle) => (
    <>
      <div
        className={clsx(
          headStyle.header__button,
          headStyle['header__button--dropdown'],
          styles.form__header__icon
        )}
      >
        <ActionsIcon />
        <DropdownHeader
          bidLink={bidLink}
          isBidComplete={isBidComplete}
          onFormAction={onSubmit}
        />
      </div>
    </>
  );

  return (
    <>
      {isMobileorTablet && (
        <>
          <MobileHeader
            title={isNewBid ? 'Create New Bid' : `${property.name} Job Bid`}
            toggleNavOpen={toggleNavOpen}
            isOnline={isOnline}
            isStaging={isStaging}
            actions={mobileHeaderActions}
            className={styles.form__header}
          />
          <Layout
            isMobile={isMobileorTablet}
            job={job}
            bid={bid || ({} as bidModel)}
            isNewBid={isNewBid}
            bidLink={bidLink}
            register={register}
            formState={formState}
            onSubmit={onSubmit}
            isBidComplete={isBidComplete}
          />
        </>
      )}

      {/* Desktop Header & Content */}
      {isDesktop && (
        <div data-testid="desktop-form">
          <Header
            property={property}
            job={job}
            isNewBid={isNewBid}
            bidLink={bidLink}
          />
          <Layout
            isMobile={isMobileorTablet}
            job={job}
            bid={bid || ({} as bidModel)}
            isNewBid={isNewBid}
            bidLink={bidLink}
            register={register}
            formState={formState}
            onSubmit={onSubmit}
            isBidComplete={isBidComplete}
          />
        </div>
      )}
    </>
  );
};

export default JobForm;
