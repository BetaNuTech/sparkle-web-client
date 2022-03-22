import { FunctionComponent } from 'react';
import Link from 'next/link';
import MobileHeader from '../../../common/MobileHeader';
import LinkFeature from '../../../common/LinkFeature';
import features from '../../../config/features';
import DesktopHeader from '../../../common/DesktopHeader';
import styles from './styles.module.scss';

interface Props {
  isOnline: boolean;
  isStaging: boolean;
  isMobile: boolean;
  currentStepIndex: number;
  goToNextStep(): void;
  goToPrevStep(): void;
  isLastStep: boolean;
  templateName: string;
  isDisableNext: boolean;
  isValidForm: boolean;
}

const Header: FunctionComponent<Props> = ({
  isOnline,
  isStaging,
  isMobile,
  currentStepIndex,
  goToNextStep,
  goToPrevStep,
  isLastStep,
  templateName,
  isDisableNext,
  isValidForm
}) => {
  // Mobile Header right actions buttons
  const mobileHeaderActions = (headStyle) => (
    <>
      {isLastStep ? (
        <button
          className={headStyle.header__button}
          data-testid="templateEdit-header-save"
          disabled={!isValidForm}
        >
          Save
        </button>
      ) : (
        <button
          className={headStyle.header__button}
          onClick={goToNextStep}
          data-testid="templateEdit-header-next"
          disabled={isDisableNext}
        >
          Next
        </button>
      )}
    </>
  );

  // Mobile Header left actions buttons
  const mobileHeaderLeftAction = (headStyle) => (
    <>
      {currentStepIndex === 0 ? (
        <LinkFeature
          href="/templates"
          featureEnabled={features.supportBetaTemplatesList}
          className={headStyle.header__button}
          data-testid="templateEdit-header-cancel"
        >
          Cancel
        </LinkFeature>
      ) : (
        <button
          className={headStyle.header__button}
          onClick={goToPrevStep}
          data-testid="templateEdit-header-back"
        >
          Back
        </button>
      )}
    </>
  );

  const BreadCrumbs = () => (
    <>
      <div className={styles.header__breadcrumbs}>
        <Link href="/templates">
          <a className={styles.header__link}>Templates</a>
        </Link>
        <span title={templateName} className={styles.header__text}>
          &nbsp;&nbsp;/&nbsp;&nbsp; {templateName}
        </span>
      </div>
      <div className={styles.header__title}>Edit Template</div>
    </>
  );

  return (
    <>
      {isMobile ? (
        <>
          <MobileHeader
            isOnline={isOnline}
            left={mobileHeaderLeftAction}
            isStaging={isStaging}
            title="Edit Template"
            actions={mobileHeaderActions}
          />
        </>
      ) : (
        <DesktopHeader
          title={<BreadCrumbs />}
          isOnline={isOnline}
          isColumnTitle
        />
      )}
    </>
  );
};

Header.defaultProps = {};

export default Header;
