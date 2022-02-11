import clsx from 'clsx';
import { useRouter } from 'next/router';
import { FunctionComponent, ChangeEvent } from 'react';
import styles from './styles.module.scss';
import propertyModel from '../../../common/models/property';
import ErrorLabel from '../../../common/ErrorLabel';
import ChevronIcon from '../../../public/icons/ios/chevron.svg';
import teamModel from '../../../common/models/team';
import ErrorList from '../../../common/ErrorList';

interface Props {
  isOnline?: boolean;
  teams: teamModel[];
  selectedTeamId: string;
  property?: propertyModel;
  properyImg: string;
  logoImg: string;
  formState: propertyModel;
  templateNames: string[];
  isLoading: boolean;
  formErrors?: any;
  userRequestErrors: string[];
  openUpdateTeamModal: (e) => void;
  openTemplatesEditModal: (e) => void;
  openTrello: (e) => void;
  onSubmit: (action: any) => void;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  removePropertyImage: () => void;
  removeLogo: () => void;
  onQueuePropertyDelete: (e, property: propertyModel) => void;
}

const PropertyDesktopForm: FunctionComponent<Props> = ({
  isOnline,
  teams,
  selectedTeamId,
  properyImg,
  logoImg,
  formState,
  templateNames,
  isLoading,
  formErrors,
  property,
  userRequestErrors,
  openUpdateTeamModal,
  openTemplatesEditModal,
  openTrello,
  handleChange,
  onSubmit,
  removePropertyImage,
  removeLogo,
  onQueuePropertyDelete
}) => {
  const router = useRouter();

  const cancel = (e) => {
    e.preventDefault();
    router.push('/properties');
  };

  return (
    <div className={styles.propertyEditDesktop__mainContainer}>
      <ErrorList errors={userRequestErrors} />
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

          {/* Property Image */}
          <input
            id="photoURL"
            type="file"
            accept="image/png, image/jpeg"
            name="photoURL"
            disabled={!isOnline}
            className={styles.propertyEditDesktop__imageInput}
            data-testid="property-form-add-image"
            onChange={handleChange}
          />
          <label
            className={styles.propertyEditDesktop__imageInputLabel}
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
          <div
            className={clsx(
              styles.propertyEditDesktop__options,
              styles['propertyEditDesktop__options--bottomRight']
            )}
          >
            <div className={styles.propertyEditDesktop__options__title}>
              Property Image
            </div>
            <div className={clsx('-d-flex')}>
              {properyImg ? (
                <div className={clsx('-d-flex')}>
                  <label
                    className={styles.propertyEditDesktop__optionsButton}
                    htmlFor="photoURL"
                  >
                    Edit
                  </label>
                  <div>|</div>
                </div>
              ) : (
                <label
                  className={styles.propertyEditDesktop__optionsButton}
                  htmlFor="photoURL"
                >
                  Add
                </label>
              )}
              {/* Remove Property Image Button */}
              {properyImg && (
                <button
                  className={styles.propertyEditDesktop__optionsButton}
                  onClick={removePropertyImage}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        </div>

        <div className={styles.propertyEditDesktop__container__templates}>
          <div className={styles.propertyEditDesktop__buttonContainer}>
            <button
              onClick={(e) => onSubmit(e)}
              className={styles.propertyEditDesktop__topSaveButton}
              data-testid="top-save-button-desktop"
              disabled={isLoading}
            >
              Save
            </button>
          </div>
          <div className={styles.propertyEditDesktop__templates__title}>
            TEMPLATES ({templateNames.length})
          </div>
          <div className={styles.propertyEditDesktop__templates__list}>
            {templateNames.length
              ? templateNames.map((template) => (
                  <div
                    key={template}
                    className={
                      styles.propertyEditDesktop__templates__list__item
                    }
                    data-testid={`template-${template}`}
                  >
                    {template}
                  </div>
                ))
              : null}
          </div>
          <div className={styles.propertyEditDesktop__templates__buttons}>
            {/* Templates button */}
            <button
              onClick={openTemplatesEditModal}
              className={styles.propertyEditDesktop__templatesButton}
              data-testid="templates-button-desktop"
            >
              TEMPLATES
            </button>
            {/* Trello Button */}
            <button
              disabled={!property.id}
              onClick={(e) => openTrello(e)}
              className={styles.propertyEditDesktop__trelloButton}
            >
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
                  id="logoURL"
                  type="file"
                  accept="image/png, image/jpeg"
                  disabled={!isOnline}
                  name="logoURL"
                  className={styles.propertyEditDesktop__imageInput}
                  data-testid="property-form-add-logo"
                  onChange={handleChange}
                />
                <label
                  className={styles.propertyEditDesktop__logoInputLabel}
                  htmlFor="logoURL"
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
                </label>
                <div className={styles.propertyEditDesktop__logoOptions}>
                  <div
                    className={
                      styles.propertyEditDesktop__logoOptions__optionsContainer
                    }
                  >
                    {logoImg ? (
                      <div className={clsx('-d-flex')}>
                        <label
                          className={clsx(
                            styles.propertyEditDesktop__optionsButton,
                            '-fw-normal'
                          )}
                          htmlFor="logoURL"
                        >
                          Edit
                        </label>
                        <div>|</div>
                      </div>
                    ) : (
                      <label
                        className={clsx(
                          styles.propertyEditDesktop__optionsButton,
                          ['-fw-thin']
                        )}
                        htmlFor="logoURL"
                      >
                        Add
                      </label>
                    )}
                    {/* Remove Logo Button */}
                    {logoImg && (
                      <button
                        className={styles.propertyEditDesktop__optionsButton}
                        onClick={removeLogo}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
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
                  className={clsx(formErrors.nameRequired ? '-mb-none' : '')}
                  data-testid="property-form-name"
                  onChange={handleChange}
                  value={formState.name || ''}
                />
                <ErrorLabel formName="nameRequired" errors={formErrors} />
              </div>
            </div>
            {/* Team */}
            <div className={styles.propertyEditDesktop__formGroup}>
              <div className={styles.propertyEditDesktop__formGroup__control}>
                <label htmlFor="team">Team</label>
                <button
                  onClick={openUpdateTeamModal}
                  className={clsx(
                    !selectedTeamId
                      ? styles.propertyEditDesktop__teamButton
                      : styles.propertyEditDesktop__saveButton
                  )}
                  data-testid="team-button-desktop"
                >
                  {!selectedTeamId
                    ? 'Not Set'
                    : teams
                        .filter((team) => team.id === selectedTeamId)
                        .map((team) => team.name)}
                </button>
              </div>
            </div>
            <div className={styles.propertyEditDesktop__formGroup}>
              <div className={styles.propertyEditDesktop__formGroup__control}>
                <label htmlFor="code">Cobalt Property Code</label>
                <input
                  id="code"
                  type="text"
                  name="code"
                  data-testid="cobalt-code"
                  onChange={handleChange}
                  value={formState.code || ''}
                />
              </div>
            </div>
            <div className={styles.propertyEditDesktop__formGroup}>
              <div className={styles.propertyEditDesktop__formGroup__control}>
                <label htmlFor="slackChannel">Slack Channel</label>
                <input
                  id="slackChannel"
                  type="text"
                  name="slackChannel"
                  onChange={handleChange}
                  value={formState.slackChannel || ''}
                  placeholder="#slack-channel"
                />
              </div>
            </div>
            {/* Address */}
            <div className={styles.propertyEditDesktop__formGroup}>
              <div className={styles.propertyEditDesktop__formGroup__control}>
                <label htmlFor="address">Address</label>
                <input
                  id="addr1"
                  placeholder="Address 1"
                  type="text"
                  name="addr1"
                  data-testid="address-1"
                  onChange={handleChange}
                  value={formState.addr1 || ''}
                />
                <input
                  id="addr2"
                  placeholder="Address 2"
                  type="text"
                  name="addr2"
                  data-testid="address-2"
                  onChange={handleChange}
                  value={formState.addr2 || ''}
                />
                <input
                  id="city"
                  placeholder="City"
                  type="text"
                  name="city"
                  data-testid="city"
                  onChange={handleChange}
                  value={formState.city || ''}
                />
                <input
                  id="state"
                  placeholder="State"
                  type="text"
                  name="state"
                  data-testid="state"
                  onChange={handleChange}
                  value={formState.state || ''}
                />
                <input
                  id="zip"
                  placeholder="Postal Code"
                  type="text"
                  name="zip"
                  data-testid="zip"
                  onChange={handleChange}
                  value={formState.zip || ''}
                />
              </div>
            </div>
            {/* Year Built */}
            <div className={styles.propertyEditDesktop__formGroup}>
              <div className={styles.propertyEditDesktop__formGroup__control}>
                <label htmlFor="year_built">Year Built</label>
                <input
                  id="year_built"
                  type="number"
                  name="year_built"
                  data-testid="year-built"
                  onChange={handleChange}
                  value={formState.year_built || ''}
                />
              </div>
            </div>
            {/* Number of Units */}
            <div className={styles.propertyEditDesktop__formGroup}>
              <div className={styles.propertyEditDesktop__formGroup__control}>
                <label htmlFor="num_of_units">Number of Units</label>
                <input
                  id="num_of_units"
                  type="number"
                  name="num_of_units"
                  data-testid="number-of-units"
                  onChange={handleChange}
                  value={formState.num_of_units || ''}
                />
              </div>
            </div>
            {/* Manager Name */}
            <div className={styles.propertyEditDesktop__formGroup}>
              <div className={styles.propertyEditDesktop__formGroup__control}>
                <label htmlFor="manager_name">Manager&#39;s Name</label>
                <input
                  id="manager_name"
                  type="text"
                  name="manager_name"
                  data-testid="manager-name"
                  onChange={handleChange}
                  value={formState.manager_name || ''}
                />
              </div>
            </div>
            {/* Super Name */}
            <div className={styles.propertyEditDesktop__formGroup}>
              <div className={styles.propertyEditDesktop__formGroup__control}>
                <label htmlFor="maint_super_name">Super&#39;s Name</label>
                <input
                  id="maint_super_name"
                  type="text"
                  name="maint_super_name"
                  data-testid="super-name"
                  onChange={handleChange}
                  value={formState.maint_super_name || ''}
                />
              </div>
            </div>
            {/* Loan Type */}
            <div className={styles.propertyEditDesktop__formGroup}>
              <div className={styles.propertyEditDesktop__formGroup__control}>
                <label htmlFor="loan_type">Loan Type</label>
                <input
                  id="loan_type"
                  type="text"
                  name="loan_type"
                  data-testid="loan-type"
                  onChange={handleChange}
                  value={formState.loan_type || ''}
                />
              </div>
            </div>
            {/* Save button */}
            <button
              onClick={(e) => onSubmit(e)}
              className={styles.propertyEditDesktop__saveButton}
              data-testid="save-button-desktop"
              disabled={isLoading}
            >
              Save
            </button>
            {property.id && (
              <button
                onClick={(e) => onQueuePropertyDelete(e, property)}
                className={styles.propertyEditDesktop__deleteButton}
              >
                Delete Property
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default PropertyDesktopForm;
