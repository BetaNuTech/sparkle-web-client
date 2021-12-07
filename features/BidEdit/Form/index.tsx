import { FunctionComponent, useState, useRef, ChangeEvent } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useForm, useWatch } from 'react-hook-form';
import clsx from 'clsx';
import moment from 'moment';
import { diff } from 'deep-object-diff';
import LoadingHud from '../../../common/LoadingHud';
import propertyModel from '../../../common/models/property';
import jobModel from '../../../common/models/job';
import bidModel from '../../../common/models/bid';
import attachmentModel from '../../../common/models/attachment';
import userModel from '../../../common/models/user';
import ErrorList from '../../../common/ErrorList';
import MobileHeader from '../../../common/MobileHeader';
import breakpoints from '../../../config/breakpoints';
import bidsConfig from '../../../config/bids';
import formats from '../../../config/formats';
import ActionsIcon from '../../../public/icons/ios/actions.svg';
import { BidApiResult } from '../hooks/useBidForm';
import useProcessedForm from '../hooks/useProcessedForm';
import DropdownHeader from '../DropdownHeader';
import DeleteAttachmentPrompt from '../DeleteAttachmentPrompt';
import Header from '../Header';
import styles from '../styles.module.scss';
import formErrors from './errors';
import { canApproveBid } from '../../../common/utils/userPermissions';
import useBidApprovedCompleted from '../../../common/hooks/useBidApprovedCompleted';
import FormInputs from './FormInputs';
import VendorInput from './Fields/VendorInput';
import CostInput from './Fields/CostInput';
import BidScope from './Fields/BidScope';
import StartDateInput from './Fields/StartDateInput';
import CompleteDateInput from './Fields/CompleteDateInput';
import VendorDetailsInput from './Fields/VendorDetailsInput';
import W9Checkbox from './Fields/W9Checkbox';
import InsuranceCheckbox from './Fields/InsuranceCheckbox';
import LicenseCheckbox from './Fields/LicenseCheckbox';
import JobInfo from './Fields/JobInfo';
import TrelloCard from './Fields/TrelloCard';
import Attachments from './Fields/Attachments';
import ActionButtons from './ActionButtons';
import FormHeader from './FormHeader';
import BidStatus from './BidStatus';

interface Props {
  user: userModel;
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
  confirmAttachmentDelete(attachment: attachmentModel): Promise<any>;
  queueAttachmentForDelete(attachment: attachmentModel): any;
  queuedAttachmentForDeletion: attachmentModel;
  deleteAtachmentLoading: boolean;
}

// Cost min validator to check it should be less than max cost
const costMinValidator = (value) => {
  let isValid = true;
  const costMax: HTMLInputElement = document.getElementById(
    'costMax'
  ) as HTMLInputElement;
  if (value && costMax && costMax.value) {
    isValid = Number(costMax.value) >= Number(value);
  }
  return isValid || formErrors.costMinMaxGreater;
};

// Cost max validator to check it should be more than min cost
const costMaxValidator = (value) => {
  let isValid = true;
  const costMin: HTMLInputElement = document.getElementById(
    'costMin'
  ) as HTMLInputElement;
  if (value && costMin && costMin.value) {
    isValid = Number(costMin.value) <= Number(value);
  }
  return isValid || formErrors.costMaxMinGreater;
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
  return isValid || formErrors.startAtLess;
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
  return isValid || formErrors.completeAtLess;
};

const BidForm: FunctionComponent<Props> = ({
  user,
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
  let attachments: attachmentModel[] = [];
  if (!isNewBid) {
    startAtProcessed =
      bid.startAt &&
      moment.unix(bid.startAt).format(formats.browserDateDisplay);
    completeAtProcessed =
      bid.completeAt &&
      moment.unix(bid.completeAt).format(formats.browserDateDisplay);
    attachments = bid.attachments ? bid.attachments : [];
  }

  const isApprovedOrComplete =
    !isNewBid && ['approved', 'complete'].includes(bid.state);

  // Publish bid updates to API
  // TODO: refactor to promises
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

  const isBidComplete = !isNewBid && bid.state === 'complete';

  // Setup form submissions
  const {
    register,
    control,
    getValues: getFormValues,
    trigger: triggerFormValidation,
    formState,
    setValue
  } = useForm<FormInputs>({
    mode: 'all'
  });

  const apiBid = (({
    vendor,
    costMin,
    costMax,
    startAt,
    scope,
    completeAt,
    vendorDetails,
    vendorW9,
    vendorInsurance,
    vendorLicense
  }) => ({
    vendor,
    costMin,
    costMax,
    startAt,
    completeAt,
    scope,
    vendorDetails,
    vendorW9,
    vendorInsurance,
    vendorLicense
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
    const difference = diff(apiBid, formBidProcessed) as bidModel;
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

  const canApprove = canApproveBid(isNewBid, user, property.id, job, bid);

  const { approvedCompletedBid } = useBidApprovedCompleted(otherBids);
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
    vendorDetails,
    vendorW9,
    vendorInsurance,
    vendorLicense
  }) => ({
    vendor,
    costMin,
    costMax,
    startAt,
    scope,
    completeAt,
    vendorDetails,
    vendorW9,
    vendorInsurance,
    vendorLicense
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
  const formInputs = [
    'vendor',
    'costMin',
    'costMax',
    'startAt',
    'completeAt',
    'vendorW9',
    'vendorInsurance',
    'vendorLicense'
  ];
  // Error object which can be there after submitting form
  const apiFormErrors = {
    vendor: '',
    costMin: '',
    costMax: '',
    startAt: '',
    completeAt: '',
    vendorW9: '',
    vendorInsurance: '',
    vendorLicense: ''
  };
  const filteredApiErrors = [];

  // Check if we have error then find all defined keys in @formInput variable
  // Otherwise push in @filteredApiErrors to show them in list of errors
  if ([400, 409].includes(apiState.statusCode) && apiState.response.errors) {
    apiState.response.errors.forEach((errData) => {
      if (errData.source && formInputs.includes(errData.source.pointer)) {
        apiFormErrors[errData.source.pointer] = errData.detail;
      } else {
        filteredApiErrors.push(errData);
      }
    });
  }

  // Extract the message
  const apiErrors =
    filteredApiErrors.length > 0 ? filteredApiErrors.map((e) => e.detail) : [];

  const bidState = !isNewBid && bid.state ? bid.state : 'open';
  const nextState =
    !isNewBid && bidState === 'approved' && job.state !== 'authorized'
      ? bidsConfig.nextState.authorizedJob
      : bidsConfig.nextState[bidState];

  const inputFile = useRef(null);

  const onUploadClick = () => {
    if (inputFile && inputFile.current) {
      inputFile.current.click();
    }
  };

  const jobEditLink = `/properties/${property.id}/jobs/edit/${job.id}`;
  const jobLink = `/properties/${property.id}/jobs/`;
  const propertyLink = `/properties/${property.id}/`;
  const openAttachmentDeletePrompt = (attachment: attachmentModel) => {
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

  // Cost min validations
  const costMinValidateOptions: any = {
    validate: costMinValidator
  };
  // Cost max validations
  const costMaxValidateOptions: any = {
    validate: (value) => {
      const validateResult = costMaxValidator(value);
      if (validateResult && typeof validateResult === 'boolean') {
        triggerFormValidation('costMin');
      }
      return validateResult;
    }
  };
  // Start at validations
  const startAtValidateOptions: any = { validate: startDateValidator };
  // Complete at validations
  const completeAtValidateOptions: any = { validate: completeDateValidator };
  if (isApprovedOrComplete) {
    costMinValidateOptions.required = formErrors.costRequired;
    costMaxValidateOptions.required =
      !isFixedCostType && formErrors.costRequired;
    startAtValidateOptions.required = formErrors.startAtRequired;
    completeAtValidateOptions.required = formErrors.completeAtRequired;
  }

  const approvedBidLink =
    approvedCompletedBid &&
    `/properties/${property.id}/jobs/${job.id}/bids/${approvedCompletedBid.id}/`;

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
        <MobileHeader
          title={isNewBid ? 'Create New Bid' : `${property.name} Job Bid`}
          toggleNavOpen={toggleNavOpen}
          isOnline={isOnline}
          isStaging={isStaging}
          actions={mobileHeaderActions}
          className={styles.form__header}
        />
      )}

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
            approvedCompletedBid={approvedCompletedBid}
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
        </div>
      )}

      <>
        <FormHeader
          isNewBid={isNewBid}
          isMobile={isMobileorTablet}
          propertyLink={propertyLink}
          property={property}
          jobLink={jobLink}
          bidLink={bidLink}
          job={job}
          otherBidsText={otherBidsText}
          jobEditLink={jobEditLink}
        />
        <div className={styles.form__grid}>
          <BidStatus
            isNewBid={isNewBid}
            isMobile={isMobileorTablet}
            bidState={bidState}
            nextState={nextState}
          />

          <div className={styles.form__fields}>
            <ErrorList errors={apiErrors} />
          </div>
          <form>
            <div className={styles.form__fields}>
              <div className={styles.form__fields__leftColumn}>
                <VendorInput
                  defaultValue={bid.vendor}
                  isBidComplete={isBidComplete}
                  isLoading={apiState.isLoading}
                  formState={formState}
                  apiErrorVendor={apiFormErrors.vendor}
                  {...register('vendor', {
                    required: formErrors.vendorRequired
                  })}
                />
                <CostInput
                  costMin={bid.costMin}
                  costMax={bid.costMax}
                  isBidComplete={isBidComplete}
                  isLoading={apiState.isLoading}
                  formState={formState}
                  isFixedCostType={isFixedCostType}
                  isApprovedOrComplete={isApprovedOrComplete}
                  onCostTypeChange={onCostTypeChange}
                  costMinValidateOptions={costMinValidateOptions}
                  costMaxValidateOptions={costMaxValidateOptions}
                  apiErrorCostMin={apiFormErrors.costMin}
                  apiErrorCostMax={apiFormErrors.costMax}
                  register={register}
                />

                <BidScope scope={bid.scope} {...register('scope')} />

                <div className={styles.form__row}>
                  <StartDateInput
                    defaultValue={startAtProcessed}
                    isApprovedOrComplete={isApprovedOrComplete}
                    isBidComplete={isBidComplete}
                    isLoading={apiState.isLoading}
                    formState={formState}
                    apiErrorStartAt={apiFormErrors.startAt}
                    {...register('startAt', startAtValidateOptions)}
                  />
                  <CompleteDateInput
                    defaultValue={completeAtProcessed}
                    isApprovedOrComplete={isApprovedOrComplete}
                    isBidComplete={isBidComplete}
                    isLoading={apiState.isLoading}
                    formState={formState}
                    apiErrorCompleteAt={apiFormErrors.completeAt}
                    {...register('completeAt', completeAtValidateOptions)}
                  />
                </div>
                <VendorDetailsInput
                  defaultValue={bid.vendorDetails}
                  isBidComplete={isBidComplete}
                  isLoading={apiState.isLoading}
                  formState={formState}
                  {...register('vendorDetails')}
                />
                <W9Checkbox
                  formState={formState}
                  defaultChecked={bid.vendorW9}
                  apiErrorVendorW9={apiFormErrors.vendorW9}
                  {...register('vendorW9')}
                />
                <InsuranceCheckbox
                  formState={formState}
                  defaultChecked={bid.vendorInsurance}
                  apiErrorVendorInsurance={apiFormErrors.vendorInsurance}
                  {...register('vendorInsurance')}
                />
                <LicenseCheckbox
                  formState={formState}
                  defaultChecked={bid.vendorLicense}
                  apiErrorVendorLicense={apiFormErrors.vendorLicense}
                  {...register('vendorLicense')}
                />
              </div>

              <div className={styles.form__fields__rightColumn}>
                <JobInfo
                  jobState={job.state}
                  otherBidsText={otherBidsText}
                  jobEditLink={jobEditLink}
                />
                <TrelloCard trelloCardURL={job.trelloCardURL} />

                <Attachments
                  onUploadClick={onUploadClick}
                  isUploadingFile={uploadState}
                  onFileChange={onFileChange}
                  attachments={attachments}
                  openAttachmentDeletePrompt={openAttachmentDeletePrompt}
                  ref={inputFile}
                  isNewBid={isNewBid}
                />
              </div>
            </div>
            <ActionButtons
              isNewBid={isNewBid}
              approvedCompletedBid={approvedCompletedBid}
              isApprovedOrComplete={isApprovedOrComplete}
              canApprove={canApprove}
              isLoading={apiState.isLoading}
              isOnline={isOnline}
              canApproveEnabled={canApproveEnabled}
              isMobile={isMobileorTablet}
              onSubmit={onSubmit}
              approvedBidLink={approvedBidLink}
              canMarkComplete={canMarkComplete}
              canMarkIncomplete={canMarkIncomplete}
              canReject={canReject}
              canReopen={canReopen}
              showSaveButton={showSaveButton}
              bidLink={bidLink}
            />
          </form>
        </div>
      </>

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
