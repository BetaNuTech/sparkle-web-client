import { FunctionComponent, ChangeEvent } from 'react';
import { useMediaQuery } from 'react-responsive';
import clsx from 'clsx';
import { diff } from 'deep-object-diff';
import LoadingHud from '../../../common/LoadingHud';
import propertyModel from '../../../common/models/property';
import jobModel from '../../../common/models/job';
import bidModel from '../../../common/models/bid';
import attachmentModel from '../../../common/models/attachment';
import ErrorList from '../../../common/ErrorList';
import MobileHeader from '../../../common/MobileHeader';
import breakpoints from '../../../config/breakpoints';
import bidsConfig from '../../../config/bids';
import ActionsIcon from '../../../public/icons/ios/actions.svg';
import DropdownHeader from '../DropdownHeader';
import Header from '../Header';
import styles from '../styles.module.scss';
import formErrors from './errors';
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
import useValidateForm from '../hooks/useValidateForm';

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
  isLoading: boolean;
  onPublish(
    data: bidModel,
    propertyId: string,
    jobId: string,
    bidId: string,
    action: string,
    isNewBid: boolean
  ): void;
  onFileChange(ev: ChangeEvent<HTMLInputElement>): void;
  uploadState: boolean;
  openAttachmentDeletePrompt(attachment: attachmentModel): any;
  deleteAtachmentLoading: boolean;
  formFieldsError: Record<string, any>;
  generalFormErrors: Array<string>;
  canMarkComplete: boolean;
  canReopen: boolean;
  canReject: boolean;
  canMarkIncomplete: boolean;
  approvedCompletedBid: bidModel;
  isApprovedOrComplete: boolean;
  isBidComplete: boolean;
  canApprove: boolean;
}

const BidForm: FunctionComponent<Props> = ({
  property,
  job,
  bid,
  otherBids,
  isNewBid,
  isOnline,
  isStaging,
  toggleNavOpen,
  formFieldsError,
  generalFormErrors,
  isLoading,
  onPublish,
  onFileChange,
  uploadState,
  deleteAtachmentLoading,
  canMarkComplete,
  canReopen,
  canReject,
  canMarkIncomplete,
  approvedCompletedBid,
  isApprovedOrComplete,
  isBidComplete,
  canApprove,
  openAttachmentDeletePrompt
}) => {
  // Responsive queries
  const isMobileorTablet = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });
  const isDesktop = useMediaQuery({
    minWidth: breakpoints.desktop.minWidth
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

  const {
    register,
    triggerFormValidation,
    formState,
    formData,
    costMaxValidateOptions,
    costMinValidateOptions,
    normalizeFormData,
    startAtProcessed,
    completeAtProcessed,
    startAtValidateOptions,
    completeAtValidateOptions,
    isFixedCostType,
    setCostType
  } = useValidateForm(apiBid, bid, isNewBid);

  // Handle form submissions
  const onSubmit = async (action) => {
    // Check if form is valid
    await triggerFormValidation();
    const hasErrors = Boolean(Object.keys(formState.errors).length);
    if (hasErrors) return;

    // Make request to api call
    const normalizedBidData = normalizeFormData(formData) as bidModel;
    const difference = diff(apiBid, normalizedBidData) as bidModel;
    onPublish(difference, property.id, job.id, bid.id, action, isNewBid);
  };

  const canApproveEnabled =
    canApprove &&
    Object.keys(formState.errors).length === 0 &&
    formData.vendorInsurance &&
    formData.vendorW9;

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
  const normalizedBidData = normalizeFormData(formBid);
  let showSaveButton = isNewBid;
  // Check if we have any new updates
  if (!isNewBid && !isBidComplete) {
    // Compare form data with api data
    showSaveButton =
      JSON.stringify(normalizedBidData) !== JSON.stringify(apiBid);
  }

  const bidState = !isNewBid && bid.state ? bid.state : 'open';
  const nextState =
    !isNewBid && bidState === 'approved' && job.state !== 'authorized'
      ? bidsConfig.nextState.authorizedJob
      : bidsConfig.nextState[bidState];

  const otherBidsText =
    // eslint-disable-next-line no-nested-ternary
    otherBids.length === 0
      ? 'No other bids'
      : otherBids.length === 1
      ? '1 other bid'
      : `${otherBids.length} other bids`;

  if (isApprovedOrComplete) {
    costMinValidateOptions.required = formErrors.costRequired;
    costMaxValidateOptions.required =
      !isFixedCostType && formErrors.costRequired;
  }

  const bidLink = `/properties/${property.id}/jobs/${job.id}/bids`;
  const jobEditLink = `/properties/${property.id}/jobs/edit/${job.id}`;
  const jobLink = `/properties/${property.id}/jobs/`;
  const propertyLink = `/properties/${property.id}/`;
  const approvedBidLink =
    approvedCompletedBid &&
    `/properties/${property.id}/jobs/${job.id}/bids/${approvedCompletedBid.id}/`;

  // Mobile Header actions buttons
  const mobileHeaderActions = (headStyle) => (
    <>
      {isLoading && <LoadingHud title="Saving Bid..." />}
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
          {isLoading && <LoadingHud title="Saving Bid..." />}
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
            isLoading={isLoading}
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
            <ErrorList errors={generalFormErrors} />
          </div>
          <form>
            <div className={styles.form__fields}>
              <div className={styles.form__fields__leftColumn}>
                <VendorInput
                  defaultValue={bid.vendor}
                  isBidComplete={isBidComplete}
                  isLoading={isLoading}
                  formState={formState}
                  apiErrorVendor={formFieldsError.vendor}
                  {...register('vendor', {
                    required: formErrors.vendorRequired
                  })}
                />
                <CostInput
                  costMin={bid.costMin}
                  costMax={bid.costMax}
                  isBidComplete={isBidComplete}
                  isLoading={isLoading}
                  formState={formState}
                  isFixedCostType={isFixedCostType}
                  isApprovedOrComplete={isApprovedOrComplete}
                  onCostTypeChange={setCostType}
                  costMinValidateOptions={costMinValidateOptions}
                  costMaxValidateOptions={costMaxValidateOptions}
                  apiErrorCostMin={formFieldsError.costMin}
                  apiErrorCostMax={formFieldsError.costMax}
                  register={register}
                />

                <BidScope scope={bid.scope} {...register('scope')} />

                <div className={styles.form__row}>
                  <StartDateInput
                    defaultValue={startAtProcessed}
                    isApprovedOrComplete={isApprovedOrComplete}
                    isBidComplete={isBidComplete}
                    isLoading={isLoading}
                    formState={formState}
                    apiErrorStartAt={formFieldsError.startAt}
                    {...register('startAt', startAtValidateOptions)}
                  />
                  <CompleteDateInput
                    defaultValue={completeAtProcessed}
                    isApprovedOrComplete={isApprovedOrComplete}
                    isBidComplete={isBidComplete}
                    isLoading={isLoading}
                    formState={formState}
                    apiErrorCompleteAt={formFieldsError.completeAt}
                    {...register('completeAt', completeAtValidateOptions)}
                  />
                </div>
                <VendorDetailsInput
                  defaultValue={bid.vendorDetails}
                  isBidComplete={isBidComplete}
                  isLoading={isLoading}
                  formState={formState}
                  {...register('vendorDetails')}
                />
                <W9Checkbox
                  formState={formState}
                  defaultChecked={bid.vendorW9}
                  apiErrorVendorW9={formFieldsError.vendorW9}
                  {...register('vendorW9')}
                />
                <InsuranceCheckbox
                  formState={formState}
                  defaultChecked={bid.vendorInsurance}
                  apiErrorVendorInsurance={formFieldsError.vendorInsurance}
                  {...register('vendorInsurance')}
                />
                <LicenseCheckbox
                  formState={formState}
                  defaultChecked={bid.vendorLicense}
                  apiErrorVendorLicense={formFieldsError.vendorLicense}
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
                  isUploadingFile={uploadState}
                  onFileChange={onFileChange}
                  attachments={bid.attachments || []}
                  openAttachmentDeletePrompt={openAttachmentDeletePrompt}
                  isNewBid={isNewBid}
                />
              </div>
            </div>
            <ActionButtons
              isNewBid={isNewBid}
              approvedCompletedBid={approvedCompletedBid}
              isApprovedOrComplete={isApprovedOrComplete}
              canApprove={canApprove}
              isLoading={isLoading}
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
    </>
  );
};

export default BidForm;
