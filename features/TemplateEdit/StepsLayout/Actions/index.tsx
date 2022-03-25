/* eslint-disable import/no-unresolved */
import { FunctionComponent } from 'react';
import clsx from 'clsx';

import LinkFeature from '../../../../common/LinkFeature';
import features from '../../../../config/features';

import styles from './styles.module.scss';

interface Props {
  currentStepIndex: number;
  goToNextStep(): void;
  goToPrevStep(): void;
  isLastStep: boolean;
  isValidForm: boolean;
  onSave(): void;
  isLoading: boolean;
  hasUpdates: boolean;
}

const StepsLayoutActions: FunctionComponent<Props> = ({
  currentStepIndex,
  goToNextStep,
  goToPrevStep,
  isLastStep,
  isValidForm,
  onSave,
  isLoading,
  hasUpdates
}) => (
  <div className={styles.actions}>
    {currentStepIndex === 0 ? (
      <LinkFeature
        href="/templates"
        featureEnabled={features.supportBetaTemplatesList}
        className={clsx(
          styles.actions__button,
          styles['actions__button--white']
        )}
        data-testid="StepsLayout-cancel"
        disabled={isLoading}
      >
        Cancel
      </LinkFeature>
    ) : (
      <button
        className={clsx(
          styles.actions__button,
          styles['actions__button--dark']
        )}
        onClick={goToPrevStep}
        data-testid="StepsLayout-previous-step"
        disabled={isLoading}
      >
        Previous Step
      </button>
    )}
    {isLastStep ? (
      <button
        className={styles.actions__button}
        data-testid="StepsLayout-save"
        disabled={!isValidForm || isLoading || !hasUpdates}
        onClick={onSave}
      >
        Save
      </button>
    ) : (
      <button
        className={styles.actions__button}
        onClick={goToNextStep}
        data-testid="StepsLayout-next-step"
        disabled={isLoading}
      >
        Next Step
      </button>
    )}
  </div>
);

export default StepsLayoutActions;
