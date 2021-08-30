import { FunctionComponent, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import useSearching from '../../common/hooks/useSearching';
import useCategorizedTemplates from '../CreateInspection/hooks/useCategorizedTemplates';
import userModel from '../../common/models/user';
import templateModel from '../../common/models/template';
import breakpoints from '../../config/breakpoints';
import PropertyMobileForm from './MobileForm/index';
import PropertyDesktopForm from './DesktopForm/index';
import MobileHeader from '../../common/MobileHeader/index';
import UpdateTeamModal from './UpdateTeamModal/index';
import TemplatesEditModal from './TemplatesEditModal/index';
import propertiesApi from '../../common/services/api/properties';
import styles from './styles.module.scss';

interface Props {
  isNavOpen?: boolean;
  isOnline?: boolean;
  toggleNavOpen?(): void;
  isStaging?: boolean;
  user: userModel;
  id: string;
  property: any;
  teams: Array<any>;
  templates: Array<any>;
  templateCategories: Array<any>;
}

const PropertyEdit: FunctionComponent<Props> = ({
  toggleNavOpen,
  isOnline,
  isStaging,
  user,
  property,
  teams,
  templates,
  templateCategories
}) => {
  // Form state
  const [formState, setFormState] = useState<any>({});

  // Open & Close Team Modal
  const [isUpdateTeamModalVisible, setUpdateTeamModalVisible] = useState(false);
  const openUpdateTeamModal = (e) => {
    e.preventDefault();
    setUpdateTeamModalVisible(true);
  };
  const closeUpdateTeamModal = () => {
    setUpdateTeamModalVisible(false);
  };
  // Open & Close Templates Modal
  const [isTemplatesEditModalVisible, setTemplatesEditModalVisible] =
    useState(false);
  const openTemplatesEditModal = (e) => {
    e.preventDefault();
    setTemplatesEditModalVisible(true);
  };
  const closeTemplatesEditModal = () => {
    setTemplatesEditModalVisible(false);
  };

  // Handle Team Selection
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const changeTeamSelection = (newId) => {
    setSelectedTeamId(newId);
    formState.team = newId;
    setFormState(formState);
  };
  // Handle Template Selection
  const [selectedTemplates, setSelectedTemplates] = useState<any>(
    Object.keys(property.templates || {})
  );
  const updateTempatesList = (selectedId: string) => {
    const isRemoving = selectedTemplates.includes(selectedId);
    if (isRemoving) {
      selectedTemplates.splice(selectedTemplates.indexOf(selectedId), 1);
    } else {
      selectedTemplates.push(selectedId);
    }
    setSelectedTemplates([...selectedTemplates]);
    formState.templates = selectedTemplates;
    setFormState(formState);
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

  // Form Images
  const [properyImg, setProperyImg] = useState<string>('');
  const [logoImg, setLogoImg] = useState<string>('');
  const removePropertyImage = () => {
    setProperyImg('');
  };
  const removeLogo = () => {
    setLogoImg('');
  };

  // Handle OnChange input event

  const handleChange = (e) => {
    const fieldName = e.target.name;
    const fleldVal = e.target.value;
    if (fieldName === 'propertyImage') {
      setProperyImg(URL.createObjectURL(e.target.files[0]));
    }
    if (fieldName === 'logo') {
      setLogoImg(URL.createObjectURL(e.target.files[0]));
    }
    setFormState({ ...formState, [fieldName]: fleldVal });
  };

  // Form submit handler
  // convert form state into
  // API friendly JSON and publish
  const onSubmit = (e) => {
    e.preventDefault();
    const payload: any = { ...formState };

    if (formState.templates) {
      payload.templates = formState.templates.reduce((acc, templateId) => {
        acc[templateId] = true;
        return acc;
      }, {});
    }
    propertiesApi.update(property.id, payload);
  };

  //   Mobile header save button
  const mobileHeaderActions = () => (
    <button
      data-testid="save-button-mobile"
      className={styles.saveButton}
      onClick={(e) => onSubmit(e)}
    >
      Save
    </button>
  );
  const isMobileorTablet = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });

  return (
    user && (
      <>
        {isMobileorTablet ? (
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
              openTemplatesEditModal={openTemplatesEditModal}
              property={property}
              selectedTeamId={selectedTeamId}
              handleChange={handleChange}
              properyImg={properyImg}
              logoImg={logoImg}
            />
          </>
        ) : (
          <PropertyDesktopForm
            isOnline={isOnline}
            teams={teams}
            openUpdateTeamModal={openUpdateTeamModal}
            openTemplatesEditModal={openTemplatesEditModal}
            property={property}
            selectedTeamId={selectedTeamId}
            onSubmit={(e) => onSubmit(e)}
            handleChange={handleChange}
            properyImg={properyImg}
            logoImg={logoImg}
            removePropertyImage={removePropertyImage}
            removeLogo={removeLogo}
          />
        )}
        <UpdateTeamModal
          isVisible={isUpdateTeamModalVisible}
          onClose={closeUpdateTeamModal}
          teams={teams}
          changeTeamSelection={changeTeamSelection}
          selectedTeamId={selectedTeamId}
        />
        <TemplatesEditModal
          isVisible={isTemplatesEditModalVisible}
          onClose={closeTemplatesEditModal}
          categories={sortedCategories}
          selectedTemplates={selectedTemplates}
          updateTempatesList={updateTempatesList}
          onSearchKeyDown={onSearchKeyDown}
          searchParam={searchParam}
        />
      </>
    )
  );
};

export default PropertyEdit;
