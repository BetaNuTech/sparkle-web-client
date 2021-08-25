import { FunctionComponent, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useFirestore } from 'reactfire';
import useTeams from '../Properties/hooks/useTeams';
import useTemplates from '../../common/hooks/useTemplates';
import useTemplateCategories from '../../common/hooks/useTemplateCategories';
import useSearching from '../../common/hooks/useSearching';
import useCategorizedTemplates from '../CreateInspection/hooks/useCategorizedTemplates';
import userModel from '../../common/models/user';
import templateModel from '../../common/models/template';
import breakpoints from '../../config/breakpoints';
import PropertyMobileForm from './MobileForm/index';
import PropertyDesktopForm from './DesktopForm/index';
import MobileHeader from '../../common/MobileHeader/index';
import styles from './styles.module.scss';

interface Props {
  isOnline: boolean;
  toggleNavOpen(): void;
  isStaging: boolean;
  user: userModel;
  id: string;
  property?: any;
}

const PropertyEdit: FunctionComponent<Props> = ({
  toggleNavOpen,
  isOnline,
  isStaging,
  user,
  property
}) => {
  const firestore = useFirestore();
  // Fetch Teams
  const { data: teams } = useTeams(firestore, user);

  // Fetch Templates
  const { data: templates } = useTemplates(firestore);
  // Fetch all data in template categories
  const { data: templateCategories } = useTemplateCategories(firestore);

  // Open & Close Team Modal
  const [isUpdateTeamModalVisible, setUpdateTeamModalVisible] = useState(false);
  const openUpdateTeamModal = () => {
    setUpdateTeamModalVisible(true);
  };
  const closeUpdateTeamModal = () => {
    setUpdateTeamModalVisible(false);
  };
  // Open & Close Templates Modal
  const [isTemplatesEditModalVisible, setTemplatesEditModalVisible] =
    useState(false);
  const openTemplatesEditModal = () => {
    setTemplatesEditModalVisible(true);
  };
  const closeTemplatesEditModal = () => {
    setTemplatesEditModalVisible(false);
  };

  // Templates search setup
  const { onSearchKeyDown, filteredItems, searchParam } = useSearching(
    templates,
    ['name', 'description']
  );
  const filteredTemplates = filteredItems.map((itm) => itm as templateModel);

  const { categories: sortedCategories } = useCategorizedTemplates(
    templateCategories,
    filteredTemplates
  );
  //   Mobile header save button
  const mobileHeaderActions = () => (
    <button data-testid="mobile-header-button" className={styles.saveButton}>
      Save
    </button>
  );
  const isMobileorTablet = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });

  return (
    user &&
    (isMobileorTablet ? (
      <>
        <MobileHeader
          title="Property Edit"
          toggleNavOpen={toggleNavOpen}
          isOnline={isOnline}
          isStaging={isStaging}
          actions={mobileHeaderActions}
          testid="mobile-properties-header"
        />
        <PropertyMobileForm
          isOnline={isOnline}
          teams={teams}
          openUpdateTeamModal={openUpdateTeamModal}
          closeUpdateTeamModal={closeUpdateTeamModal}
          isUpdateTeamModalVisible={isUpdateTeamModalVisible}
          openTemplatesEditModal={openTemplatesEditModal}
          closeTemplatesEditModal={closeTemplatesEditModal}
          isTemplatesEditModalVisible={isTemplatesEditModalVisible}
          categories={sortedCategories}
          onSearchKeyDown={onSearchKeyDown}
          searchParam={searchParam}
          property={property}
        />
      </>
    ) : (
      <PropertyDesktopForm
        isOnline={isOnline}
        teams={teams}
        openUpdateTeamModal={openUpdateTeamModal}
        closeUpdateTeamModal={closeUpdateTeamModal}
        isUpdateTeamModalVisible={isUpdateTeamModalVisible}
        openTemplatesEditModal={openTemplatesEditModal}
        closeTemplatesEditModal={closeTemplatesEditModal}
        isTemplatesEditModalVisible={isTemplatesEditModalVisible}
        categories={sortedCategories}
        onSearchKeyDown={onSearchKeyDown}
        searchParam={searchParam}
        property={property}
      />
    ))
  );
};

export default PropertyEdit;
