import { FunctionComponent } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import bidModel from '../../../../common/models/bid';
import styles from '../../styles.module.scss';

interface Props {
  isNewBid: boolean;
  approvedCompletedBid: bidModel;
  isApprovedOrComplete: boolean;
  canApprove: boolean;
  isLoading: boolean;
  isOnline: boolean;
  canApproveEnabled: boolean;
  isMobile: boolean;
  onSubmit: (action: string) => void;
  approvedBidLink: string;
  canMarkComplete: boolean;
  canMarkIncomplete: boolean;
  canReject: boolean;
  canReopen: boolean;
  showSaveButton: boolean;
  bidLink: string;
}

const ActionButtons: FunctionComponent<Props> = ({
  isNewBid,
  approvedCompletedBid,
  isApprovedOrComplete,
  canApprove,
  isLoading,
  isOnline,
  canApproveEnabled,
  isMobile,
  onSubmit,
  approvedBidLink,
  canMarkComplete,
  canMarkIncomplete,
  canReject,
  canReopen,
  showSaveButton,
  bidLink
}: Props) => (
  <>
    {!isNewBid && (
      <div className={clsx(styles.button__group, '-mt-lg', '-mr-none')}>
        {!approvedCompletedBid && !isApprovedOrComplete && (
          <button
            type="button"
            data-testid="bid-form-approve"
            disabled={
              !canApprove || isLoading || !isOnline || !canApproveEnabled
            }
            className={clsx(
              styles.button__submit,
              isMobile && styles.button__fullwidth
            )}
            onClick={() => onSubmit('approved')}
          >
            Approve Bid
          </button>
        )}

        {!canApprove && !approvedCompletedBid && !isApprovedOrComplete && (
          <p className={clsx('-c-gray-light', '-mb-none')}>
            <span data-testid="bid-approve-permisson">
              You do not have permission to approve this bid.
            </span>
          </p>
        )}

        {approvedCompletedBid && (
          <p className={clsx('-c-gray-light', '-mb-none')}>
            <span data-testid="bid-approved-msg">
              {' '}
              Job already has an{' '}
              <a
                href={approvedBidLink}
                target="_blank"
                className="-td-underline"
                rel="noreferrer"
              >
                {approvedCompletedBid.state} bid
              </a>
            </span>
          </p>
        )}
      </div>
    )}

    {canMarkComplete && (
      <div className={clsx(styles.button__group, '-mt-lg', '-mr-none')}>
        <button
          type="button"
          data-testid="bid-form-complete-bid"
          disabled={isLoading || !isOnline}
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
          disabled={isLoading || !isOnline}
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
          disabled={isLoading || !isOnline}
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
          disabled={isLoading || !isOnline}
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
          disabled={isLoading || !isOnline}
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
  </>
);

ActionButtons.displayName = 'ActionButtons';

export default ActionButtons;
