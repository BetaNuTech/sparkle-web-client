import { FunctionComponent } from 'react';
import propertyModel from '../../../common/models/property';
import inspectionTemplateSectionModel from '../../../common/models/inspectionTemplateSection';
import inspectionTemplateItemModel from '../../../common/models/inspectionTemplateItem';
import unPublishedPhotoDataModel from '../../../common/models/inspections/templateItemUnpublishedPhotoData';
import Sections from './Sections';
import unpublishedSignatureModel from '../../../common/models/inspections/templateItemUnpublishedSignature';

interface Props {
  property: propertyModel;
  templateSections: Array<inspectionTemplateSectionModel>;
  collapsedSections: Array<string>;
  onSectionCollapseToggle(section: inspectionTemplateSectionModel): void;
  onInputChange(
    event:
      | React.MouseEvent<HTMLLIElement>
      | React.ChangeEvent<HTMLInputElement>,
    item: inspectionTemplateItemModel,
    value: string | number
  ): void;
  sectionItems: Map<string, inspectionTemplateItemModel[]>;
  onClickOneActionNotes(item: inspectionTemplateItemModel): void;
  onAddSection(
    event: React.MouseEvent<HTMLButtonElement>,
    sectionId: string
  ): void;
  onRemoveSection(
    event: React.MouseEvent<HTMLButtonElement>,
    sectionId: string
  ): void;
  onItemIsNAChange(itemId: string, isItemNA: boolean): void;
  onClickAttachmentNotes(item: inspectionTemplateItemModel): void;
  onClickSignatureInput(item: inspectionTemplateItemModel): void;
  onClickPhotos(item: inspectionTemplateItemModel): void;
  forceVisible: boolean;
  inspectionItemsPhotos: Map<string, unPublishedPhotoDataModel[]>;
  inspectionItemsSignature: Map<string, unpublishedSignatureModel[]>;
  canEdit: boolean;
}

// Mobile layout
const MobileLayout: FunctionComponent<Props> = ({
  property,
  templateSections,
  collapsedSections,
  onSectionCollapseToggle,
  onClickOneActionNotes,
  onInputChange,
  sectionItems,
  onAddSection,
  onRemoveSection,
  onItemIsNAChange,
  onClickAttachmentNotes,
  onClickSignatureInput,
  onClickPhotos,
  forceVisible,
  inspectionItemsPhotos,
  inspectionItemsSignature,
  canEdit
}) => (
  <>
    <Sections
      propertyId={property.id}
      sections={templateSections}
      collapsedSections={collapsedSections}
      onSectionCollapseToggle={onSectionCollapseToggle}
      onInputChange={onInputChange}
      onClickOneActionNotes={onClickOneActionNotes}
      sectionItems={sectionItems}
      onAddSection={onAddSection}
      onRemoveSection={onRemoveSection}
      onItemIsNAChange={onItemIsNAChange}
      onClickAttachmentNotes={onClickAttachmentNotes}
      onClickSignatureInput={onClickSignatureInput}
      onClickPhotos={onClickPhotos}
      forceVisible={forceVisible}
      inspectionItemsPhotos={inspectionItemsPhotos}
      inspectionItemsSignature={inspectionItemsSignature}
      canEdit={canEdit}
    />
  </>
);

MobileLayout.defaultProps = {};

export default MobileLayout;
