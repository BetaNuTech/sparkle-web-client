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
}

const StepsLayoutActions: FunctionComponent<Props> = ({
  currentStepIndex,
  goToNextStep,
  goToPrevStep,
  isLastStep
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
      >
        Previous Step
      </button>
    )}
    {isLastStep ? (
      <button className={styles.actions__button} data-testid="StepsLayout-save">
        Save
      </button>
    ) : (
      <button
        className={styles.actions__button}
        onClick={goToNextStep}
        data-testid="StepsLayout-next-step"
      >
        Next Step
      </button>
    )}
  </div>
);

export default StepsLayoutActions;
