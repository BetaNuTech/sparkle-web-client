import { FunctionComponent } from 'react';
import Link from 'next/link';
import propertyModel from '../../../common/models/property';
import inspectionModel from '../../../common/models/inspection';
import MobileHeader from '../../../common/MobileHeader';
import ChevronIcon from '../../../public/icons/ios/chevron.svg';
import FileUploadIcon from '../../../public/icons/sparkle/file-upload.svg';
import parentStyles from '../styles.module.scss';
import inspectionTemplateSectionModel from '../../../common/models/inspectionTemplateSection';
import inspectionTemplateItemModel from '../../../common/models/inspectionTemplateItem';
import Sections from './Sections';

interface Props {
  property: propertyModel;
  inspection: inspectionModel;
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
  onShareAction(): void;
  onSaveInspection(): void;
  isOnline?: boolean;
  isStaging?: boolean;
  hasUpdates?: boolean;
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
  onClickPhotos(item:inspectionTemplateItemModel):void;
  canEditInspection: boolean;
  onEnableAdminEditMode(): void;
  forceVisible: boolean;
}

// Mobile layout
const MobileLayout: FunctionComponent<Props> = ({
  property,
  inspection,
  onShareAction,
  templateSections,
  collapsedSections,
  onSectionCollapseToggle,
  onClickOneActionNotes,
  onInputChange,
  onSaveInspection,
  sectionItems,
  isOnline,
  isStaging,
  hasUpdates,
  onAddSection,
  onRemoveSection,
  onItemIsNAChange,
  onClickAttachmentNotes,
  onClickSignatureInput,
  onClickPhotos,
  canEditInspection,
  onEnableAdminEditMode,
  forceVisible
}) => {
  // Mobile Header actions buttons
  const mobileHeaderLeft = (headStyle) => (
    <>
      <Link href={`/properties/${property.id}/`}>
        <a className={headStyle.header__back}>
          <ChevronIcon />
          Property
        </a>
      </Link>
    </>
  );

  // Mobile Header actions buttons
  const mobileHeaderActions = (headStyle) => (
    <>
      <button
        type="button"
        className={headStyle.header__button}
        onClick={onShareAction}
      >
        Share
      </button>
      {canEditInspection && (
        <button
          type="button"
          className={headStyle.header__button}
          data-testid="header-edit-button"
          onClick={onEnableAdminEditMode}
        >
          Edit
        </button>
      )}

      <button
        type="button"
        className={headStyle.header__button}
        disabled={!inspection.inspectionCompleted}
        data-testid="header-complete-button"
      >
        <FileUploadIcon />
      </button>

      <button
        type="button"
        className={headStyle.header__button}
        disabled={!(hasUpdates && isOnline)}
        data-testid="header-save-button"
        onClick={onSaveInspection}
      >
        Save
      </button>
    </>
  );

  return (
    <>
      <MobileHeader
        isOnline={isOnline}
        isStaging={isStaging}
        left={mobileHeaderLeft}
        actions={mobileHeaderActions}
      />
      {inspection.inspectionReportURL && (
        <p className={parentStyles.header__pdfReport}>
          PDF Report is available
        </p>
      )}
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
      />
    </>
  );
};

MobileLayout.defaultProps = {};

export default MobileLayout;
