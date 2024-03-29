import { RefObject, useRef, FunctionComponent, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import TemplateModel from '../../common/models/template';
import TemplateCategoryModel from '../../common/models/templateCategory';
import TemplateItemModel from '../../common/models/inspectionTemplateItem';
import TemplateSectionModel from '../../common/models/inspectionTemplateSection';
import UserModel from '../../common/models/user';
import breakpoints from '../../config/breakpoints';
import Header from './Header';
import StepsLayout from './StepsLayout';
import useSteps from './hooks/useSteps';
import useTemplateSectionItems from './hooks/useTemplateSectionItems';
import useUpdateTemplate from './hooks/useUpdateTemplate';
import deepmerge from '../../common/utils/deepmerge';
import inspectionConfig from '../../config/inspections';
import SectionDeletePrompt from './SectionDeletePrompt';
import useValidateTemplate from './hooks/useValidateTemplate';

const TEMPLATE_TYPES = inspectionConfig.inspectionTemplateTypes;
const ITEM_VALUES_KEYS = inspectionConfig.itemValuesKeys;
const INPUT_ITEM_TYPES = Object.keys(TEMPLATE_TYPES);

type UserNotifications = (message: string, options?: any) => any;
interface Props {
  user: UserModel;
  template: TemplateModel;
  unpublishedUpdates: TemplateModel;
  templateCategories: TemplateCategoryModel[];
  isOnline?: boolean;
  isStaging?: boolean;
  hideBreadcrumbs?: boolean;
  toggleNavOpen?(): void;
  sendNotification: UserNotifications;
  initialSlide?: number;
}

const TemplateEdit: FunctionComponent<Props> = ({
  isOnline,
  isStaging,
  template,
  templateCategories,
  unpublishedUpdates,
  sendNotification,
  initialSlide,
  hideBreadcrumbs
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

  const {
    updates,
    hasUpdates,
    updateName,
    updateDescription,
    updateCategory,
    updateTrackDeficientItems,
    updateRequireDeficientItemNoteAndPhoto,
    addSection,
    updateSectionTitle,
    updateSectionType,
    updateSectionIndex,
    addItem,
    updateItemType,
    updateItemMainInputType,
    updateItemTitle,
    updatePhotosValue,
    updateNotesValue,
    updateScore,
    updateItemIndex,
    onSelectItems,
    onDeleteItems,
    onDeleteItem,
    selectedItems,
    selectedSections,
    onSelectSections,
    deletingSection,
    setDeletingSection,
    isVisibleSectionDeletePrompt,
    setIsVisibleSectionDeletePrompt,
    onConfirmDeleteSections,
    onCancelDeleteSection,
    updateTemplate,
    isLoading
  } = useUpdateTemplate(
    template.id,
    unpublishedUpdates,
    template,
    sendNotification
  );

  const {
    setErrorMessages,
    errors,
    stepsStatus,
    isValidForm,
    invalidSections,
    invalidItems
  } = useValidateTemplate(updates, template, sendNotification);

  const { templateSectionItems } = useTemplateSectionItems(template, updates);

  const sections = deepmerge(template.sections || {}, updates.sections || {});

  // sort sections by index
  const sortedSections = Object.keys(sections)
    .filter((id) => sections[id])
    .map((id) => ({ id, ...sections[id] }))
    .sort(({ index: aIndex }, { index: bIndex }) => aIndex - bIndex);

  const filteredSections = sortedSections.filter(
    (section) => section.id !== deletingSection
  );

  const updatedTemplate = { ...template, ...updates };

  const onUpdateSectionType = (section: TemplateSectionModel) => {
    updateSectionType(
      section.id,
      section.section_type === 'single' ? 'multi' : 'single'
    );
  };

  const onChangeMainInputType = (item: TemplateItemModel) => {
    const type = item.mainInputType.toLowerCase();
    const nextIndex = INPUT_ITEM_TYPES.indexOf(type) + 1;
    const targetIndex = INPUT_ITEM_TYPES[nextIndex] || INPUT_ITEM_TYPES[0];
    const updatedMainInputType = TEMPLATE_TYPES[targetIndex];
    updateItemMainInputType(item.id, updatedMainInputType);
  };
  const onUpdateItemType = (item: TemplateItemModel) => {
    const type = (item.itemType || '').toLowerCase();

    let updatedItemType = '';
    if (type === 'text_input') {
      // Configure signature item
      updatedItemType = 'signature';
    } else if (type === 'signature') {
      // Configure main item
      updatedItemType = 'main';
    } else {
      // Configure text item
      updatedItemType = 'text_input';
    }
    updateItemType(item.id, updatedItemType);
  };

  const onUpdateNotesValue = (item: TemplateItemModel) => {
    updateNotesValue(item.id, !item.notes);
  };
  const onUpdatePhotosValue = (item: TemplateItemModel) => {
    updatePhotosValue(item.id, !item.photos);
  };

  const onUpdateScore = (
    itemId: string,
    selectedInput: number,
    score: number
  ) => {
    updateScore(
      itemId,
      `mainInput${ITEM_VALUES_KEYS[selectedInput]}Value`,
      score
    );
  };

  const onDeleteSections = (sectionIds: string[]) => {
    const hasItems = sectionIds.some((id) => templateSectionItems.get(id));
    if (hasItems) {
      setIsVisibleSectionDeletePrompt(true);
    } else {
      onConfirmDeleteSections(sectionIds);
    }
  };

  const onRemoveSection = (sectionId: string) => {
    setDeletingSection(sectionId);
    onDeleteSections([sectionId]);
  };

  const onSave = () => {
    updateTemplate();
  };

  // Setup element references for
  // validation error focusing
  const sectionInputRefs: RefObject<HTMLParagraphElement[]> = useRef([]);
  const itemInputRefs: RefObject<HTMLParagraphElement[]> = useRef([]);

  // Focus on first invalid section or item
  const focusOnInput = (stepIndex: number) => {
    if (sectionInputRefs.current.length && stepIndex === 1) {
      sectionInputRefs.current
        .find((section) => section?.id === invalidSections[0])
        ?.focus();
    }

    if (itemInputRefs.current.length && stepIndex === 2) {
      itemInputRefs.current
        .filter((item) => invalidItems.indexOf(item?.id) > -1)[0]
        .focus();
    }
  };

  // Get index of the first invalid step
  const getInvalidSetupIndex = () =>
    steps.findIndex((step) => stepsStatus[step] === 'invalid');

  const onGoToNext = () => {
    const invalidStepIndex = getInvalidSetupIndex();

    // Prevent going to next step when
    // invalid, instead set error labels
    // and focus on first errored field
    if (invalidStepIndex > -1 && currentStepIndex === invalidStepIndex) {
      setErrorMessages();
      focusOnInput(invalidStepIndex);
    } else {
      goToNextStep();
    }
  };

  const onChangeStep = (stepIndex: number) => {
    const invalidStepIndex = getInvalidSetupIndex();

    // Prevent going to requested step
    // instead set error labels and focus
    // on first errored field
    if (
      invalidStepIndex > -1 &&
      currentStepIndex === invalidStepIndex &&
      stepIndex > currentStepIndex
    ) {
      setErrorMessages();
      focusOnInput(invalidStepIndex);
    } else {
      changeStep(stepIndex);
    }
  };

  // check validation for steps
  // and redirect to invalid step
  useEffect(() => {
    const invalidStepIndex = getInvalidSetupIndex();

    if (invalidStepIndex > -1 && currentStepIndex > invalidStepIndex) {
      setErrorMessages();
      changeStep(invalidStepIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepIndex]);

  return (
    <>
      <Header
        isOnline={isOnline}
        isStaging={isStaging}
        isMobile={isMobile}
        goToNextStep={onGoToNext}
        goToPrevStep={goToPrevStep}
        currentStepIndex={currentStepIndex}
        isLastStep={isLastStep}
        templateName={template.name}
        isValidForm={isValidForm}
        hideBreadcrumbs={hideBreadcrumbs}
        onSave={onSave}
        isLoading={isLoading}
        hasUpdates={hasUpdates}
      />
      <StepsLayout
        currentStepIndex={currentStepIndex}
        isMobile={isMobile}
        steps={steps}
        onChangeStep={onChangeStep}
        goToNextStep={onGoToNext}
        goToPrevStep={goToPrevStep}
        isLastStep={isLastStep}
        template={updatedTemplate}
        templateCategories={templateCategories}
        templateSectionItems={templateSectionItems}
        sections={filteredSections}
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
        updateSectionIndex={updateSectionIndex}
        onRemoveSection={onRemoveSection}
        addItem={addItem}
        onUpdateItemType={onUpdateItemType}
        onChangeMainInputType={onChangeMainInputType}
        updateItemTitle={updateItemTitle}
        onUpdateNotesValue={onUpdateNotesValue}
        onUpdatePhotosValue={onUpdatePhotosValue}
        onSelectSections={onSelectSections}
        selectedSections={selectedSections}
        onDeleteSections={onDeleteSections}
        errors={errors}
        isValidForm={isValidForm}
        onUpdateScore={onUpdateScore}
        updateItemIndex={updateItemIndex}
        selectedItems={selectedItems}
        onSelectItems={onSelectItems}
        onDeleteItems={onDeleteItems}
        onDeleteItem={onDeleteItem}
        onSave={onSave}
        isLoading={isLoading}
        hasUpdates={hasUpdates}
        initialSlide={initialSlide}
        sectionInputRefs={sectionInputRefs}
        itemInputRefs={itemInputRefs}
      />
      <SectionDeletePrompt
        isVisible={isVisibleSectionDeletePrompt}
        onClose={onCancelDeleteSection}
        onConfirm={onConfirmDeleteSections}
        templateSectionItems={templateSectionItems}
        sortedSections={sortedSections}
        selectedSections={selectedSections}
        deletingSection={deletingSection}
      />
    </>
  );
};

TemplateEdit.defaultProps = {
  hideBreadcrumbs: false
};

export default TemplateEdit;
