import { FunctionComponent } from 'react';

import { useMediaQuery } from 'react-responsive';
import TemplateModel from '../../common/models/template';
import TemplateCategoryModel from '../../common/models/templateCategory';
import UserModel from '../../common/models/user';
import breakpoints from '../../config/breakpoints';
import Header from './Header';
import StepsLayout from './StepsLayout';
import useSteps from './hooks/useSteps';

interface Props {
  user: UserModel;
  template: TemplateModel;
  unpublishedUpdates: TemplateModel;
  templateCategories: TemplateCategoryModel[];
  forceVisible?: boolean;
  isOnline?: boolean;
  isStaging?: boolean;
  toggleNavOpen?(): void;
}

const TemplateEdit: FunctionComponent<Props> = ({
  isOnline,
  isStaging,
  template
}) => {
  // Responsive queries
  const isMobile = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });

  const {
    steps,
    currentStepIndex,
    isLastStep,
    changeStep,
    goToNextStep,
    goToPrevStep
  } = useSteps();

  return (
    <>
      <Header
        isOnline={isOnline}
        isStaging={isStaging}
        isMobile={isMobile}
        goToNextStep={goToNextStep}
        goToPrevStep={goToPrevStep}
        currentStepIndex={currentStepIndex}
        isLastStep={isLastStep}
        templateName={template.name}
      />
      <StepsLayout
        currentStepIndex={currentStepIndex}
        isMobile={isMobile}
        steps={steps}
        changeStep={changeStep}
        goToNextStep={goToNextStep}
        goToPrevStep={goToPrevStep}
        isLastStep={isLastStep}
      />
    </>
  );
};

export default TemplateEdit;
