import { FunctionComponent } from 'react';
import DeficientItemModel from '../../../common/models/deficientItem';
import UserModel from '../../../common/models/user';

import MobileHeader from '../../../common/MobileHeader';
import DesktopHeader from '../../../common/DesktopHeader';
import PropertyModel from '../../../common/models/property';
import Actions from '../../../common/DeficientItemEditForm/Actions';
import Breadcrumbs from './Breadcrumbs';

import styles from './styles.module.scss';

interface Props {
  property: PropertyModel;
  isOnline: boolean;
  isStaging: boolean;
  isDesktop: boolean;
  isMobile: boolean;
  itemTitle: string;
  deficientItem: DeficientItemModel;
  user: UserModel;
  updates: DeficientItemModel;
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
  hasUnpublishedPhotos: boolean;
  onAddCompletionPhotos(): void;
  toggleNavOpen?(): void;
}

const Header: FunctionComponent<Props> = ({
  property,
  isOnline,
  isStaging,
  isMobile,
  itemTitle,
  deficientItem,
  user,
  updates,
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
  onShowCompletedPhotos,
  hasUnpublishedPhotos,
  onAddCompletionPhotos,
  toggleNavOpen
}) => (
  <>
    {isMobile ? (
      <>
        <MobileHeader
          isOnline={isOnline}
          isStaging={isStaging}
          toggleNavOpen={toggleNavOpen}
          title="Deficient Item"
        />
        <div className={styles.header}>
          <Breadcrumbs property={property} itemTitle={itemTitle} />
        </div>
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
            updates={updates}
            isOnline={isOnline}
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
            hasUnpublishedPhotos={hasUnpublishedPhotos}
            onAddCompletionPhotos={onAddCompletionPhotos}
          />
        }
      />
    )}
  </>
);

Header.defaultProps = {};

export default Header;
