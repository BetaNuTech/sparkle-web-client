import clsx from 'clsx';
import { FunctionComponent, useState } from 'react';
import UpdateTeamModal from '../UpdateTeamModal/index';
import TemplatesEditModal from '../TemplatesEditModal/index';
import styles from './styles.module.scss';

interface Props {
  isOnline: boolean;
  isUpdateTeamModalVisible: boolean;
  isTemplatesEditModalVisible: boolean;
  categories: Array<any>;
  searchParam?: string;
  teams: Array<any>;
  property?: any;
  openUpdateTeamModal: () => void;
  closeUpdateTeamModal: () => void;
  openTemplatesEditModal: () => void;
  closeTemplatesEditModal: () => void;
  onSearchKeyDown?(ev: React.KeyboardEvent<HTMLInputElement>): void;
}

const PropertyMobileForm: FunctionComponent<Props> = ({
  isOnline,
  isUpdateTeamModalVisible,
  isTemplatesEditModalVisible,
  teams,
  categories,
  searchParam,
  openUpdateTeamModal,
  closeUpdateTeamModal,
  openTemplatesEditModal,
  closeTemplatesEditModal,
  onSearchKeyDown
}) => {
  const [properyImg, setProperyImg] = useState<string>('');
  const [logoImg, setLogoImg] = useState<string>('');
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [selectedTemplates, setSelectedTemplates] = useState<any[]>([]);

  const updateTempatesList = (templateId) => {
    const index = selectedTemplates.indexOf(templateId);
    if (index > -1) {
      setSelectedTemplates(
        selectedTemplates.filter((item) => item !== templateId)
      );
    } else {
      setSelectedTemplates([templateId, ...selectedTemplates]);
    }
  };

  const changeTeamSelection = (newId) => {
    setSelectedTeamId(newId);
  };

  const openModal = (e) => {
    e.preventDefault();
    openUpdateTeamModal();
  };

  const openTemplatesModal = (e) => {
    e.preventDefault();
    openTemplatesEditModal();
  };

  return (
    <>
      <form className={styles.propertyEditMobile__form}>
        {/* Property Image */}
        <div className={styles.propertyEditMobile__formGroup}>
          <div className={styles.propertyEditMobile__formGroup__control}>
            <input
              id="propertyImage"
              type="file"
              accept="image/png, image/jpeg"
              name="propertyImage"
              disabled={!isOnline}
              className={styles.propertyEditMobile__imageInput}
              data-testid="property-form-add-image-mobile"
              onChange={(e) => {
                setProperyImg(URL.createObjectURL(e.target.files[0]));
              }}
            />
            <label
              className={styles.propertyEditMobile__imageInputLabel}
              htmlFor="propertyImage"
            >
              {properyImg ? (
                <>
                  {/* Image Upload */}
                  <img alt="property profile" src={properyImg} />
                </>
              ) : (
                'Add Image'
              )}
            </label>
            <h6
              className={styles.propertyEditMobile__formGroup__control__heading}
            >
              Property Image
            </h6>
          </div>
        </div>
        {/* Logo */}
        <div className={styles.propertyEditMobile__formGroup}>
          <div className={styles.propertyEditMobile__formGroup__control}>
            <input
              id="logo"
              type="file"
              accept="image/png, image/jpeg"
              disabled={!isOnline}
              name="logo"
              className={styles.propertyEditMobile__imageInput}
              data-testid="property-form-add-logo-mobile"
              onChange={(e) => {
                setLogoImg(URL.createObjectURL(e.target.files[0]));
              }}
            />
            <label
              className={styles.propertyEditMobile__imageInputLabel}
              htmlFor="logo"
            >
              {' '}
              {logoImg ? (
                <>
                  {/* Image Upload */}
                  <img alt="property logo" src={logoImg} />
                </>
              ) : (
                'Add Logo'
              )}
            </label>

            <h6
              className={styles.propertyEditMobile__formGroup__control__heading}
            >
              Logo
            </h6>
          </div>
        </div>
        {/* Name */}
        <div className={styles.propertyEditMobile__formGroup}>
          <div className={styles.propertyEditMobile__formGroup__control}>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              name="name"
              className={styles.propertyEditMobile__input}
              data-testid="property-name"
            />
          </div>
        </div>
        {/* Team */}
        <div className={styles.propertyEditMobile__formGroup}>
          <div className={styles.propertyEditMobile__formGroup__control}>
            <label htmlFor="team">Team</label>
            <button
              onClick={openModal}
              className={clsx(
                !selectedTeamId
                  ? styles.propertyEditMobile__teamButton
                  : styles.propertyEditMobile__saveButton
              )}
            >
              {!selectedTeamId
                ? 'Not Set'
                : teams
                    .filter((team) => team.id === selectedTeamId)
                    .map((team) => team.name)}
            </button>
          </div>
        </div>
        <div className={styles.propertyEditMobile__formGroup}>
          <div className={styles.propertyEditMobile__formGroup__control}>
            <label htmlFor="cobaltCode">Cobalt Property Code</label>
            <input
              id="cobaltCode"
              type="text"
              name="cobaltCode"
              className={styles.propertyEditMobile__input}
              data-testid="cobalt-code"
            />
          </div>
        </div>
        {/* Address */}
        <div className={styles.propertyEditMobile__formGroup}>
          <div className={styles.propertyEditMobile__formGroup__control}>
            <label htmlFor="address">Address</label>
            <input
              id="address1"
              placeholder="Address 1"
              type="text"
              name="address1"
              className={styles.propertyEditMobile__input}
              data-testid="address-1"
            />
            <input
              id="address2"
              placeholder="Address 2"
              type="text"
              name="address2"
              className={styles.propertyEditMobile__input}
              data-testid="address-2"
            />
            <input
              id="city"
              placeholder="City"
              type="text"
              name="city"
              className={styles.propertyEditMobile__input}
              data-testid="city"
            />
            <input
              id="state"
              placeholder="State"
              type="text"
              name="state"
              className={styles.propertyEditMobile__input}
              data-testid="state"
            />
            <input
              id="zip"
              placeholder="Postal Code"
              type="text"
              name="zip"
              className={styles.propertyEditMobile__input}
              data-testid="zip"
            />
          </div>
        </div>
        {/* Year Built */}
        <div className={styles.propertyEditMobile__formGroup}>
          <div className={styles.propertyEditMobile__formGroup__control}>
            <label htmlFor="yearBuilt">Year Built</label>
            <input
              id="yearBuilt"
              type="number"
              name="yearBuilt"
              className={styles.propertyEditMobile__input}
              data-testid="year-built"
            />
          </div>
        </div>
        {/* Number of Units */}
        <div className={styles.propertyEditMobile__formGroup}>
          <div className={styles.propertyEditMobile__formGroup__control}>
            <label htmlFor="numberOfUnits">Number of Units</label>
            <input
              id="numberOfUnits"
              type="number"
              name="numberOfUnits"
              className={styles.propertyEditMobile__input}
              data-testid="number-of-units"
            />
          </div>
        </div>
        {/* Manager Name */}
        <div className={styles.propertyEditMobile__formGroup}>
          <div className={styles.propertyEditMobile__formGroup__control}>
            <label htmlFor="managerName">Manager&#39;s Name</label>
            <input
              id="managerName"
              type="text"
              name="managerName"
              className={styles.propertyEditMobile__input}
              data-testid="manager-name"
            />
          </div>
        </div>
        {/* Super Name */}
        <div className={styles.propertyEditMobile__formGroup}>
          <div className={styles.propertyEditMobile__formGroup__control}>
            <label htmlFor="superName">Super&#39;s Name</label>
            <input
              id="superName"
              type="text"
              name="superName"
              className={styles.propertyEditMobile__input}
              data-testid="super-name"
            />
          </div>
        </div>
        {/* Loan Type */}
        <div className={styles.propertyEditMobile__formGroup}>
          <div className={styles.propertyEditMobile__formGroup__control}>
            <label htmlFor="loanType">Loan Type</label>
            <input
              id="loanType"
              type="text"
              name="loanType"
              className={styles.propertyEditMobile__input}
              data-testid="loan-type"
            />
          </div>
        </div>
        {/* Templates button */}
        <div className={styles.propertyEditMobile__formGroup}>
          <div className={styles.propertyEditMobile__formGroup__control}>
            <button
              onClick={openTemplatesModal}
              className={styles.propertyEditMobile__templatesButton}
            >
              Templates
            </button>
          </div>
        </div>
        {/* Trello Button */}
        <div className={styles.propertyEditMobile__formGroup}>
          <div className={styles.propertyEditMobile__formGroup__control}>
            <button className={styles.propertyEditMobile__trelloButton}>
              TRELLO
            </button>
          </div>
        </div>
      </form>
      <UpdateTeamModal
        isVisible={isUpdateTeamModalVisible}
        onClose={closeUpdateTeamModal}
        teams={teams}
        selectedTeamId={selectedTeamId}
        changeTeamSelection={changeTeamSelection}
      />
      <TemplatesEditModal
        isVisible={isTemplatesEditModalVisible}
        onClose={closeTemplatesEditModal}
        categories={categories}
        selectedTemplates={selectedTemplates}
        updateTempatesList={updateTempatesList}
        onSearchKeyDown={onSearchKeyDown}
        searchParam={searchParam}
      />
    </>
  );
};

export default PropertyMobileForm;
