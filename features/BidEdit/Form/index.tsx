import { FunctionComponent, useState, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';
import {
  useForm,
  UseFormRegister,
  FormState,
  useWatch,
  UseFormSetValue
} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import clsx from 'clsx';
import Link from 'next/link';
import getConfig from 'next/config';
import moment from 'moment';
import LoadingHud from '../../../common/LoadingHud';
import propertyModel from '../../../common/models/property';
import jobModel from '../../../common/models/job';
import bidModel from '../../../common/models/bid';
import bidAttachmentModel from '../../../common/models/bidAttachment';
import utilString from '../../../common/utils/string';
import ErrorLabel from '../../../common/ErrorLabel';
import ErrorList from '../../../common/ErrorList';
import MobileHeader from '../../../common/MobileHeader';
import breakpoints from '../../../config/breakpoints';
import bidsConfig from '../../../config/bids';
import formats from '../../../config/formats';
import AddIcon from '../../../public/icons/ios/add.svg';
import ActionsIcon from '../../../public/icons/ios/actions.svg';
import { BidApiResult } from '../hooks/useBidForm';
import useProcessedForm from '../hooks/useProcessedForm';
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
  apiState: BidApiResult;
  postBidCreate(propertyId: string, jobId: string, bid: bidModel): void;
  putBidUpdate(propertyId: string, jobId: string, bid: bidModel): void;
}

type Inputs = {
  vendor: string;
  costMin: number;
  costMax: number;
  startAt: string;
  completeAt: string;
  cost: string;
  vendorDetails: string;
};

interface LayoutProps {
  isMobile: boolean;
  job: jobModel;
  bid: bidModel;
  bidLink: string;
  isNewBid: boolean;
  isBidComplete: boolean;
  isOnline: boolean;
  apiState: BidApiResult;
  onSubmit: (action: string) => void;
  register: UseFormRegister<Inputs>;
  formState: FormState<Inputs>;
  setValue: UseFormSetValue<Inputs>;
  onCostTypeChange: (type: 'fixed' | 'range') => void;
  isFixedCostType: boolean;
  showSaveButton: boolean;
  startAtProcessed: number;
  completeAtProcessed: number;
  attachments: Array<bidAttachmentModel>;
  isApprovedOrComplete: boolean;
}

const Layout: FunctionComponent<LayoutProps> = ({
  isMobile,
  job,
  bid,
  bidLink,
  isNewBid,
  onSubmit,
  register,
  apiState,
  isBidComplete,
  isOnline,
  formState,
  onCostTypeChange,
  isFixedCostType,
  showSaveButton,
  startAtProcessed,
  completeAtProcessed,
  attachments,
  isApprovedOrComplete
}) => {
  const apiErrors =
    apiState.statusCode === 400 && apiState.response.errors
      ? apiState.response.errors.map((e) => e.detail)
      : [];
  const bidState = !isNewBid && bid.state ? bid.state : 'open';
  const nextState = !isNewBid && bidsConfig.nextState[bidState];

  const inputFile = useRef(null);

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
                  {utilString.titleize(bidState)}
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

      <div className={styles.form__fields}>
        <ErrorList errors={apiErrors} />
      </div>
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
                  disabled={apiState.isLoading || isBidComplete}
                />
                <ErrorLabel formName="vendor" errors={formState.errors} />
              </div>
            </div>
            <div className={styles.form__formCost}>
              <label>Cost {isApprovedOrComplete && <span>*</span>}</label>
              <div className={styles.form__formCost__select}>
                <button
                  type="button"
                  className={clsx(isFixedCostType && styles.active)}
                  onClick={() => onCostTypeChange('fixed')}
                >
                  Fixed Cost
                </button>
                <span className={styles.form__formCost__separator}></span>
                <button
                  type="button"
                  id="btnRange"
                  className={clsx(!isFixedCostType && styles.active)}
                  onClick={() => onCostTypeChange('range')}
                >
                  Range
                </button>
              </div>
              <input
                type="hidden"
                defaultValue={isFixedCostType ? 'fixed' : 'range'}
                {...register('cost')}
              />
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
                      id="costMin"
                      name="costMin"
                      className={styles.form__input}
                      placeholder={isFixedCostType ? '' : 'Minimum'}
                      defaultValue={bid.costMin}
                      data-testid="bid-form-cost-min"
                      {...register('costMin')}
                      disabled={apiState.isLoading || isBidComplete}
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
                        id="costMax"
                        name="costMax"
                        className={styles.form__input}
                        placeholder="Maximum"
                        defaultValue={bid.costMax}
                        data-testid="bid-form-cost-max"
                        {...register('costMax')}
                        disabled={apiState.isLoading || isBidComplete}
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
                  <label htmlFor="bidStartAt">
                    Start Date {isApprovedOrComplete && <span>*</span>}
                  </label>
                  <div className={styles.form__group__control}>
                    <input
                      id="bidStartAt"
                      type="date"
                      name="startAt"
                      className={styles.form__input}
                      defaultValue={startAtProcessed}
                      data-testid="bid-form-start-at"
                      {...register('startAt')}
                      disabled={apiState.isLoading || isBidComplete}
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
                  <label htmlFor="bidVendor">
                    Complete Date {isApprovedOrComplete && <span>*</span>}
                  </label>
                  <div className={styles.form__group__control}>
                    <input
                      id="bidCompleteAt"
                      type="date"
                      name="vendor"
                      className={styles.form__input}
                      defaultValue={completeAtProcessed}
                      data-testid="bid-form-complete-at"
                      {...register('completeAt')}
                      disabled={apiState.isLoading || isBidComplete}
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
                  disabled={apiState.isLoading || isBidComplete}
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

        {showSaveButton && (
          <div className={clsx(styles.button__group, '-mt-lg', '-mr-none')}>
            <button
              type="button"
              data-testid="bid-form-submit"
              disabled={apiState.isLoading || !isOnline}
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

const BidForm: FunctionComponent<Props> = ({
  property,
  job,
  bid,
  isNewBid,
  isOnline,
  isStaging,
  toggleNavOpen,
  apiState,
  postBidCreate,
  putBidUpdate
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
  const [isFixedCostType, setFixedCostType] = useState(
    isNewBid ? true : bid.costMin === bid.costMax
  );
  let startAtProcessed = null;
  let completeAtProcessed = null;
  let attachments: bidAttachmentModel[] = [];
  if (!isNewBid) {
    startAtProcessed =
      bid.startAt &&
      moment.unix(bid.startAt).format(formats.browserDateDisplay);
    completeAtProcessed =
      bid.completeAt &&
      moment.unix(bid.completeAt).format(formats.browserDateDisplay);
    attachments = bid.attachments ? bid.attachments : [];
  }

  // Cost min validator to check it should be less than max cost
  const costMinValidator = (value) => {
    let isValid = true;
    const costMax: HTMLInputElement = document.getElementById(
      'costMax'
    ) as HTMLInputElement;
    if (value && costMax) {
      isValid = Number(costMax.value) >= Number(value);
    }
    return isValid;
  };
  // Cost max validator to check it should be more than min cost
  const costMaxValidator = (value) => {
    let isValid = true;
    const costMin: HTMLInputElement = document.getElementById(
      'costMin'
    ) as HTMLInputElement;
    if (value && costMin) {
      isValid = Number(costMin.value) <= Number(value);
    }
    return isValid;
  };

  // Start at validator to check it should be less than completion date
  const startDateValidator = (value) => {
    let isValid = true;
    const bidCompleteAt: HTMLInputElement = document.getElementById(
      'bidCompleteAt'
    ) as HTMLInputElement;
    if (value && bidCompleteAt) {
      isValid = moment(bidCompleteAt.value).unix() >= moment(value).unix();
    }
    return isValid;
  };

  // Complete at validator to check it should be more than start date
  const completeDateValidator = (value) => {
    let isValid = true;
    const bidStartAt: HTMLInputElement = document.getElementById(
      'bidStartAt'
    ) as HTMLInputElement;
    if (value && bidStartAt) {
      isValid = moment(bidStartAt.value).unix() <= moment(value).unix();
    }
    return isValid;
  };

  const validationShape = {
    vendor: yup.string().required(formErrors.vendorRequired),
    costMin: yup
      .string()
      .test('cost-min-max', formErrors.costMinMaxGreater, costMinValidator),
    costMax: yup
      .string()
      .test('cost-max-min', formErrors.costMaxMinGreater, costMaxValidator),
    startAt: yup
      .string()
      .test('start-date', formErrors.startAtLess, startDateValidator),
    completeAt: yup
      .string()
      .test('complete-date', formErrors.completeAtLess, completeDateValidator),
    vendorDetails: yup.string()
  };

  const isApprovedOrComplete =
    !isNewBid && ['approved', 'complete'].includes(bid.state);

  // Publish bid updates to API
  const onPublish = (data, action) => {
    const formBid = {
      ...data
    } as bidModel;

    const formBidProcessed = useProcessedForm(
      formBid,
      data.cost === 'fixed'
    ) as bidModel;

    // Check if we have bid data
    // Means it is an edit form
    if (Object.keys(bid).length > 0) {
      formBidProcessed.id = bid.id;
      // Update request
      putBidUpdate(property.id, job.id, formBidProcessed);
    } else {
      // Save request
      postBidCreate(property.id, job.id, formBidProcessed);
    }
  };

  if (isApprovedOrComplete) {
    // Add need validation if bid is in approved or complete state
    validationShape.startAt = yup
      .string()
      .required(formErrors.startAtRequired)
      .test('start-date', formErrors.startAtLess, startDateValidator);

    // Add need validation if bid is in approved or complete state
    validationShape.completeAt = yup
      .string()
      .required(formErrors.completeAtRequired)
      .test('complete-date', formErrors.completeAtLess, completeDateValidator);

    validationShape.costMin = yup
      .string()
      .required(formErrors.costRequired)
      .test('cost-min-max', formErrors.costMinMaxGreater, costMinValidator);
    validationShape.costMax = yup
      .string()
      .required(formErrors.costRequired)
      .test('cost-max-min', formErrors.costMaxMinGreater, costMaxValidator);
  }

  // Setup form validations
  const validationSchema = yup.object().shape(validationShape);

  const isBidComplete = !isNewBid && bid.state === 'complete';

  // Setup form submissions
  const {
    register,
    control,
    getValues: getFormValues,
    trigger: triggerFormValidation,
    formState,
    setValue
  } = useForm<Inputs>({
    mode: 'all',
    resolver: yupResolver(validationSchema)
  });

  // Handle form submissions
  const onSubmit = async (action) => {
    // Check if form is valid
    await triggerFormValidation();
    const hasErrors = Boolean(Object.keys(formState.errors).length);
    if (hasErrors) return;

    // Make request to api call
    const formData = getFormValues();
    onPublish(formData, action);
  };

  const onCostTypeChange = (type: 'fixed' | 'range') => {
    setFixedCostType(type === 'fixed');
    setValue('cost', type);
  };

  const apiBid = (({
    vendor,
    costMin,
    costMax,
    startAt,
    completeAt,
    vendorDetails
  }) => ({ vendor, costMin, costMax, startAt, completeAt, vendorDetails }))(
    bid
  );

  // Setup watcher for form changes
  const formData = useWatch({
    control,
    defaultValue: {
      vendor: apiBid.vendor,
      vendorDetails: apiBid.vendorDetails,
      cost: bid.costMin === bid.costMax ? 'fixed' : 'range',
      costMin: apiBid.costMin,
      costMax: apiBid.costMax,
      startAt: startAtProcessed,
      completeAt: completeAtProcessed
    }
  });

  const formBid = (({
    vendor,
    costMin,
    costMax,
    startAt,
    completeAt,
    vendorDetails
  }) => ({ vendor, costMin, costMax, startAt, completeAt, vendorDetails }))(
    formData
  );

  // process form data for number and unix timestamp
  const formBidProcessed = useProcessedForm(formBid, isFixedCostType);

  let showSaveButton = isNewBid;
  // Check if we have any new updates
  if (!isNewBid && !isBidComplete) {
    // Compare form data with api data
    showSaveButton =
      JSON.stringify(formBidProcessed) !== JSON.stringify(apiBid);
  }

  // Mobile Header actions buttons
  const mobileHeaderActions = (headStyle) => (
    <>
      {apiState.isLoading && <LoadingHud title="Saving Bid..." />}
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
          showSaveButton={showSaveButton}
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
            apiState={apiState}
            isOnline={isOnline}
            onSubmit={onSubmit}
            setValue={setValue}
            isBidComplete={isBidComplete}
            onCostTypeChange={onCostTypeChange}
            isFixedCostType={isFixedCostType}
            showSaveButton={showSaveButton}
            startAtProcessed={startAtProcessed}
            completeAtProcessed={completeAtProcessed}
            attachments={attachments}
            isApprovedOrComplete={isApprovedOrComplete}
          />
        </>
      )}

      {/* Desktop Header & Content */}
      {isDesktop && (
        <div data-testid="desktop-form">
          {apiState.isLoading && <LoadingHud title="Saving Bid..." />}
          <Header
            isOnline={isOnline}
            property={property}
            job={job}
            isNewBid={isNewBid}
            bidLink={bidLink}
            apiState={apiState}
            showSaveButton={showSaveButton}
            onSubmit={onSubmit}
          />
          <Layout
            isMobile={isMobileorTablet}
            job={job}
            bid={bid || ({} as bidModel)}
            isNewBid={isNewBid}
            bidLink={bidLink}
            register={register}
            formState={formState}
            apiState={apiState}
            isOnline={isOnline}
            onSubmit={onSubmit}
            setValue={setValue}
            isBidComplete={isBidComplete}
            onCostTypeChange={onCostTypeChange}
            isFixedCostType={isFixedCostType}
            showSaveButton={showSaveButton}
            startAtProcessed={startAtProcessed}
            completeAtProcessed={completeAtProcessed}
            attachments={attachments}
            isApprovedOrComplete={isApprovedOrComplete}
          />
        </div>
      )}
    </>
  );
};

export default BidForm;
