import { FunctionComponent } from 'react';
import TemplateModel from '../../../../common/models/template';
import TemplateCategoryModel from '../../../../common/models/templateCategory';
import TemplateItemModel from '../../../../common/models/inspectionTemplateItem';
import TemplateSectionModel from '../../../../common/models/inspectionTemplateSection';
import General from './General';
import Sections from './Sections';
import SectionItems from './SectionItems';
import Items from './Items';
import ItemValues from './ItemValues';

interface Props {
  step: string;
  template: TemplateModel;
  templateCategories: TemplateCategoryModel[];
  templateSectionItems: Map<string, TemplateItemModel[]>;
  forceVisible?: boolean;
  sortedSections: TemplateSectionModel[];
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
  removeSection(sectionId: string): void;
  addItem(sectionId: string, itemType: string): void;
  onUpdateItemType(item: TemplateItemModel): void;
  onChangeMainInputType(item: TemplateItemModel): void;
  updateItemTitle(itemId: string, title: string): void;
  onUpdatePhotosValue(item: TemplateItemModel): void;
  onUpdateNotesValue(item: TemplateItemModel): void;
  errors: Record<string, string>;
  onUpdateScore(itemId: string, selectedInput: number, score: number): void;
  updateItemIndex(itemId: string, index: number): void;
  removeItem(itemId: string): void;
}

const EditSteps: FunctionComponent<Props> = ({
  step,
  template,
  templateCategories,
  templateSectionItems,
  sortedSections,
  forceVisible,
  updateName,
  updateDescription,
  updateCategory,
  updateTrackDeficientItems,
  updateRequireDeficientItemNoteAndPhoto,
  addSection,
  updateSectionTitle,
  updateSectionIndex,
  onUpdateSectionType,
  removeSection,
  addItem,
  onUpdateItemType,
  onChangeMainInputType,
  updateItemTitle,
  onUpdatePhotosValue,
  onUpdateNotesValue,
  errors,
  onUpdateScore,
  updateItemIndex,
  removeItem
}) => {
  switch (step) {
    case 'sections':
      return (
        <Sections
          forceVisible={forceVisible}
          addSection={addSection}
          sortedSections={sortedSections}
          updateSectionTitle={updateSectionTitle}
          onUpdateSectionType={onUpdateSectionType}
          errors={errors}
          updateSectionIndex={updateSectionIndex}
          removeSection={removeSection}
        />
      );
    case 'section-items':
      return (
        <SectionItems
          sortedSections={sortedSections}
          templateSectionItems={templateSectionItems}
          forceVisible={forceVisible}
          addItem={addItem}
          onUpdateItemType={onUpdateItemType}
          updateItemTitle={updateItemTitle}
          errors={errors}
          updateItemIndex={updateItemIndex}
          removeItem={removeItem}
        />
      );
    case 'items':
      return (
        <Items
          sortedSections={sortedSections}
          templateSectionItems={templateSectionItems}
          forceVisible={forceVisible}
          onChangeMainInputType={onChangeMainInputType}
          onUpdatePhotosValue={onUpdatePhotosValue}
          onUpdateNotesValue={onUpdateNotesValue}
        />
      );
    case 'item-values':
      return (
        <ItemValues
          sortedSections={sortedSections}
          templateSectionItems={templateSectionItems}
          forceVisible={forceVisible}
          onUpdateScore={onUpdateScore}
        />
      );
    default:
      return (
        <General
          template={template}
          templateCategories={templateCategories}
          updateName={updateName}
          updateDescription={updateDescription}
          updateCategory={updateCategory}
          updateTrackDeficientItems={updateTrackDeficientItems}
          updateRequireDeficientItemNoteAndPhoto={
            updateRequireDeficientItemNoteAndPhoto
          }
          errors={errors}
        />
      );
  }
};

export default EditSteps;
