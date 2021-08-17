import { FunctionComponent, useState } from 'react';
import styles from './styles.module.scss';

interface Props {
  isOnline: boolean;
}

const PropertyMobileForm: FunctionComponent<Props> = ({ isOnline }) => {
  const [properyImg, setProperyImg] = useState<string>('');
  const [logoImg, setLogoImg] = useState<string>('');

  return (
    <form className={styles.propertyNew__form}>
      {/* Property Image */}
      <div className={styles.propertyNew__formGroup}>
        <div className={styles.propertyNew__formGroup__control}>
          <input
            id="propertyImage"
            type="file"
            accept="image/png, image/jpeg"
            name="propertyImage"
            disabled={!isOnline}
            className={styles.propertyNew__imageInput}
            data-testid="property-form-add-image-mobile"
            onChange={(e) => {
              setProperyImg(URL.createObjectURL(e.target.files[0]));
            }}
          />
          <label
            className={styles.propertyNew__imageInputLabel}
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
          <h6 className={styles.propertyNew__formGroup__control__heading}>
            Property Image
          </h6>
        </div>
      </div>
      {/* Logo */}
      <div className={styles.propertyNew__formGroup}>
        <div className={styles.propertyNew__formGroup__control}>
          <input
            id="logo"
            type="file"
            accept="image/png, image/jpeg"
            disabled={!isOnline}
            name="logo"
            className={styles.propertyNew__imageInput}
            data-testid="property-form-add-logo-mobile"
            onChange={(e) => {
              setLogoImg(URL.createObjectURL(e.target.files[0]));
            }}
          />
          <label className={styles.propertyNew__imageInputLabel} htmlFor="logo">
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

          <h6 className={styles.propertyNew__formGroup__control__heading}>
            Logo
          </h6>
        </div>
      </div>
      {/* Name */}
      <div className={styles.propertyNew__formGroup}>
        <div className={styles.propertyNew__formGroup__control}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            className={styles.propertyNew__input}
            data-testid="property-name"
          />
        </div>
      </div>
      {/* Team */}
      <div className={styles.propertyNew__formGroup}>
        <div className={styles.propertyNew__formGroup__control}>
          <label htmlFor="team">Team</label>
          <button className={styles.propertyNew__teamButton}>Not set</button>
        </div>
      </div>
      <div className={styles.propertyNew__formGroup}>
        <div className={styles.propertyNew__formGroup__control}>
          <label htmlFor="cobaltCode">Cobalt Property Code</label>
          <input
            id="cobaltCode"
            type="text"
            name="cobaltCode"
            className={styles.propertyNew__input}
            data-testid="cobalt-code"
          />
        </div>
      </div>
      {/* Address */}
      <div className={styles.propertyNew__formGroup}>
        <div className={styles.propertyNew__formGroup__control}>
          <label htmlFor="address">Address</label>
          <input
            id="address1"
            placeholder="Address 1"
            type="text"
            name="address1"
            className={styles.propertyNew__input}
            data-testid="address-1"
          />
          <input
            id="address2"
            placeholder="Address 2"
            type="text"
            name="address2"
            className={styles.propertyNew__input}
            data-testid="address-2"
          />
          <input
            id="city"
            placeholder="City"
            type="text"
            name="city"
            className={styles.propertyNew__input}
            data-testid="city"
          />
          <input
            id="state"
            placeholder="State"
            type="text"
            name="state"
            className={styles.propertyNew__input}
            data-testid="state"
          />
          <input
            id="zip"
            placeholder="Postal Code"
            type="text"
            name="zip"
            className={styles.propertyNew__input}
            data-testid="zip"
          />
        </div>
      </div>
      {/* Year Built */}
      <div className={styles.propertyNew__formGroup}>
        <div className={styles.propertyNew__formGroup__control}>
          <label htmlFor="yearBuilt">Year Built</label>
          <input
            id="yearBuilt"
            type="number"
            name="yearBuilt"
            className={styles.propertyNew__input}
            data-testid="year-built"
          />
        </div>
      </div>
      {/* Number of Units */}
      <div className={styles.propertyNew__formGroup}>
        <div className={styles.propertyNew__formGroup__control}>
          <label htmlFor="numberOfUnits">Number of Units</label>
          <input
            id="numberOfUnits"
            type="number"
            name="numberOfUnits"
            className={styles.propertyNew__input}
            data-testid="number-of-units"
          />
        </div>
      </div>
      {/* Manager Name */}
      <div className={styles.propertyNew__formGroup}>
        <div className={styles.propertyNew__formGroup__control}>
          <label htmlFor="managerName">Manager&#39;s Name</label>
          <input
            id="managerName"
            type="text"
            name="managerName"
            className={styles.propertyNew__input}
            data-testid="manager-name"
          />
        </div>
      </div>
      {/* Super Name */}
      <div className={styles.propertyNew__formGroup}>
        <div className={styles.propertyNew__formGroup__control}>
          <label htmlFor="superName">Super&#39;s Name</label>
          <input
            id="superName"
            type="text"
            name="superName"
            className={styles.propertyNew__input}
            data-testid="super-name"
          />
        </div>
      </div>
      {/* Loan Type */}
      <div className={styles.propertyNew__formGroup}>
        <div className={styles.propertyNew__formGroup__control}>
          <label htmlFor="loanType">Loan Type</label>
          <input
            id="loanType"
            type="text"
            name="loanType"
            className={styles.propertyNew__input}
            data-testid="loan-type"
          />
        </div>
      </div>
      {/* Templates button */}
      <div className={styles.propertyNew__formGroup}>
        <div className={styles.propertyNew__formGroup__control}>
          <button className={styles.propertyNew__templatesButton}>
            Templates
          </button>
        </div>
      </div>
      {/* Trello Button */}
      <div className={styles.propertyNew__formGroup}>
        <div className={styles.propertyNew__formGroup__control}>
          <button className={styles.propertyNew__trelloButton}>TRELLO</button>
        </div>
      </div>
    </form>
  );
};

export default PropertyMobileForm;
