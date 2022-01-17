import { FunctionComponent, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import breakpoints from '../../config/breakpoints';
import propertyModel from '../../common/models/property';
import deficientItemModel from '../../common/models/deficientItem';
import userModel from '../../common/models/user';
import Header from './Header';
import DeficientItemControlsDetails from '../../common/DeficientItemControls/Details';
import DeficientItemControlsNotes from '../../common/DeficientItemControls/Notes';
import styles from './styles.module.scss';
import InspectionItemPhotosModal from '../../common/InspectionItemPhotosModal';
import useDeficientItemSectionVisibility from './hooks/useDeficientItemSectionVisibility';

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

  const { showNotes } = useDeficientItemSectionVisibility(deficientItem);

  // Responsive queries
  const isMobile = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });

  const isDesktop = useMediaQuery({
    minWidth: breakpoints.desktop.minWidth
  });

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
      <div className={styles.grid}>
        <div className={styles.grid__container}>
          <aside className={styles.grid__sidebar}>
            <DeficientItemControlsDetails
              deficientItem={deficientItem}
              isMobile={isMobile}
              onClickViewPhotos={() => setIsVisiblePhotosModal(true)}
            />
          </aside>
          <div className={styles.grid__main}>
            <DeficientItemControlsNotes
              deficientItem={deficientItem}
              isVisible={showNotes}
            />
          </div>
        </div>
      </div>
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
