import { FunctionComponent, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import breakpoints from '../../config/breakpoints';
import propertyModel from '../../common/models/property';
import deficientItemModel from '../../common/models/deficientItem';
import userModel from '../../common/models/user';
import Header from './Header';
import InspectionItemPhotosModal from '../../common/InspectionItemPhotosModal';
import DeficientItemEditForm from '../../common/DeficientItemEditForm';

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

  const onShowHistory = () => {
    console.log('show history action'); // eslint-disable-line
  };

  const onClickViewPhotos = () => {
    setIsVisiblePhotosModal(true);
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
        onClickViewPhotos={onClickViewPhotos}
        deficientItem={deficientItem}
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
