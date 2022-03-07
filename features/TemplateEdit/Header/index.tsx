import { FunctionComponent } from 'react';
import MobileHeader from '../../../common/MobileHeader';
import LinkFeature from '../../../common/LinkFeature';
import features from '../../../config/features';

interface Props {
  isOnline: boolean;
  isStaging: boolean;
  isMobile: boolean;
  currentStepIndex: number;
  goToNextStep(): void;
  goToPrevStep(): void;
  isLastStep: boolean;
}

const Header: FunctionComponent<Props> = ({
  isOnline,
  isStaging,
  isMobile,
  currentStepIndex,
  goToNextStep,
  goToPrevStep,
  isLastStep
}) => {
  // Mobile Header right actions buttons
  const mobileHeaderActions = (headStyle) => (
    <>
      {isLastStep ? (
        <button className={headStyle.header__button}>Save</button>
      ) : (
        <button className={headStyle.header__button} onClick={goToNextStep}>
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
        >
          Cancel
        </LinkFeature>
      ) : (
        <button className={headStyle.header__button} onClick={goToPrevStep}>
          Back
        </button>
      )}
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
        <div>Desktop Header will go here</div>
      )}
    </>
  );
};

Header.defaultProps = {};

export default Header;
