import { FunctionComponent } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import MobileHeader from '../../../../common/MobileHeader';
import DesktopHeader from '../../../../common/DesktopHeader';
import ChevronIcon from '../../../../public/icons/ios/chevron.svg';
import PaperclipIcon from '../../../../public/icons/sparkle/paperclip.svg';
import propertyModel from '../../../../common/models/property';
import parentStyles from '../../Header/styles.module.scss';
import styles from '../styles.module.scss';

interface Props {
  property: propertyModel;
  workOrderId: string;
  isOnline: boolean;
  isStaging: boolean;
  isMobile: boolean;
  isCreating: boolean;
  isEditing: boolean;
  isLoading: boolean;
  canEdit: boolean;
  canCancel: boolean;
  hasAttachments?: boolean;
  onEdit(): void;
  onDiscard(): void;
  onSave(): void;
  onCancelWorkOrder(): void;
}

const Header: FunctionComponent<Props> = ({
  property,
  workOrderId,
  isOnline,
  isStaging,
  isMobile,
  isCreating,
  isEditing,
  isLoading,
  canEdit,
  canCancel,
  hasAttachments,
  onEdit,
  onDiscard,
  onSave,
  onCancelWorkOrder
}) => {
  const listLink = `/properties/${property.id}/yardi-work-orders`;
  const titleText = isCreating ? 'New Work Order' : `Work Order ${workOrderId}`;
  const title = (
    <>
      {titleText}
      {hasAttachments && (
        <span
          className={styles.attachments__indicator}
          title="Has attachments"
          data-testid="work-order-header-attachments"
        >
          <PaperclipIcon />
        </span>
      )}
    </>
  );
  let saveLabel = isCreating ? 'Create' : 'Save';
  if (isLoading) saveLabel = 'Saving…';

  const Actions = () => (
    <>
      {isEditing ? (
        <>
          {isCreating ? (
            <Link href={listLink}>
              <a
                className={styles['action--secondary']}
                data-testid="work-order-cancel-create"
              >
                Cancel
              </a>
            </Link>
          ) : (
            <button
              type="button"
              className={styles['action--secondary']}
              disabled={isLoading}
              onClick={onDiscard}
              data-testid="work-order-discard"
            >
              Discard
            </button>
          )}
          <button
            type="button"
            className={styles.action}
            disabled={isLoading || !isOnline}
            onClick={onSave}
            data-testid="work-order-save"
          >
            {saveLabel}
          </button>
        </>
      ) : (
        <>
          {canCancel && (
            <button
              type="button"
              className={styles['action--danger']}
              disabled={isLoading || !isOnline}
              onClick={onCancelWorkOrder}
              data-testid="work-order-cancel"
            >
              Cancel Work Order
            </button>
          )}
          {canEdit && (
            <button
              type="button"
              className={styles.action}
              disabled={isLoading || !isOnline}
              onClick={onEdit}
              data-testid="work-order-edit"
            >
              Edit
            </button>
          )}
        </>
      )}
    </>
  );

  if (isMobile) {
    return (
      <MobileHeader
        isOnline={isOnline}
        isStaging={isStaging}
        title={title}
        left={(headStyle) => (
          <Link href={listLink}>
            <a className={headStyle.header__back} data-testid="work-order-back">
              <ChevronIcon />
              WOs
            </a>
          </Link>
        )}
        actions={(headStyle) =>
          isEditing ? (
            <button
              className={headStyle.header__button}
              disabled={isLoading || !isOnline}
              onClick={onSave}
              data-testid="work-order-save"
            >
              {saveLabel}
            </button>
          ) : (
            canEdit && (
              <button
                className={headStyle.header__button}
                disabled={isLoading || !isOnline}
                onClick={onEdit}
                data-testid="work-order-edit"
              >
                Edit
              </button>
            )
          )
        }
      />
    );
  }

  return (
    <DesktopHeader
      headerTestId="work-order-header"
      isColumnTitle
      isOnline={isOnline}
      title={
        <>
          <div className={parentStyles.header__breadcrumbs}>
            <Link href={`/properties/${property.id}`}>
              <a className={parentStyles.header__link}>{property.name}</a>
            </Link>
            <span>&nbsp;&nbsp;/&nbsp;&nbsp;</span>
            <Link href={listLink}>
              <a className={parentStyles.header__link}>Work Orders</a>
            </Link>
          </div>
          <div className={clsx(parentStyles.header__title)}>{title}</div>
        </>
      }
      right={<Actions />}
    />
  );
};

Header.defaultProps = {
  hasAttachments: false
};

export default Header;
