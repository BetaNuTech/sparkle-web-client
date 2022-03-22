import { FunctionComponent } from 'react';

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

const TEMPLATE_TYPES = inspectionConfig.inspectionTemplateTypes;
const ITEM_VALUES_KEYS = inspectionConfig.itemValuesKeys;
const INPUT_ITEM_TYPES = Object.keys(TEMPLATE_TYPES);

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
  template,
  templateCategories,
  unpublishedUpdates,
  forceVisible
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
    removeSection,
    addItem,
    updateItemType,
    updateItemMainInputType,
    updateItemTitle,
    updatePhotosValue,
    updateNotesValue,
    updateScore,
    updateItemIndex,
    removeItem
  } = useUpdateTemplate(template.id, unpublishedUpdates, template);

  const { templateSectionItems } = useTemplateSectionItems(template, updates);

  const sections = deepmerge(template.sections || {}, updates.sections || {});

  // sort sections by index
  const sortedSections = Object.keys(sections)
    .filter((id) => sections[id])
    .map((id) => ({ id, ...sections[id] }))
    .sort(({ index: aIndex }, { index: bIndex }) => aIndex - bIndex);

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
        template={updatedTemplate}
        templateCategories={templateCategories}
        templateSectionItems={templateSectionItems}
        sortedSections={sortedSections}
        forceVisible={forceVisible}
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
        removeSection={removeSection}
        addItem={addItem}
        onUpdateItemType={onUpdateItemType}
        onChangeMainInputType={onChangeMainInputType}
        updateItemTitle={updateItemTitle}
        onUpdateNotesValue={onUpdateNotesValue}
        onUpdatePhotosValue={onUpdatePhotosValue}
        onUpdateScore={onUpdateScore}
        updateItemIndex={updateItemIndex}
        removeItem={removeItem}
      />
    </>
  );
};

export default TemplateEdit;
