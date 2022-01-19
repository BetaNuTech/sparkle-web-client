import {
  FunctionComponent,
  MouseEvent,
  ChangeEvent,
  useEffect,
  useState
} from 'react';
import inspectionTemplateSectionModel from '../../../common/models/inspectionTemplateSection';
import InspectionTemplateItemModel from '../../../common/models/inspectionTemplateItem';
import UnPublishedPhotoDataModel from '../../../common/models/inspections/templateItemUnpublishedPhotoData';
import UnpublishedSignatureModel from '../../../common/models/inspections/templateItemUnpublishedSignature';
import globalEvents from '../../../common/utils/globalEvents';
import StatusBar from './StatusBar';
import Group from './Group';
import styles from './styles.module.scss';

const HEADER_HEIGHT = 135;

interface Props {
  sections: Array<inspectionTemplateSectionModel>;
  collapsedSections: Array<string>;
  onSectionCollapseToggle(section: inspectionTemplateSectionModel): void;
  onMainInputChange?(
    event: MouseEvent<HTMLLIElement>,
    item: InspectionTemplateItemModel,
    value: number
  ): void;
  onTextInputChange?(
    event: ChangeEvent<HTMLInputElement>,
    item: InspectionTemplateItemModel,
    value: string
  ): void;
  onClickOneActionNotes(item: InspectionTemplateItemModel): void;
  sectionItems: Map<string, InspectionTemplateItemModel[]>;
  forceVisible?: boolean;
  onAddSection(
    event: React.MouseEvent<HTMLButtonElement>,
    sectionId: string
  ): void;
  onRemoveSection(
    event: React.MouseEvent<HTMLButtonElement>,
    sectionId: string
  ): void;
  onItemIsNAChange(itemId: string, isItemNA: boolean): void;
  onClickAttachmentNotes(item: InspectionTemplateItemModel): void;
  onClickSignatureInput(item: InspectionTemplateItemModel): void;
  onClickPhotos(item: InspectionTemplateItemModel): void;
  inspectionItemsPhotos: Map<string, UnPublishedPhotoDataModel[]>;
  inspectionItemsSignature: Map<string, UnpublishedSignatureModel[]>;
  canEdit: boolean;
  isMobile: boolean;
  isIncompleteRevealed: boolean;
  completedItems: InspectionTemplateItemModel[];
  requireDeficientItemNoteAndPhoto: boolean;
  inspectionItemDeficientIds: string[];
  inspCompletionPercentage: number;
  onSaveInspection(): void;
  canEnableEditMode: boolean;
  onEnableAdminEditMode(): void;
  canUpdateCompleteInspection: boolean;
  isOnline: boolean;
  hasUpdates: boolean;
  onCopyReportURL(): void;
  isPdfReportStatusShowing: boolean;
  isPdfReportOutOfDate: boolean;
  isPdfReportGenerating: boolean;
  isPdfReportQueued: boolean;
  showRestartAction: boolean;
  hasPdfReportGenerationFailed: boolean;
  onRegenerateReport(): void;
  inspectionReportURL: string;
  isRequestingReport: boolean;
  showAction: boolean;
}

const Sections: FunctionComponent<Props> = ({
  sections,
  collapsedSections,
  onSectionCollapseToggle,
  onMainInputChange,
  onTextInputChange,
  onClickOneActionNotes,
  forceVisible,
  sectionItems,
  onAddSection,
  onRemoveSection,
  onItemIsNAChange,
  onClickAttachmentNotes,
  onClickSignatureInput,
  onClickPhotos,
  inspectionItemsPhotos,
  inspectionItemsSignature,
  canEdit,
  isMobile,
  isIncompleteRevealed,
  completedItems,
  requireDeficientItemNoteAndPhoto,
  inspectionItemDeficientIds,
  inspCompletionPercentage,
  onSaveInspection,
  canEnableEditMode,
  onEnableAdminEditMode,
  canUpdateCompleteInspection,
  hasUpdates,
  isOnline,
  onCopyReportURL,
  isPdfReportStatusShowing,
  isPdfReportOutOfDate,
  isPdfReportGenerating,
  isPdfReportQueued,
  showRestartAction,
  hasPdfReportGenerationFailed,
  onRegenerateReport,
  inspectionReportURL,
  isRequestingReport,
  showAction
}) => {
  const [isDuplicateActionsNotInView, setIsDuplicateActionsNotInView] =
    useState(false);

  // Reveal duplicate header actions
  // once user scrolled down past the primary header
  const onScrollEvent = (event: CustomEvent) => {
    setIsDuplicateActionsNotInView(event.detail.scrollTop > HEADER_HEIGHT);
  };

  useEffect(() => {
    const unsubscribe = globalEvents.subscribe(
      'mainLayoutMainSideScroll',
      onScrollEvent
    );
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // needed so callback as latest data

  if (!sections || !sections.length) {
    return <></>;
  }

  return (
    <div className={styles.container}>
      <StatusBar
        showAction={showAction && isDuplicateActionsNotInView}
        inspCompletionPercentage={inspCompletionPercentage}
        onSaveInspection={onSaveInspection}
        canEnableEditMode={canEnableEditMode}
        onEnableAdminEditMode={onEnableAdminEditMode}
        canUpdateCompleteInspection={canUpdateCompleteInspection}
        isOnline={isOnline}
        hasUpdates={hasUpdates}
        onCopyReportURL={onCopyReportURL}
        isPdfReportStatusShowing={isPdfReportStatusShowing}
        isPdfReportOutOfDate={isPdfReportOutOfDate}
        isPdfReportGenerating={isPdfReportGenerating}
        isPdfReportQueued={isPdfReportQueued}
        showRestartAction={showRestartAction}
        hasPdfReportGenerationFailed={hasPdfReportGenerationFailed}
        onRegenerateReport={onRegenerateReport}
        inspectionReportURL={inspectionReportURL}
        isRequestingReport={isRequestingReport}
      />
      <ul data-testid="inspection-section">
        {sections.map((sectionItem, index) => (
          <Group
            key={sectionItem.id}
            section={sectionItem}
            nextSectionTitle={sections[index + 1] && sections[index + 1].title}
            forceVisible={forceVisible}
            collapsedSections={collapsedSections}
            onSectionCollapseToggle={onSectionCollapseToggle}
            onMainInputChange={onMainInputChange}
            onTextInputChange={onTextInputChange}
            sectionItems={sectionItems}
            onClickOneActionNotes={onClickOneActionNotes}
            onAddSection={onAddSection}
            onRemoveSection={onRemoveSection}
            onItemIsNAChange={onItemIsNAChange}
            onClickAttachmentNotes={onClickAttachmentNotes}
            onClickSignatureInput={onClickSignatureInput}
            onClickPhotos={onClickPhotos}
            inspectionItemsPhotos={inspectionItemsPhotos}
            inspectionItemsSignature={inspectionItemsSignature}
            canEdit={canEdit}
            isMobile={isMobile}
            isIncompleteRevealed={isIncompleteRevealed}
            completedItems={completedItems}
            requireDeficientItemNoteAndPhoto={requireDeficientItemNoteAndPhoto}
            inspectionItemDeficientIds={inspectionItemDeficientIds}
          />
        ))}
      </ul>
    </div>
  );
};

export default Sections;
