import { FunctionComponent, useState, ChangeEvent } from 'react';
import { useMediaQuery } from 'react-responsive';
import Router from 'next/router';
import { useFirestore } from 'reactfire';
import useSearching from '../../common/hooks/useSearching';

import usePropertyForm from './hooks/usePropertyForm';
import useNotifications from '../../common/hooks/useNotifications'; // eslint-disable-line
import notifications from '../../common/services/notifications'; // eslint-disable-line
import userModel from '../../common/models/user';
import templateModel from '../../common/models/template';
import templateCategoryModel from '../../common/models/templateCategory';
import breakpoints from '../../config/breakpoints';
import PropertyMobileForm from './MobileForm';
import PropertyDesktopForm from './DesktopForm';
import MobileHeader from '../../common/MobileHeader';
import UpdateTeamModal from './UpdateTeamModal';
import TemplatesEditModal from './TemplatesEditModal';
import LoadingHud from '../../common/LoadingHud';
import styles from './styles.module.scss';
import propertyModel from '../../common/models/property';
import teamModel from '../../common/models/team';
import DeletePropertyPrompt from '../../common/prompts/DeletePropertyPrompt';
import useDeleteProperty from '../../common/hooks/useDeleteProperty';
import useCategorizedTemplates from '../../common/hooks/useCategorizedTemplates';

interface Props {
  isNavOpen?: boolean;
  isOnline?: boolean;
  toggleNavOpen?(): void;
  isStaging?: boolean;
  user: userModel;
  property: propertyModel;
  teams: teamModel[];
  templates: templateModel[];
  templateCategories: templateCategoryModel[];
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
  const firestore = useFirestore();

  // Form state
  const [formState, setFormState] = useState<any>({
    ...property
  });

  /* eslint-disable */
  const sendNotification = notifications.createPublisher(useNotifications());
  /* eslint-enable */

  // Redirect to Trello page
  const openTrello = (e) => {
    e.preventDefault();
    Router.push(`/properties/edit/${property.id}/trello`);
  };

  // Form submission hook
  const {
    isLoading,
    onSubmit,
    errors: requestErrors,
    formErrors
  } = usePropertyForm(sendNotification);
  const userRequestErrors = requestErrors.map((e) => e.detail);

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
  const [selectedTeamId, setSelectedTeamId] = useState<string>(formState.team);
  const changeTeamSelection = (newId) => {
    setSelectedTeamId(newId);
    formState.team = newId;
    setFormState(formState);
  };
  // Handle Template Selection
  const [selectedTemplates, setSelectedTemplates] = useState<any>(
    Object.keys(property.templates || {})
  );
  const [areTemplatesUpdated, setAreTemplatesUpdated] =
    useState<boolean>(false);
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
    setAreTemplatesUpdated(true);
  };

  // Filter templates which dose not contain items
  const templatesWithItems = templates.filter(
    (template) => Object.keys(template.items || {}).length > 0
  );

  // Templates search setup
  const {
    onSearchKeyDown,
    filteredItems,
    searchParam,
    onClearSearch,
    searchValue
  } = useSearching(templatesWithItems, ['name', 'description']);
  const filteredTemplates = filteredItems.map((itm) => itm as templateModel);

  const { categories: sortedCategories } = useCategorizedTemplates(
    templateCategories,
    filteredTemplates
  );

  // Selected templates names
  const templateNames = selectedTemplates
    .map((id) => filteredTemplates.find((tmpl) => tmpl.id === id))
    .filter(Boolean)
    .map((tmpl) => tmpl.name);

  // Form Images
  const [properyImg, setProperyImg] = useState(formState.photoURL);
  const [logoImg, setLogoImg] = useState(formState.logoURL);
  const removePropertyImage = () => {
    setProperyImg(null);
  };
  const removeLogo = () => {
    setLogoImg(null);
  };

  // Handle onChange input event
  const [logoFile, setLogoFile] = useState(null);
  const [profileFile, setProfileFile] = useState(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fieldName = e.target.name;
    const fleldVal = e.target.value;
    if (fieldName === 'photoURL') {
      setProperyImg(URL.createObjectURL(e.target.files[0]));
      setProfileFile(e.target.files[0]);
    }
    if (fieldName === 'logoURL') {
      setLogoImg(URL.createObjectURL(e.target.files[0]));
      setLogoFile(e.target.files[0]);
    }
    setFormState({ ...formState, [fieldName]: fleldVal });
  };

  // Form submit handler
  const submitHandler = (evt) => {
    evt.preventDefault();

    onSubmit(
      formState,
      areTemplatesUpdated,
      selectedTemplates,
      logoImg,
      logoFile,
      properyImg,
      profileFile,
      property
    );
  };

  // Queue and Delete Property
  const { queuePropertyForDelete, confirmPropertyDelete } = useDeleteProperty(
    firestore,
    sendNotification,
    user
  );

  // Confirm property delete and redirect
  // on success to the properties list
  const confirmPropertyDeleteAndRedirect = () =>
    confirmPropertyDelete().then(() => Router.push('/properties'));
  const [isDeletingProperty, setIsDeletingProperty] = useState(false);

  const toggleDeletingProperty = () => {
    setIsDeletingProperty(!isDeletingProperty);
  };

  const [isDeletePropertyPromptVisible, setDeletePropertyPromptVisible] =
    useState(false);
  const openPropertyDeletePrompt = (
    e,
    propertyForDeleletion: propertyModel
  ) => {
    e.preventDefault();
    queuePropertyForDelete(propertyForDeleletion);
    setDeletePropertyPromptVisible(true);
  };
  const closeDeletePropertyPrompt = () => {
    toggleDeletingProperty();
    setDeletePropertyPromptVisible(false);
    queuePropertyForDelete(null);
    toggleDeletingProperty();
  };

  //   Mobile header save button
  const mobileHeaderActions = () => (
    <button
      data-testid="save-button-mobile"
      className={styles.saveButton}
      onClick={(e) => submitHandler(e)}
      disabled={isLoading}
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
        {isLoading && <LoadingHud title="Saving..." />}
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
              formState={formState}
              formErrors={formErrors}
              openTrello={openTrello}
              userRequestErrors={userRequestErrors}
              onQueuePropertyDelete={openPropertyDeletePrompt}
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
            onSubmit={(e) => submitHandler(e)}
            handleChange={handleChange}
            properyImg={properyImg}
            logoImg={logoImg}
            removePropertyImage={removePropertyImage}
            removeLogo={removeLogo}
            formState={formState}
            templateNames={templateNames}
            isLoading={isLoading}
            formErrors={formErrors}
            openTrello={openTrello}
            userRequestErrors={userRequestErrors}
            onQueuePropertyDelete={openPropertyDeletePrompt}
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
          onClearSearch={onClearSearch}
          searchQuery={searchValue}
        />
        <DeletePropertyPrompt
          isVisible={isDeletePropertyPromptVisible}
          onClose={closeDeletePropertyPrompt}
          onConfirm={confirmPropertyDeleteAndRedirect}
        />
      </>
    )
  );
};

export default PropertyEdit;
