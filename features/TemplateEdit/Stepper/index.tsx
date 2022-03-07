/* eslint-disable import/no-unresolved */
import clsx from 'clsx';
import { FunctionComponent, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Controller, A11y } from 'swiper';

import 'swiper/css'; // required Swiper styles
import styles from './styles.module.scss';

interface Props {
  currentStepIndex: number;
  isMobile: boolean;
  steps: string[];
  changeStep(index: number): void;
}

const TemplateStepper: FunctionComponent<Props> = ({
  currentStepIndex,
  isMobile,
  steps,
  changeStep
}) => {
  // Reference to the internal Swiper instance
  const [swiperInstance, setSwiperInstance] = useState(null);

  // On external change of current step index
  // it will update swiper to the new index
  useEffect(() => {
    if (swiperInstance && swiperInstance.activeIndex !== currentStepIndex) {
      swiperInstance.slideTo(currentStepIndex);
    }
  }, [currentStepIndex, swiperInstance]);

  return (
    <div className={styles.container}>
      <div className={styles.swiper}>
        <Swiper
          // install Swiper modules
          modules={[Controller, A11y]}
          spaceBetween={50}
          slidesPerView={1}
          onSwiper={setSwiperInstance}
          onSlideChange={(swiper) => changeStep(swiper.activeIndex)}
          allowTouchMove={isMobile}
        >
          {steps.map((step) => (
            <SwiperSlide key={step}>{step}</SwiperSlide>
          ))}
        </Swiper>
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
      </ul>
    </div>
  );
};

export default TemplateStepper;
