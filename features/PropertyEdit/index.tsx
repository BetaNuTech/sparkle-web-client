import { FunctionComponent, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import Router from 'next/router';
import useSearching from '../../common/hooks/useSearching';
import useCategorizedTemplates from '../CreateInspection/hooks/useCategorizedTemplates';
import usePropertyForm from './hooks/usePropertyForm';
import useNotifications from '../../common/hooks/useNotifications'; // eslint-disable-line
import notifications from '../../common/services/notifications'; // eslint-disable-line
import userModel from '../../common/models/user';
import templateModel from '../../common/models/template';
import breakpoints from '../../config/breakpoints';
import PropertyMobileForm from './MobileForm';
import PropertyDesktopForm from './DesktopForm';
import MobileHeader from '../../common/MobileHeader';
import UpdateTeamModal from './UpdateTeamModal';
import TemplatesEditModal from './TemplatesEditModal';
import LoadingHud from '../../common/LoadingHud';
import styles from './styles.module.scss';
import errors from './errors';
import errorReports from '../../common/services/api/errorReports';

interface Props {
  isNavOpen?: boolean;
  isOnline?: boolean;
  toggleNavOpen?(): void;
  isStaging?: boolean;
  user: userModel;
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
  const { apiState, createProperty, updateProperty } = usePropertyForm();

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

  // Selected templates names
  const templateNames = selectedTemplates
    .map((id) => filteredTemplates.find((tmpl) => tmpl.id === id))
    .map((tmpl) => tmpl.name);

  // Form Images
  const [properyImg, setProperyImg] = useState<string>(formState.photoURL);
  const [logoImg, setLogoImg] = useState<string>(formState.logoURL);
  const removePropertyImage = () => {
    setProperyImg('');
  };
  const removeLogo = () => {
    setLogoImg('');
  };

  // Handle onChange input event

  const handleChange = (e) => {
    const fieldName = e.target.name;
    const fleldVal = e.target.value;
    if (fieldName === 'photoURL') {
      setProperyImg(URL.createObjectURL(e.target.files[0]));
    }
    if (fieldName === 'logoURL') {
      setLogoImg(URL.createObjectURL(e.target.files[0]));
    }
    setFormState({ ...formState, [fieldName]: fleldVal });
  };

  // Form Validation
  const [formErrors, setFormErrors] = useState<any>({});
  let error;
  const formValidation = () => {
    error = {};
    if (!property.id && !formState.name) {
      error.nameRequired = { message: errors.nameRequired };
    }
    setFormErrors({ ...error });
  };

  // Form submit handler
  // convert form state into
  // API friendly JSON and publish
  const onSubmit = async (e) => {
    e.preventDefault();
    formValidation();

    const hasErrors = Boolean(Object.keys(error).length);
    if (hasErrors) return;

    let payload: any = {};

    // Check state for updates and add to payload
    Object.keys(formState).forEach((item) => {
      if (JSON.stringify(formState[item]) !== JSON.stringify(property[item])) {
        payload = {
          ...payload,
          [item]:
            item === 'num_of_units' || item === 'year_built'
              ? Number(formState[item])
              : formState[item]
        };
      }
    });

    const isCreatingProperty = !property.id;

    // Check state for updates and add to payload
    Object.keys(formState).forEach((item) => {
      if (JSON.stringify(formState[item]) !== JSON.stringify(property[item])) {
        payload = {
          ...payload,
          [item]:
            item === 'num_of_units' || item === 'year_built'
              ? Number(formState[item])
              : formState[item]
        };
      }
    });

    // Add any user template updates
    // TODO: do not include templates
    //       unless user updated them
    if (formState.templates) {
      payload.templates = selectedTemplates.reduce((acc, templateId) => {
        acc[templateId] = true;
        return acc;
      }, {});
    }

    let statusCode = 0;
    let response = null;
    try {
      const request = isCreatingProperty
        ? createProperty(payload)
        : updateProperty(property.id, payload);
      const result = await request;
      statusCode = result.statusCode;
      response = result.response;

      // Fail for bad request
      if (statusCode >= 300) throw Error('Request failed');

      // Fail for bad response
      if (
        !response ||
        !response.data ||
        !response.data.attributes ||
        !response.data.id
      ) {
        throw Error('Unexpected payload');
      }
    } catch (err) {
      // Create or update property failure
      sendNotification(
        `Failed to ${
          isCreatingProperty ? 'create' : 'update'
        } property, please try again.`,
        {
          type: 'error'
        }
      );
      // Log issue and send error report
      // eslint-disable-next-line no-case-declarations
      const wrappedErr = Error(
        `features: PropertyEdit: property ${
          isCreatingProperty ? 'create' : 'update'
        } operation failed: ${err}`
      );
      // eslint-disable-next-line import/no-named-as-default-member
      errorReports.send(wrappedErr);
      return;
    }

    // Show success notification
    const latestPropertyName = response.data.attributes.name || property.name;
    sendNotification(
      isCreatingProperty
        ? 'Property successfully created'
        : `${latestPropertyName} successfully updated`,
      {
        type: 'success'
      }
    );

    // Transition to successfully created property
    if (isCreatingProperty) {
      Router.push(`/properties/${response.data.id}/`);
    }
  };

  //   Mobile header save button
  const mobileHeaderActions = () => (
    <button
      data-testid="save-button-mobile"
      className={styles.saveButton}
      onClick={(e) => onSubmit(e)}
      disabled={apiState.isLoading}
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
        {apiState.isLoading && <LoadingHud title="Saving..." />}
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
            formState={formState}
            templateNames={templateNames}
            apiState={apiState}
            formErrors={formErrors}
            openTrello={openTrello}
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
