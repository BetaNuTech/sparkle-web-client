import { FunctionComponent, useState, useRef, ChangeEvent } from 'react';
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
import moment from 'moment';
import { diff } from 'deep-object-diff';
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
import jobsConfig from '../../../config/jobs';
import formats from '../../../config/formats';
import { colors as jobColors } from '../../JobList';
import AddIcon from '../../../public/icons/ios/add.svg';
import ActionsIcon from '../../../public/icons/ios/actions.svg';
import { BidApiResult } from '../hooks/useBidForm';
import useProcessedForm from '../hooks/useProcessedForm';
import DropdownHeader from '../DropdownHeader';
import DropdownAttachment from '../DropdownAttachment';
import DeleteAttachmentPrompt from '../DeleteAttachmentPrompt';
import Header from '../Header';
import styles from '../styles.module.scss';
import formErrors from './errors';

interface Props {
  property: propertyModel;
  job: jobModel;
  bid: bidModel;
  otherBids: bidModel[];
  isNewBid: boolean;
  isOnline?: boolean;
  isStaging?: boolean;
  isNavOpen?: boolean;
  toggleNavOpen?(): void;
  apiState: BidApiResult;
  postBidCreate(propertyId: string, jobId: string, bid: bidModel): void;
  putBidUpdate(
    propertyId: string,
    jobId: string,
    bidId: string,
    bid: bidModel
  ): void;
  onFileChange(ev: ChangeEvent<HTMLInputElement>): void;
  uploadState: boolean;
  setDeleteAttachmentPromptVisible(newState: boolean): void;
  isDeleteAttachmentPromptVisible: boolean;
  confirmAttachmentDelete(bidAttachment: bidAttachmentModel): Promise<any>;
  queueAttachmentForDelete(attachment: bidAttachmentModel): any;
  queuedAttachmentForDeletion: bidAttachmentModel;
  deleteAtachmentLoading: boolean;
}

type Inputs = {
  vendor: string;
  costMin: number;
  costMax: number;
  startAt: string;
  completeAt: string;
  cost: string;
  scope: string;
  vendorDetails: string;
};

interface LayoutProps {
  propertyId: string;
  isMobile: boolean;
  job: jobModel;
  bid: bidModel;
  otherBids: bidModel[];
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
  canApprove: boolean;
  canApproveEnabled: boolean;
  canReject: boolean;
  canMarkIncomplete: boolean;
  canMarkComplete: boolean;
  canReopen: boolean;
  onFileChange(ev: ChangeEvent<HTMLInputElement>): void;
  isUploadingFile: boolean;
  setDeleteAttachmentPromptVisible(newState: boolean): void;
  queueAttachmentForDelete(attachment: bidAttachmentModel): any;
}

const Layout: FunctionComponent<LayoutProps> = ({
  propertyId,
  isMobile,
  job,
  bid,
  otherBids,
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
  isApprovedOrComplete,
  canApprove,
  canApproveEnabled,
  canReject,
  canMarkIncomplete,
  canMarkComplete,
  canReopen,
  onFileChange,
  isUploadingFile,
  queueAttachmentForDelete,
  setDeleteAttachmentPromptVisible
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

  const jobBidsLink = `/properties/${propertyId}/jobs/${job.id}/bids`;
  const jobEditLink = `/properties/${propertyId}/jobs/edit/${job.id}`;
  const openAttachmentDeletePrompt = (attachment: bidAttachmentModel) => {
    queueAttachmentForDelete(attachment);
    setDeleteAttachmentPromptVisible(true);
  };

  const otherBidsText =
    // eslint-disable-next-line no-nested-ternary
    otherBids.length === 0
      ? 'No other bids'
      : otherBids.length === 1
      ? '1 other bid'
      : `${otherBids.length} other bids`;

  return (
    <>
      {!isNewBid && isMobile && (
        <header className={styles.form__extHeader}>
          <h1
            data-testid="bid-form-title-mobile"
            className={styles.form__extHeader__title}
          >
            <Link href={jobBidsLink}>
              <a></a>
            </Link>
            {job.title}
          </h1>

          <aside className={styles.form__extHeader__aside}>
            <span
              className={clsx(
                styles.form__parentStatusLabel,
                jobColors[jobsConfig.stateColors[job.state]]
              )}
            >
              {utilString.titleize(job.state)}
            </span>
            <span className={styles.form__parentDetail}>{otherBidsText}</span>
            <Link href={jobEditLink}>
              <a className={styles.form__parentLink}>Edit Job</a>
            </Link>
          </aside>
        </header>
      )}
      <div className={styles.form__grid}>
        {!isNewBid && (
          <>
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
                      <ErrorLabel
                        formName="costMin"
                        errors={formState.errors}
                      />
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
              {/* Bid scope */}
              {!isNewBid && (
                <div className={styles.form__row}>
                  <div className={clsx(styles.form__row__cell)}>
                    <div className={styles.form__group}>
                      <label htmlFor="bidStartAt">
                        Scope <span>*</span>
                      </label>
                      <div
                        className={clsx(
                          styles.form__group__control,
                          styles['form__group__control--radio']
                        )}
                      >
                        <label>
                          <input
                            type="radio"
                            name="bidScope"
                            className={styles.form__input}
                            value="local"
                            {...register('scope')}
                            defaultChecked={
                              (bid.scope && bid.scope === 'local') || !bid.scope
                            }
                          />
                          Local
                        </label>
                        <label>
                          <input
                            type="radio"
                            name="bidScope"
                            className={styles.form__input}
                            value="national"
                            {...register('scope')}
                            defaultChecked={
                              bid.scope && bid.scope === 'national'
                            }
                          />
                          National
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

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
                      <ErrorLabel
                        formName="startAt"
                        errors={formState.errors}
                      />
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
              <div className={clsx(styles.form__group)}>
                <label>Job Info</label>
              </div>
              <div className={clsx(styles.form__card__pill, '-mt')}>
                <span
                  className={clsx(
                    styles.form__parentStatusLabel,
                    jobColors[jobsConfig.stateColors[job.state]]
                  )}
                >
                  {utilString.titleize(job.state)}
                </span>
                <span className={styles.form__parentDetail}>
                  {otherBidsText}
                </span>
                <Link href={jobEditLink}>
                  <a className={styles.form__parentLink}>Edit Job</a>
                </Link>
              </div>

              <div className={clsx(styles.form__group, '-mt-lg')}>
                <div className={styles.form__formSeparatedLabel}>
                  <label htmlFor="bidVendorDetails">Attachments</label>
                  <button
                    type="button"
                    className={styles.form__upload}
                    onClick={onUploadClick}
                    disabled={isUploadingFile}
                  >
                    Upload
                    <span className={styles.form__upload__icon}>
                      <AddIcon />
                    </span>
                    <input
                      type="file"
                      ref={inputFile}
                      className={styles.form__formInput}
                      onChange={onFileChange}
                      data-testid="input-file-attachment"
                    />
                  </button>
                </div>
                {attachments.length === 0 ? (
                  <ul className={styles.form__attachmentList}>
                    <li className={styles.form__attachmentList__item}>
                      No Attachments
                    </li>
                  </ul>
                ) : (
                  <ul className={styles.form__attachmentList}>
                    {attachments.map((ba) => (
                      <li
                        className={styles.form__attachmentList__item}
                        key={ba.name}
                      >
                        {ba.name}
                        <span className={styles['button--dropdown']}>
                          <ActionsIcon />
                          <DropdownAttachment
                            fileUrl={ba.url}
                            onDelete={() => openAttachmentDeletePrompt(ba)}
                          />
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {canApprove && (
            <div className={clsx(styles.button__group, '-mt-lg', '-mr-none')}>
              <button
                type="button"
                data-testid="bid-form-approve"
                disabled={apiState.isLoading || !isOnline || !canApproveEnabled}
                className={clsx(
                  styles.button__submit,
                  isMobile && styles.button__fullwidth
                )}
                onClick={() => onSubmit('approved')}
              >
                Approve Bid
              </button>
            </div>
          )}

          {canMarkComplete && (
            <div className={clsx(styles.button__group, '-mt-lg', '-mr-none')}>
              <button
                type="button"
                data-testid="bid-form-complete-bid"
                disabled={apiState.isLoading || !isOnline}
                className={clsx(
                  styles.button__cancel,
                  '-c-info',
                  isMobile && styles.button__fullwidth
                )}
                onClick={() => onSubmit('complete')}
              >
                Complete
              </button>
            </div>
          )}

          {canMarkIncomplete && (
            <div className={clsx(styles.button__group, '-mt-lg', '-mr-none')}>
              <button
                type="button"
                data-testid="bid-form-incomplete-bid"
                disabled={apiState.isLoading || !isOnline}
                className={clsx(
                  styles.button__cancel,
                  '-c-warning',
                  isMobile && styles.button__fullwidth
                )}
                onClick={() => onSubmit('incomplete')}
              >
                Incomplete
              </button>
            </div>
          )}

          {canReject && (
            <div className={clsx(styles.button__group, '-mt-lg', '-mr-none')}>
              <button
                type="button"
                data-testid="bid-form-reject-bid"
                disabled={apiState.isLoading || !isOnline}
                className={clsx(
                  styles.button__cancel,
                  '-c-alert',
                  isMobile && styles.button__fullwidth
                )}
                onClick={() => onSubmit('rejected')}
              >
                Reject Bid
              </button>
            </div>
          )}

          {canReopen && (
            <div className={clsx(styles.button__group, '-mt-lg', '-mr-none')}>
              <button
                type="button"
                data-testid="bid-form-reopen-bid"
                disabled={apiState.isLoading || !isOnline}
                className={clsx(
                  styles.button__cancel,
                  '-c-info',
                  isMobile && styles.button__fullwidth
                )}
                onClick={() => onSubmit('reopen')}
              >
                Reopen
              </button>
            </div>
          )}

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
    </>
  );
};

const BidForm: FunctionComponent<Props> = ({
  property,
  job,
  bid,
  otherBids,
  isNewBid,
  isOnline,
  isStaging,
  toggleNavOpen,
  apiState,
  postBidCreate,
  putBidUpdate,
  onFileChange,
  uploadState,
  setDeleteAttachmentPromptVisible,
  isDeleteAttachmentPromptVisible,
  queueAttachmentForDelete,
  confirmAttachmentDelete,
  queuedAttachmentForDeletion,
  deleteAtachmentLoading
}) => {
  const closeAttachmentDeletePrompt = () => {
    setDeleteAttachmentPromptVisible(false);
    queueAttachmentForDelete(null);
  };

  // Responsive queries
  const isMobileorTablet = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });
  const isDesktop = useMediaQuery({
    minWidth: breakpoints.desktop.minWidth
  });
  const bidLink = `/properties/${property.id}/jobs/${job.id}/bids`;
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
    // Should not check for less value if it doesn't have value
    if (value && bidCompleteAt && bidCompleteAt.value) {
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
    // Should not check for less value if it doesn't have value
    if (value && bidStartAt && bidStartAt.value) {
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

    switch (action) {
      case 'approved':
      case 'rejected':
      case 'incomplete':
      case 'complete':
        formBid.state = action;
        break;
      case 'reopen':
        formBid.state = 'open';
        break;
      default:
        break;
    }

    if (isNewBid) {
      // Create bid request
      postBidCreate(property.id, job.id, formBid);
    } else {
      // Update existing bid
      putBidUpdate(property.id, job.id, bid.id, formBid);
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
      .test('cost-max-min', formErrors.costMaxMinGreater, costMaxValidator)
      .when('costMaxRequired', {
        is: !isFixedCostType,
        then: yup.string().required(formErrors.costRequired)
      });
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

  const apiBid = (({
    vendor,
    costMin,
    costMax,
    startAt,
    scope,
    completeAt,
    vendorDetails
  }) => ({
    vendor,
    costMin,
    costMax,
    startAt,
    completeAt,
    scope,
    vendorDetails
  }))(bid);

  // Handle form submissions
  const onSubmit = async (action) => {
    // Check if form is valid
    await triggerFormValidation();
    const hasErrors = Boolean(Object.keys(formState.errors).length);
    if (hasErrors) return;

    // Make request to api call
    const formData = getFormValues();
    const formBidProcessed = useProcessedForm(
      formData,
      formData.cost === 'fixed'
    ) as bidModel;
    const difference = diff(apiBid, formBidProcessed);
    onPublish(difference, action);
  };

  const onCostTypeChange = (type: 'fixed' | 'range') => {
    setFixedCostType(type === 'fixed');
    setValue('cost', type);
  };

  // Setup watcher for form changes
  const formData = useWatch({
    control,
    defaultValue: {
      vendor: apiBid.vendor,
      vendorDetails: apiBid.vendorDetails,
      cost: bid.costMin === bid.costMax ? 'fixed' : 'range',
      costMin: apiBid.costMin,
      costMax: apiBid.costMax,
      scope: apiBid.scope,
      startAt: startAtProcessed,
      completeAt: completeAtProcessed
    }
  });

  const canApprove = !isNewBid && bid.state === 'open';
  const canApproveEnabled =
    canApprove && Object.keys(formState.errors).length === 0;
  const canReject = !isNewBid && bid.state === 'approved';
  const canMarkIncomplete = !isNewBid && bid.state === 'approved';
  // Should not be able to mark complete if the job is not in authroized state
  const canMarkComplete =
    !isNewBid && bid.state === 'approved' && job.state === 'authorized';
  const canReopen = !isNewBid && ['rejected', 'incomplete'].includes(bid.state);

  const formBid = (({
    vendor,
    costMin,
    costMax,
    scope,
    startAt,
    completeAt,
    vendorDetails
  }) => ({
    vendor,
    costMin,
    costMax,
    startAt,
    scope,
    completeAt,
    vendorDetails
  }))(formData);

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
      {uploadState && <LoadingHud title="Uploading..." />}
      {deleteAtachmentLoading && <LoadingHud title="Remove Attachment..." />}
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
            propertyId={property.id}
            isMobile={isMobileorTablet}
            job={job}
            bid={bid || ({} as bidModel)}
            otherBids={otherBids}
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
            canApprove={canApprove}
            canApproveEnabled={canApproveEnabled}
            canReject={canReject}
            canMarkIncomplete={canMarkIncomplete}
            canMarkComplete={canMarkComplete}
            canReopen={canReopen}
            onFileChange={onFileChange}
            isUploadingFile={uploadState}
            queueAttachmentForDelete={queueAttachmentForDelete}
            setDeleteAttachmentPromptVisible={setDeleteAttachmentPromptVisible}
          />
        </>
      )}

      {/* Desktop Header & Content */}
      {isDesktop && (
        <div data-testid="desktop-form">
          {apiState.isLoading && <LoadingHud title="Saving Bid..." />}
          {uploadState && <LoadingHud title="Uploading..." />}
          {deleteAtachmentLoading && (
            <LoadingHud title="Remove Attachment..." />
          )}
          <Header
            isOnline={isOnline}
            property={property}
            job={job}
            isNewBid={isNewBid}
            bidLink={bidLink}
            apiState={apiState}
            showSaveButton={showSaveButton}
            onSubmit={onSubmit}
            canApprove={canApprove}
            canApproveEnabled={canApproveEnabled}
            canReject={canReject}
            canMarkIncomplete={canMarkIncomplete}
            canMarkComplete={canMarkComplete}
            canReopen={canReopen}
          />
          <Layout
            propertyId={property.id}
            isMobile={isMobileorTablet}
            job={job}
            bid={bid || ({} as bidModel)}
            otherBids={otherBids}
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
            canApprove={canApprove}
            canApproveEnabled={canApproveEnabled}
            canReject={canReject}
            canMarkIncomplete={canMarkIncomplete}
            canMarkComplete={canMarkComplete}
            canReopen={canReopen}
            onFileChange={onFileChange}
            isUploadingFile={uploadState}
            queueAttachmentForDelete={queueAttachmentForDelete}
            setDeleteAttachmentPromptVisible={setDeleteAttachmentPromptVisible}
          />
        </div>
      )}

      <DeleteAttachmentPrompt
        fileName={
          queuedAttachmentForDeletion && queuedAttachmentForDeletion.name
        }
        onConfirm={() => confirmAttachmentDelete(queuedAttachmentForDeletion)}
        isVisible={isDeleteAttachmentPromptVisible}
        onClose={closeAttachmentDeletePrompt}
      />
    </>
  );
};

export default BidForm;
