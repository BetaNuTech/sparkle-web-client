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
  onUpdateScore(itemId: string, selectedInput: number, score: number): void;
  updateItemIndex(itemId: string, index: number): void;
  removeItem(itemId: string): void;
  selectedItems: Record<string, string[]>;
  onSelectItems(sectionId: string, itemId: string): void;
  onDeleteItems(sectionId: string): void;
}

const EditSteps: FunctionComponent<Props> = ({
  step,
  template,
  templateCategories,
  templateSectionItems,
  sections,
  updateName,
  updateDescription,
  updateCategory,
  updateTrackDeficientItems,
  updateRequireDeficientItemNoteAndPhoto,
  addSection,
  updateSectionTitle,
  updateSectionIndex,
  onUpdateSectionType,
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
  onUpdateScore,
  updateItemIndex,
  removeItem,
  selectedItems,
  onSelectItems,
  onDeleteItems
}) => {
  switch (step) {
    case 'sections':
      return (
        <Sections
          addSection={addSection}
          sections={sections}
          updateSectionTitle={updateSectionTitle}
          onUpdateSectionType={onUpdateSectionType}
          onSelectSections={onSelectSections}
          selectedSections={selectedSections}
          onDeleteSections={onDeleteSections}
          errors={errors}
          updateSectionIndex={updateSectionIndex}
          onRemoveSection={onRemoveSection}
        />
      );
    case 'section-items':
      return (
        <SectionItems
          sections={sections}
          templateSectionItems={templateSectionItems}
          addItem={addItem}
          onUpdateItemType={onUpdateItemType}
          updateItemTitle={updateItemTitle}
          errors={errors}
          updateItemIndex={updateItemIndex}
          removeItem={removeItem}
          selectedItems={selectedItems}
          onSelectItems={onSelectItems}
          onDeleteItems={onDeleteItems}
        />
      );
    case 'items':
      return (
        <Items
          sections={sections}
          templateSectionItems={templateSectionItems}
          onChangeMainInputType={onChangeMainInputType}
          onUpdatePhotosValue={onUpdatePhotosValue}
          onUpdateNotesValue={onUpdateNotesValue}
        />
      );
    case 'item-values':
      return (
        <ItemValues
          sections={sections}
          templateSectionItems={templateSectionItems}
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
