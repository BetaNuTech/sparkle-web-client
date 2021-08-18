import { useRouter } from 'next/router';
import { FunctionComponent, useState } from 'react';
import styles from './styles.module.scss';
import ChevronIcon from '../../../public/icons/ios/chevron.svg';

interface Props {
  isOnline: boolean;
}

const PropertyDesktopForm: FunctionComponent<Props> = ({ isOnline }) => {
  const router = useRouter();

  const [properyImg, setProperyImg] = useState<string>('');
  const [logoImg, setLogoImg] = useState<string>('');

  const removePropertyImage = () => {
    setProperyImg('');
  };

  const removeLogo = () => {
    setLogoImg('');
  };

  const cancel = (e) => {
    e.preventDefault();
    router.push('/properties');
  };

  return (
    <div className={styles.propertyEditDesktop__mainContainer}>
      <form className={styles.propertyEditDesktop__form}>
        <div className={styles.propertyEditDesktop__container__image}>
          {/* Cancel Button */}
          <button
            onClick={cancel}
            className={styles.propertyEditDesktop__cancelButton}
          >
            <span>
              <ChevronIcon
                className={
                  styles.propertyEditDesktop__cancelButton__chevronIcon
                }
              />
            </span>{' '}
            Cancel
          </button>
          {/* Remove Property Image Button */}
          {properyImg && (
            <button
              className={styles.propertyEditDesktop__removePropertyImageButton}
              onClick={removePropertyImage}
            >
              Remove
            </button>
          )}
          {/* Remove Logo Button */}
          {logoImg && (
            <button
              className={styles.propertyEditDesktop__removeLogoButton}
              onClick={removeLogo}
            >
              Remove
            </button>
          )}
          {/* Property Image */}
          <input
            id="propertyImage"
            type="file"
            accept="image/png, image/jpeg"
            name="propertyImage"
            disabled={!isOnline}
            className={styles.propertyEditDesktop__imageInput}
            data-testid="property-form-add-image"
            onChange={(e) => {
              setProperyImg(URL.createObjectURL(e.target.files[0]));
            }}
          />
          <label
            className={styles.propertyEditDesktop__imageInputLabel}
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
            <div className={styles.propertyEditDesktop__options}>
              <p className={styles.propertyEditDesktop__options__title}>
                Property Image
              </p>
              {properyImg ? (
                <p className={styles.propertyEditDesktop__options__option}>
                  Edit
                </p>
              ) : (
                <p className={styles.propertyEditDesktop__options__option}>
                  Add
                </p>
              )}
            </div>
          </label>
        </div>
        <div className={styles.propertyEditDesktop__container__templates}>
          <div className={styles.propertyEditDesktop__templates__title}>
            TEMPLATES
          </div>
          <div className={styles.propertyEditDesktop__templates__list}></div>
          <div className={styles.propertyEditDesktop__templates__buttons}>
            {/* Templates button */}
            <button className={styles.propertyEditDesktop__templatesButton}>
              TEMPLATES
            </button>
            {/* Trello Button */}
            <button className={styles.propertyEditDesktop__trelloButton}>
              TRELLO
            </button>
          </div>
        </div>
        <div className={styles.propertyEditDesktop__container__fields}>
          {/* Logo */}
          <div className={styles.propertyEditDesktop__logoContainer}>
            <div className={styles.propertyEditDesktop__formGroup}>
              <label htmlFor="logo">Logo Image</label>
              <div className={styles.propertyEditDesktop__formGroup__control}>
                <input
                  id="logo"
                  type="file"
                  accept="image/png, image/jpeg"
                  disabled={!isOnline}
                  name="logo"
                  className={styles.propertyEditDesktop__imageInput}
                  data-testid="property-form-add-logo"
                  onChange={(e) => {
                    setLogoImg(URL.createObjectURL(e.target.files[0]));
                  }}
                />
                <label
                  className={styles.propertyEditDesktop__logoInputLabel}
                  htmlFor="logo"
                >
                  {' '}
                  {logoImg ? (
                    <>
                      {/* Image Upload */}
                      <img alt="property logo" src={logoImg} />
                    </>
                  ) : (
                    <div
                      className={
                        styles.propertyEditDesktop__logoInputLabel__text
                      }
                    >
                      Add Logo
                    </div>
                  )}
                  <div className={styles.propertyEditDesktop__options}>
                    {logoImg ? (
                      <p
                        className={styles.propertyEditDesktop__options__option}
                      >
                        Edit
                      </p>
                    ) : (
                      <p
                        className={styles.propertyEditDesktop__options__option}
                      >
                        Add
                      </p>
                    )}
                  </div>
                </label>
              </div>
            </div>
          </div>
          <div className={styles.propertyEditDesktop__fieldsContainer}>
            {/* Name */}
            <div className={styles.propertyEditDesktop__formGroup}>
              <div className={styles.propertyEditDesktop__formGroup__control}>
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  className={styles.propertyEditDesktop__input}
                  data-testid="property-name"
                />
              </div>
            </div>
            {/* Team */}
            <div className={styles.propertyEditDesktop__formGroup}>
              <div className={styles.propertyEditDesktop__formGroup__control}>
                <label htmlFor="team">Team</label>
                <button className={styles.propertyEditDesktop__teamButton}>
                  Not set
                </button>
              </div>
            </div>
            <div className={styles.propertyEditDesktop__formGroup}>
              <div className={styles.propertyEditDesktop__formGroup__control}>
                <label htmlFor="cobaltCode">Cobalt Property Code</label>
                <input
                  id="cobaltCode"
                  type="text"
                  name="cobaltCode"
                  className={styles.propertyEditDesktop__input}
                  data-testid="cobalt-code"
                />
              </div>
            </div>
            {/* Address */}
            <div className={styles.propertyEditDesktop__formGroup}>
              <div className={styles.propertyEditDesktop__formGroup__control}>
                <label htmlFor="address">Address</label>
                <input
                  id="address1"
                  placeholder="Address 1"
                  type="text"
                  name="address1"
                  className={styles.propertyEditDesktop__input}
                  data-testid="address-1"
                />
                <input
                  id="address2"
                  placeholder="Address 2"
                  type="text"
                  name="address2"
                  className={styles.propertyEditDesktop__input}
                  data-testid="address-2"
                />
                <input
                  id="city"
                  placeholder="City"
                  type="text"
                  name="city"
                  className={styles.propertyEditDesktop__input}
                  data-testid="city"
                />
                <input
                  id="state"
                  placeholder="State"
                  type="text"
                  name="state"
                  className={styles.propertyEditDesktop__input}
                  data-testid="state"
                />
                <input
                  id="zip"
                  placeholder="Postal Code"
                  type="text"
                  name="zip"
                  className={styles.propertyEditDesktop__input}
                  data-testid="zip"
                />
              </div>
            </div>
            {/* Year Built */}
            <div className={styles.propertyEditDesktop__formGroup}>
              <div className={styles.propertyEditDesktop__formGroup__control}>
                <label htmlFor="yearBuilt">Year Built</label>
                <input
                  id="yearBuilt"
                  type="number"
                  name="yearBuilt"
                  className={styles.propertyEditDesktop__input}
                  data-testid="year-built"
                />
              </div>
            </div>
            {/* Number of Units */}
            <div className={styles.propertyEditDesktop__formGroup}>
              <div className={styles.propertyEditDesktop__formGroup__control}>
                <label htmlFor="numberOfUnits">Number of Units</label>
                <input
                  id="numberOfUnits"
                  type="number"
                  name="numberOfUnits"
                  className={styles.propertyEditDesktop__input}
                  data-testid="number-of-units"
                />
              </div>
            </div>
            {/* Manager Name */}
            <div className={styles.propertyEditDesktop__formGroup}>
              <div className={styles.propertyEditDesktop__formGroup__control}>
                <label htmlFor="managerName">Manager&#39;s Name</label>
                <input
                  id="managerName"
                  type="text"
                  name="managerName"
                  className={styles.propertyEditDesktop__input}
                  data-testid="manager-name"
                />
              </div>
            </div>
            {/* Super Name */}
            <div className={styles.propertyEditDesktop__formGroup}>
              <div className={styles.propertyEditDesktop__formGroup__control}>
                <label htmlFor="superName">Super&#39;s Name</label>
                <input
                  id="superName"
                  type="text"
                  name="superName"
                  className={styles.propertyEditDesktop__input}
                  data-testid="super-name"
                />
              </div>
            </div>
            {/* Loan Type */}
            <div className={styles.propertyEditDesktop__formGroup}>
              <div className={styles.propertyEditDesktop__formGroup__control}>
                <label htmlFor="loanType">Loan Type</label>
                <input
                  id="loanType"
                  type="text"
                  name="loanType"
                  className={styles.propertyEditDesktop__input}
                  data-testid="loan-type"
                />
              </div>
            </div>
            {/* Save button */}

            <button className={styles.propertyEditDesktop__saveButton}>
              Save
            </button>
            <div className={styles.propertyEditDesktop__spacer}></div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PropertyDesktopForm;
