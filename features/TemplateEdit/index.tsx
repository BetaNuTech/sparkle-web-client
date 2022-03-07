import { FunctionComponent, useMemo } from 'react';
import { useRouter } from 'next/router';

import { useMediaQuery } from 'react-responsive';
import TemplateModel from '../../common/models/template';
import TemplateCategoryModel from '../../common/models/templateCategory';
import UserModel from '../../common/models/user';
import breakpoints from '../../config/breakpoints';
import Header from './Header';
import TemplateStepper from './Stepper';

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

const steps = ['general', 'sections', 'section-items', 'items', 'item-values'];

const TemplateEdit: FunctionComponent<Props> = ({ isOnline, isStaging }) => {
  // Responsive queries
  const isMobile = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });

  const router = useRouter();
  const { step } = router.query;

  // get current step and if there is not step
  // set it default to general step
  const currentStep = step && (typeof step === 'string' ? step : step[0]);
  if (!currentStep) {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, step: 'general' }
    });
  }

  // getting current step index
  // based on current step.
  const currentStepIndex = useMemo(() => {
    const stepIndex = steps.indexOf(currentStep);
    return stepIndex > -1 ? stepIndex : 0;
  }, [currentStep]);

  const isLastStep = useMemo(
    () => currentStepIndex + 1 === steps.length,
    [currentStepIndex]
  );

  // push step in route query params
  // based on selected index.
  const changeStep = (stepIndex: number) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, step: steps[stepIndex] }
    });
  };

  const goToNextStep = () => {
    changeStep(currentStepIndex + 1);
  };

  const goToPrevStep = () => {
    changeStep(currentStepIndex - 1);
  };

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
      />
      <TemplateStepper
        currentStepIndex={currentStepIndex}
        isMobile={isMobile}
        steps={steps}
        changeStep={changeStep}
      />
    </>
  );
};

export default TemplateEdit;
