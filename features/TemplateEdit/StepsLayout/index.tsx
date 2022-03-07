/* eslint-disable import/no-unresolved */
import { FunctionComponent, useEffect, useState } from 'react';
import clsx from 'clsx';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Controller, A11y } from 'swiper';
import TemplateModel from '../../../common/models/template';
import TemplateCategoryModel from '../../../common/models/templateCategory';
import Actions from './Actions';
import EditSteps from './EditSteps';

import styles from './styles.module.scss';

// Import Swiper styles
import 'swiper/css';

interface Props {
  currentStepIndex: number;
  isMobile: boolean;
  steps: string[];
  changeStep(index: number): void;
  goToNextStep(): void;
  goToPrevStep(): void;
  isLastStep: boolean;
  template: TemplateModel;
  templateCategories: TemplateCategoryModel[];
}

const StepsLayout: FunctionComponent<Props> = ({
  currentStepIndex,
  isMobile,
  steps,
  changeStep,
  goToNextStep,
  goToPrevStep,
  isLastStep,
  templateCategories,
  template
}) => {
  // Reference to the internal Swiper instance
  const [swiperInstance, setSwiperInstance] = useState(null);

  // On external change of current step index
  // it will update swiper to the new index
  useEffect(() => {
    if (swiperInstance && swiperInstance.activeIndex !== currentStepIndex) {
      swiperInstance.slideTo(currentStepIndex, isMobile ? 300 : 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepIndex, swiperInstance]);

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.swiper}>
          <Swiper
            // install Swiper modules
            modules={[Controller, A11y]}
            slidesPerView={1}
            onSwiper={setSwiperInstance}
            onSlideChange={(swiper) => changeStep(swiper.activeIndex)}
            allowTouchMove={isMobile}
          >
            {steps.map((step) => (
              <SwiperSlide key={step}>
                <div className={styles.stepContainer}>
                  <EditSteps
                    step={step}
                    templateCategories={templateCategories}
                    template={template}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {!isMobile && (
          <Actions
            goToNextStep={goToNextStep}
            goToPrevStep={goToPrevStep}
            isLastStep={isLastStep}
            currentStepIndex={currentStepIndex}
          />
        )}
      </div>
      <ul className={styles.pagination}>
        {steps.map((step, index) => (
          <li
            key={step}
            className={clsx(
              styles.pagination__item,
              index === currentStepIndex && styles['pagination__item--active']
            )}
          ></li>
        ))}
        <li className={styles.pagination__summary}>
          step {currentStepIndex + 1} of {steps.length}
        </li>
      </ul>
    </div>
  );
};

export default StepsLayout;
