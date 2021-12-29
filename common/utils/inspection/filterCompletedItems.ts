import pipe from '../pipe';
import inspectionTemplateItemModel from '../../models/inspectionTemplateItem';
import inspectionConfig from '../../../config/inspections';

const DEFICIENT_LIST_ELIGIBLE = inspectionConfig.deficientListEligible;

// Filter items for completed
export const filterCompletedItems = (
  items: Array<inspectionTemplateItemModel>,
  requireDeficientItemNoteAndPhoto = false
): Array<inspectionTemplateItemModel> =>
  pipe(
    concatCompletedMainInputItems,
    concatNaItems,
    concatCompletedTextInputItems,
    concatCompletedSignatureInputItems,
    concatCompletedMainNoteInputItems,
    concatIfYesNoTextInputItems
  )([], items, Boolean(requireDeficientItemNoteAndPhoto)).filter(
    (
      item: inspectionTemplateItemModel,
      index: number,
      all: Array<inspectionTemplateItemModel>
    ) => all.indexOf(item) === index // unique only
  );

// Add completed inspection items
const concatCompletedMainInputItems = (
  src: Array<inspectionTemplateItemModel>,
  items: Array<inspectionTemplateItemModel>,
  requireDeficientItemNoteAndPhoto: boolean
) =>
  src.concat(
    items.filter((item) => {
      const mainInputType = `${item.mainInputType || ''}`.toLowerCase();
      const isMain =
        ['signature', 'text_input'].includes(item.itemType) === false; // ignore signature & text_input
      const isNotNote = mainInputType !== 'oneaction_notes';

      // If items configured to required notes & photos
      // when they are deficient, check for presence
      let hasRequiredDInote = true;
      let hasRequiredDIphoto = true;

      if (
        requireDeficientItemNoteAndPhoto &&
        DEFICIENT_LIST_ELIGIBLE[mainInputType]
      ) {
        const deficientEligibles = DEFICIENT_LIST_ELIGIBLE[mainInputType];
        const isDeficient =
          deficientEligibles[item.mainInputSelection] || false;
        hasRequiredDInote =
          isDeficient && item.notes ? Boolean(item.inspectorNotes) : true;
        hasRequiredDIphoto =
          isDeficient && item.photos ? Boolean(item.photosData) : true;
      }

      return (
        isMain &&
        isNotNote &&
        Boolean(item.mainInputSelected) &&
        typeof item.mainInputSelection === 'number' &&
        hasRequiredDInote &&
        hasRequiredDIphoto
      );
    })
  );

// Add ignored items
const concatNaItems = (
  src: Array<inspectionTemplateItemModel>,
  items: Array<inspectionTemplateItemModel>
) =>
  src.concat(items.filter((key: inspectionTemplateItemModel) => key.isItemNA));

// Add completed text input items
const concatCompletedTextInputItems = (
  src: Array<inspectionTemplateItemModel>,
  items: Array<inspectionTemplateItemModel>
) =>
  src.concat(
    items.filter((item: inspectionTemplateItemModel) => {
      const isText = item.isTextInputItem || item.itemType === 'text_input';
      return isText && Boolean(item.textInputValue);
    })
  );

// Add completed signature input items
const concatCompletedSignatureInputItems = (
  src: Array<inspectionTemplateItemModel>,
  items: Array<inspectionTemplateItemModel>
) =>
  src.concat(
    items.filter(
      (item: inspectionTemplateItemModel) =>
        item.itemType === 'signature' && Boolean(item.signatureDownloadURL)
    )
  );

// Add completed main input items
const concatCompletedMainNoteInputItems = (
  src: Array<inspectionTemplateItemModel>,
  items: Array<inspectionTemplateItemModel>
) =>
  src.concat(
    items.filter((item: inspectionTemplateItemModel) => {
      const type = `${item.mainInputType || ''}`.toLowerCase();
      return type === 'oneaction_notes' && Boolean(item.mainInputNotes);
    })
  );

// Add all "if yes" "if no" text items as complete reguardless of content
const concatIfYesNoTextInputItems = (
  src: Array<inspectionTemplateItemModel>,
  items: Array<inspectionTemplateItemModel>
) =>
  src.concat(
    items.filter((item: inspectionTemplateItemModel) => {
      const isText = item.isTextInputItem || item.itemType === 'text_input';
      return isText && `${item.title}`.trim().search(/^if (yes|no)/i) === 0;
    })
  );
