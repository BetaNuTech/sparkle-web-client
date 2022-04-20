/* eslint-disable import/no-unresolved */
import { FunctionComponent, RefObject, useEffect, useState } from 'react';
import clsx from 'clsx';

import { SwiperSlide, Swiper } from 'swiper/react';
import TemplateModel from '../../../common/models/template';
import TemplateCategoryModel from '../../../common/models/templateCategory';
import TemplateItemModel from '../../../common/models/inspectionTemplateItem';
import TemplateSectionModel from '../../../common/models/inspectionTemplateSection';
import Actions from './Actions';
import EditSteps from './EditSteps';

import styles from './styles.module.scss';

// Import Swiper styles
import 'swiper/swiper.min.css';

interface Props {
  currentStepIndex: number;
  isMobile: boolean;
  steps: string[];
  onChangeStep(index: number): void;
  goToNextStep(): void;
  goToPrevStep(): void;
  isLastStep: boolean;
  template: TemplateModel;
  templateCategories: TemplateCategoryModel[];
  templateSectionItems: Map<string, TemplateItemModel[]>;
  sections: TemplateSectionModel[];
  updateName(name: string): void;
  updateDescription(description: string): void;
  updateCategory(category: string): void;
  updateTrackDeficientItems(trackDeficientItems: boolean): void;
  updateRequireDeficientItemNoteAndPhoto(
    requireDeficientItemNoteAndPhoto: boolean
  ): void;
  addSection(): void;
  updateSectionTitle(sectionId: string, title: string): void;
  onUpdateSectionType(section: TemplateSectionModel): void;
  updateSectionIndex(sectionId: string, index: number): void;
  onRemoveSection(sectionId: string): void;
  addItem(sectionId: string, itemType: string): void;
  onUpdateItemType(item: TemplateItemModel): void;
  onChangeMainInputType(item: TemplateItemModel): void;
  updateItemTitle(itemId: string, title: string): void;
  onUpdatePhotosValue(item: TemplateItemModel): void;
  onUpdateNotesValue(item: TemplateItemModel): void;
  onSelectSections(sectionId: string): void;
  selectedSections: string[];
  onDeleteSections(sectionIds: string[]): void;
  errors: Record<string, string>;
  isValidForm: boolean;
  onUpdateScore(itemId: string, selectedInput: number, score: number): void;
  updateItemIndex(itemId: string, index: number): void;
  selectedItems: Record<string, string[]>;
  onSelectItems(sectionId: string, itemId: string): void;
  onDeleteItems(sectionId: string): void;
  onDeleteItem(item: TemplateItemModel): void;
  onSave(): void;
  isLoading: boolean;
  hasUpdates: boolean;
  initialSlide?: number;
  sectionInputRefs: RefObject<HTMLParagraphElement[]>;
  itemInputRefs: RefObject<HTMLParagraphElement[]>;
}

const StepsLayout: FunctionComponent<Props> = ({
  currentStepIndex,
  isMobile,
  steps,
  onChangeStep,
  goToNextStep,
  goToPrevStep,
  isLastStep,
  templateCategories,
  template,
  templateSectionItems,
  sections,
  updateName,
  updateDescription,
  updateCategory,
  updateTrackDeficientItems,
  updateRequireDeficientItemNoteAndPhoto,
  addSection,
  updateSectionTitle,
  onUpdateSectionType,
  updateSectionIndex,
  onRemoveSection,
  addItem,
  onUpdateItemType,
  onChangeMainInputType,
  updateItemTitle,
  onUpdatePhotosValue,
  onUpdateNotesValue,
  onSelectSections,
  selectedSections,
  onDeleteSections,
  errors,
  isValidForm,
  onUpdateScore,
  updateItemIndex,
  selectedItems,
  onSelectItems,
  onDeleteItems,
  onDeleteItem,
  onSave,
  isLoading,
  hasUpdates,
  initialSlide,
  sectionInputRefs,
  itemInputRefs
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
  }, [currentStepIndex, swiperInstance, swiperInstance?.activeIndex]);

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.swiper}>
          <Swiper
            slidesPerView={1}
            onSwiper={setSwiperInstance}
            onSlideChange={(swiper) => onChangeStep(swiper.activeIndex)}
            allowTouchMove={isMobile}
            shortSwipes={false}
            longSwipesMs={0}
            longSwipesRatio={0.1}
            allowSlidePrev={swiperInstance?.activeIndex !== 0}
            allowSlideNext={swiperInstance?.activeIndex !== steps.length - 1}
            initialSlide={initialSlide || 0}
            preventClicks={false}
            noSwiping={true} // eslint-disable-line react/jsx-boolean-value
            noSwipingClass="template-edit-drag-handle"
            simulateTouch={false}
          >
            {steps.map((step, index) => (
              <SwiperSlide key={step}>
                <div className={styles.stepContainer}>
                  {((swiperInstance?.activeIndex || 0) === index ||
                    isMobile) && (
                    <EditSteps
                      step={step}
                      templateCategories={templateCategories}
                      template={template}
                      templateSectionItems={templateSectionItems}
                      sections={sections}
                      updateName={updateName}
                      updateDescription={updateDescription}
                      updateCategory={updateCategory}
                      updateTrackDeficientItems={updateTrackDeficientItems}
                      updateRequireDeficientItemNoteAndPhoto={
                        updateRequireDeficientItemNoteAndPhoto
                      }
                      addSection={addSection}
                      updateSectionTitle={updateSectionTitle}
                      onUpdateSectionType={onUpdateSectionType}
                      onRemoveSection={onRemoveSection}
                      addItem={addItem}
                      onUpdateItemType={onUpdateItemType}
                      onChangeMainInputType={onChangeMainInputType}
                      updateItemTitle={updateItemTitle}
                      updateSectionIndex={updateSectionIndex}
                      onUpdatePhotosValue={onUpdatePhotosValue}
                      onUpdateNotesValue={onUpdateNotesValue}
                      onSelectSections={onSelectSections}
                      selectedSections={selectedSections}
                      onDeleteSections={onDeleteSections}
                      errors={errors}
                      onUpdateScore={onUpdateScore}
                      updateItemIndex={updateItemIndex}
                      selectedItems={selectedItems}
                      onSelectItems={onSelectItems}
                      onDeleteItems={onDeleteItems}
                      onDeleteItem={onDeleteItem}
                      sectionInputRefs={sectionInputRefs}
                      itemInputRefs={itemInputRefs}
                    />
                  )}
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
            isValidForm={isValidForm}
            onSave={onSave}
            isLoading={isLoading}
            hasUpdates={hasUpdates}
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
