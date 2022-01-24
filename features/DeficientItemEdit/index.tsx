import { ChangeEvent, FunctionComponent, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import breakpoints from '../../config/breakpoints';
import propertyModel from '../../common/models/property';
import deficientItemModel from '../../common/models/deficientItem';
import userModel from '../../common/models/user';
import InspectionItemPhotosModal from '../../common/InspectionItemPhotosModal';
import DeficientItemEditForm from '../../common/DeficientItemEditForm';
import Header from './Header';

interface Props {
  user: userModel;
  property: propertyModel;
  deficientItem: deficientItemModel;
  isOnline?: boolean;
  isStaging?: boolean;
}

const DeficientItemEdit: FunctionComponent<Props> = ({
  property,
  deficientItem,
  isOnline,
  isStaging
}) => {
  const [isVisiblePhotosModal, setIsVisiblePhotosModal] = useState(false);

  // Responsive queries
  const isMobile = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });

  const isDesktop = useMediaQuery({
    minWidth: breakpoints.desktop.minWidth
  });

  const isUpdatingCurrentCompleteNowReason = false;

  const isUpdatingDeferredDate = false;

  const onShowPlanToFix = () => {
    console.log('triggered on show plan to fix action'); // eslint-disable-line
  };

  const onChangePlanToFix = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    // eslint-disable-next-line
    console.log(
      `triggered plan to fix textarea change event with value => ${evt.target.value}`
    );
  };
  const onShowHistory = () => {
    console.log('show history action'); // eslint-disable-line
  };

  const onClickViewPhotos = () => {
    setIsVisiblePhotosModal(true);
  };

  const onShowResponsibilityGroups = () => {
    console.log('triggered on show responsibility groups action'); // eslint-disable-line
  };

  const onChangeResponsibilityGroup = (evt: ChangeEvent<HTMLSelectElement>) => {
    // eslint-disable-next-line
    console.log(
      `triggered responsibility group change event with value => ${evt.target.value}`
    );
  };

  return (
    <>
      <Header
        property={property}
        isOnline={isOnline}
        isStaging={isStaging}
        isMobile={isMobile}
        isDesktop={isDesktop}
        itemTitle={deficientItem.itemTitle}
      />

      <DeficientItemEditForm
        onShowHistory={onShowHistory}
        isMobile={isMobile}
        isUpdatingCurrentCompleteNowReason={isUpdatingCurrentCompleteNowReason}
        isUpdatingDeferredDate={isUpdatingDeferredDate}
        onClickViewPhotos={onClickViewPhotos}
        deficientItem={deficientItem}
        onShowPlanToFix={onShowPlanToFix}
        onChangePlanToFix={onChangePlanToFix}
        onShowResponsibilityGroups={onShowResponsibilityGroups}
        onChangeResponsibilityGroup={onChangeResponsibilityGroup}
      />

      <InspectionItemPhotosModal
        photosData={deficientItem.itemPhotosData}
        subTitle={deficientItem.itemTitle}
        title="Item Photos"
        isVisible={isVisiblePhotosModal}
        onClose={() => setIsVisiblePhotosModal(false)}
        disabled={true} // eslint-disable-line
      />
    </>
  );
};

export default DeficientItemEdit;
