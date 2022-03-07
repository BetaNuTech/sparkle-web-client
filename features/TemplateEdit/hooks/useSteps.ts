import { useMemo } from 'react';
import { useRouter } from 'next/router';

const steps = ['general', 'sections', 'section-items', 'items', 'item-values'];

interface Result {
  steps: string[];
  currentStepIndex: number;
  isLastStep: boolean;
  changeStep(stepIndex: number): void;
  goToNextStep(): void;
  goToPrevStep(): void;
}

export default function useSteps(): Result {
  const router = useRouter();
  const { step } = router?.query;

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

  return {
    steps,
    currentStepIndex,
    isLastStep,
    changeStep,
    goToNextStep,
    goToPrevStep
  };
}
