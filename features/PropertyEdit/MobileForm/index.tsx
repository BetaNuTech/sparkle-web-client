import clsx from 'clsx';
import { FunctionComponent } from 'react';
import propertyModel from '../../../common/models/property';
import styles from './styles.module.scss';
import ErrorLabel from '../../../common/ErrorLabel';

interface Props {
  isOnline: boolean;
  teams: Array<any>;
  selectedTeamId: string;
  property?: any;
  properyImg: string;
  logoImg: string;
  formState: propertyModel;
  formErrors?: any;
  openUpdateTeamModal: (any) => void;
  openTrello: (any) => void;
  openTemplatesEditModal: (any) => void;
  handleChange: (string) => void;
}

const PropertyMobileForm: FunctionComponent<Props> = ({
  isOnline,
  teams,
  selectedTeamId,
  properyImg,
  property,
  logoImg,
  formState,
  formErrors,
  openUpdateTeamModal,
  openTemplatesEditModal,
  openTrello,
  handleChange
}) => (
  <>
    <form className={styles.propertyEditMobile__form}>
      {/* Property Image */}
      <div className={styles.propertyEditMobile__formGroup}>
        <div className={styles.propertyEditMobile__formGroup__control}>
          <input
            id="photoURL"
            type="file"
            accept="image/png, image/jpeg"
            name="photoURL"
            disabled={!isOnline}
            className={styles.propertyEditMobile__imageInput}
            data-testid="property-form-add-image-mobile"
            onChange={handleChange}
          />
          <label
            className={styles.propertyEditMobile__imageInputLabel}
            htmlFor="photoURL"
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
            id="logoURL"
            type="file"
            accept="image/png, image/jpeg"
            disabled={!isOnline}
            name="logoURL"
            className={styles.propertyEditMobile__imageInput}
            data-testid="property-form-add-logo-mobile"
            onChange={handleChange}
          />
          <label
            className={styles.propertyEditMobile__imageInputLabel}
            htmlFor="logoURL"
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
          <ErrorLabel formName="nameRequired" errors={formErrors} />
          <input
            id="name"
            type="text"
            name="name"
            className={styles.propertyEditMobile__input}
            data-testid="property-name"
            onChange={handleChange}
            value={formState.name || ''}
          />
        </div>
      </div>
      {/* Team */}
      <div className={styles.propertyEditMobile__formGroup}>
        <div className={styles.propertyEditMobile__formGroup__control}>
          <label htmlFor="team">Team</label>
          <button
            onClick={openUpdateTeamModal}
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
          <label htmlFor="code">Cobalt Property Code</label>
          <input
            id="code"
            type="text"
            name="code"
            className={styles.propertyEditMobile__input}
            data-testid="cobalt-code"
            onChange={handleChange}
            value={formState.code || ''}
          />
        </div>
      </div>
      {/* Address */}
      <div className={styles.propertyEditMobile__formGroup}>
        <div className={styles.propertyEditMobile__formGroup__control}>
          <label htmlFor="address">Address</label>
          <input
            id="addr1"
            placeholder="Address 1"
            type="text"
            name="addr1"
            className={styles.propertyEditMobile__input}
            data-testid="address-1"
            onChange={handleChange}
            value={formState.addr1 || ''}
          />
          <input
            id="addr2"
            placeholder="Address 2"
            type="text"
            name="addr2"
            className={styles.propertyEditMobile__input}
            data-testid="address-2"
            onChange={handleChange}
            value={formState.addr2 || ''}
          />
          <input
            id="city"
            placeholder="City"
            type="text"
            name="city"
            className={styles.propertyEditMobile__input}
            data-testid="city"
            onChange={handleChange}
            value={formState.city || ''}
          />
          <input
            id="state"
            placeholder="State"
            type="text"
            name="state"
            className={styles.propertyEditMobile__input}
            data-testid="state"
            onChange={handleChange}
            value={formState.state || ''}
          />
          <input
            id="zip"
            placeholder="Postal Code"
            type="text"
            name="zip"
            className={styles.propertyEditMobile__input}
            data-testid="zip"
            onChange={handleChange}
            value={formState.zip || ''}
          />
        </div>
      </div>
      {/* Year Built */}
      <div className={styles.propertyEditMobile__formGroup}>
        <div className={styles.propertyEditMobile__formGroup__control}>
          <label htmlFor="year_built">Year Built</label>
          <input
            id="year_built"
            type="number"
            name="year_built"
            className={styles.propertyEditMobile__input}
            data-testid="year-built"
            onChange={handleChange}
            value={formState.year_built || ''}
          />
        </div>
      </div>
      {/* Number of Units */}
      <div className={styles.propertyEditMobile__formGroup}>
        <div className={styles.propertyEditMobile__formGroup__control}>
          <label htmlFor="num_of_units">Number of Units</label>
          <input
            id="num_of_units"
            type="number"
            name="num_of_units"
            className={styles.propertyEditMobile__input}
            data-testid="number-of-units"
            onChange={handleChange}
            value={formState.num_of_units || ''}
          />
        </div>
      </div>
      {/* Manager Name */}
      <div className={styles.propertyEditMobile__formGroup}>
        <div className={styles.propertyEditMobile__formGroup__control}>
          <label htmlFor="manager_name">Manager&#39;s Name</label>
          <input
            id="manager_name"
            type="text"
            name="manager_name"
            className={styles.propertyEditMobile__input}
            data-testid="manager-name"
            onChange={handleChange}
            value={formState.manager_name || ''}
          />
        </div>
      </div>
      {/* Super Name */}
      <div className={styles.propertyEditMobile__formGroup}>
        <div className={styles.propertyEditMobile__formGroup__control}>
          <label htmlFor="maint_super_name">Super&#39;s Name</label>
          <input
            id="maint_super_name"
            type="text"
            name="maint_super_name"
            className={styles.propertyEditMobile__input}
            data-testid="super-name"
            onChange={handleChange}
            value={formState.maint_super_name || ''}
          />
        </div>
      </div>
      {/* Loan Type */}
      <div className={styles.propertyEditMobile__formGroup}>
        <div className={styles.propertyEditMobile__formGroup__control}>
          <label htmlFor="loan_type">Loan Type</label>
          <input
            id="loan_type"
            type="text"
            name="loan_type"
            className={styles.propertyEditMobile__input}
            data-testid="loan-type"
            onChange={handleChange}
            value={formState.loan_type || ''}
          />
        </div>
      </div>
      {/* Templates button */}
      <div className={styles.propertyEditMobile__formGroup}>
        <div className={styles.propertyEditMobile__formGroup__control}>
          <button
            onClick={openTemplatesEditModal}
            className={styles.propertyEditMobile__templatesButton}
          >
            Templates
          </button>
        </div>
      </div>
      {/* Trello Button */}
      <div className={styles.propertyEditMobile__formGroup}>
        <div className={styles.propertyEditMobile__formGroup__control}>
          <button
            disabled={!property.id}
            onClick={(e) => openTrello(e)}
            className={styles.propertyEditMobile__trelloButton}
          >
            TRELLO
          </button>
        </div>
      </div>
    </form>
  </>
);

export default PropertyMobileForm;
