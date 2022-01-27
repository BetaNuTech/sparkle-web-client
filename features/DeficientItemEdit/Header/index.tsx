import { FunctionComponent } from 'react';
import Link from 'next/link';
import ChevronIcon from '../../../public/icons/ios/chevron.svg';
import DeficientItemModel from '../../../common/models/deficientItem';
import UserModel from '../../../common/models/user';

import MobileHeader from '../../../common/MobileHeader';
import DesktopHeader from '../../../common/DesktopHeader';
import PropertyModel from '../../../common/models/property';
import Actions from '../../../common/DeficientItemEditForm/fields/Actions';
import Breadcrumbs from './Breadcrumbs';

interface Props {
  property: PropertyModel;
  isOnline: boolean;
  isStaging: boolean;
  isDesktop: boolean;
  isMobile: boolean;
  itemTitle: string;
  deficientItem: DeficientItemModel;
  user: UserModel;
  deficientItemUpdates: DeficientItemModel;
  isSaving: boolean;
  isUpdatingCurrentCompleteNowReason: boolean;
  isUpdatingDeferredDate: boolean;
  onUpdatePending(): void;
  onUnpermittedPending(): void;
  onAddProgressNote(): void;
  onUpdateIncomplete(): void;
  onComplete(): void;
  onGoBack(): void;
  onCloseDuplicate(): void;
  onUnpermittedDuplicate(): void;
  onClose(): void;
  onCancelCompleteNow(): void;
  onConfirmCompleteNow(): void;
  onCompleteNow(): void;
  onCancelDefer(): void;
  onConfirmDefer(): void;
  onInitiateDefer(): void;
  onUnpermittedDefer(): void;
  onShowCompletedPhotos(): void;
}

const Header: FunctionComponent<Props> = ({
  property,
  isOnline,
  isStaging,
  isMobile,
  itemTitle,
  deficientItem,
  user,
  deficientItemUpdates,
  isSaving,
  isUpdatingCurrentCompleteNowReason,
  isUpdatingDeferredDate,
  onUpdatePending,
  onUnpermittedPending,
  onAddProgressNote,
  onUpdateIncomplete,
  onComplete,
  onGoBack,
  onCloseDuplicate,
  onUnpermittedDuplicate,
  onClose,
  onCancelCompleteNow,
  onConfirmCompleteNow,
  onCompleteNow,
  onCancelDefer,
  onConfirmDefer,
  onInitiateDefer,
  onUnpermittedDefer,
  onShowCompletedPhotos
}) => {
  // Mobile Header actions buttons
  const mobileHeaderLeft = (headStyle) => (
    <>
      <Link href={`/properties/${property.id}/deficient-items`}>
        <a className={headStyle.header__back}>
          <ChevronIcon />
          All
        </a>
      </Link>
    </>
  );

  return (
    <>
      {isMobile ? (
        <>
          <MobileHeader
            isOnline={isOnline}
            isStaging={isStaging}
            left={mobileHeaderLeft}
            title="Deficient Item"
          />
          <Breadcrumbs property={property} itemTitle={itemTitle} />
        </>
      ) : (
        <DesktopHeader
          isOnline={isOnline}
          isColumnTitle
          title={<Breadcrumbs property={property} itemTitle={itemTitle} />}
          right={
            <Actions
              user={user}
              deficientItem={deficientItem}
              deficientItemUpdates={deficientItemUpdates}
              isSaving={isSaving}
              isUpdatingCurrentCompleteNowReason={
                isUpdatingCurrentCompleteNowReason
              }
              isUpdatingDeferredDate={isUpdatingDeferredDate}
              onUpdatePending={onUpdatePending}
              onUnpermittedPending={onUnpermittedPending}
              onAddProgressNote={onAddProgressNote}
              onUpdateIncomplete={onUpdateIncomplete}
              onComplete={onComplete}
              onGoBack={onGoBack}
              onCloseDuplicate={onCloseDuplicate}
              onUnpermittedDuplicate={onUnpermittedDuplicate}
              onClose={onClose}
              onCancelCompleteNow={onCancelCompleteNow}
              onConfirmCompleteNow={onConfirmCompleteNow}
              onCompleteNow={onCompleteNow}
              onCancelDefer={onCancelDefer}
              onConfirmDefer={onConfirmDefer}
              onInitiateDefer={onInitiateDefer}
              onUnpermittedDefer={onUnpermittedDefer}
              onShowCompletedPhotos={onShowCompletedPhotos}
              inline={true} // eslint-disable-line react/jsx-boolean-value
              showHeader={false}
            />
          }
        />
      )}
    </>
  );
};

Header.defaultProps = {};

export default Header;
