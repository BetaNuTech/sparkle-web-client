import clsx from 'clsx';
import { FunctionComponent, useRef, MouseEvent, ChangeEvent } from 'react';
import InspectionTemplateItemModel from '../../../../../common/models/inspectionTemplateItem';
import UnPublishedPhotoDataModel from '../../../../../common/models/inspections/templateItemUnpublishedPhotoData';
import InspectionItemControls, {
  Attachment
} from '../../../../../common/InspectionItemControls';
import Dropdown from './Dropdown';
import useVisibility from '../../../../../common/hooks/useVisibility';
import unpublishedSignatureModel from '../../../../../common/models/inspections/templateItemUnpublishedSignature';
import groupStyles from '../styles.module.scss';

interface Props {
  item: InspectionTemplateItemModel;
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
  forceVisible: boolean;
  onClickOneActionNotes(item: InspectionTemplateItemModel): void;
  onItemIsNAChange(itemId: string, isItemNA: boolean): void;
  onClickAttachmentNotes(item: InspectionTemplateItemModel): void;
  onClickSignatureInput(item: InspectionTemplateItemModel): void;
  onClickPhotos(item: InspectionTemplateItemModel): void;
  inspectionItemsPhotos: Map<string, UnPublishedPhotoDataModel[]>;
  inspectionItemsSignature: Map<string, unpublishedSignatureModel[]>;
  canEdit: boolean;
  completedItems: InspectionTemplateItemModel[];
  isIncompleteRevealed: boolean;
  isItemDeficient: boolean;
}

const Item: FunctionComponent<Props> = ({
  item,
  forceVisible,
  onMainInputChange,
  onTextInputChange,
  onClickOneActionNotes,
  onItemIsNAChange,
  onClickAttachmentNotes,
  onClickSignatureInput,
  onClickPhotos,
  inspectionItemsPhotos,
  inspectionItemsSignature,
  canEdit,
  completedItems,
  isIncompleteRevealed,
  isItemDeficient
}) => {
  const showAttachment = typeof item.mainInputType !== 'undefined';
  const isSignature = item.itemType === 'signature';
  const placeholderRef = useRef(null);
  const { isVisible } = useVisibility(
    placeholderRef,
    { threshold: 0.01 },
    forceVisible
  );

  const unPublishedPhotosDataCount = (inspectionItemsPhotos.get(item.id) || [])
    .length;

  const unPublishedItemsSignatureData =
    inspectionItemsSignature.get(item.id) || [];

  const signatureDownloadURL =
    (unPublishedItemsSignatureData.length > 0 &&
      unPublishedItemsSignatureData[0].signature) ||
    item.signatureDownloadURL;

  const isItemCompleted = completedItems.some(
    (completedItem) => completedItem.id === item.id
  );

  return (
    <li
      className={clsx(
        groupStyles.item,
        groupStyles['item--grid'],
        isSignature && groupStyles['item--gridSignature'],
        !isItemCompleted &&
          isIncompleteRevealed &&
          groupStyles['item--incomplete']
      )}
      ref={placeholderRef}
      data-testid="section-list-item-row"
    >
      {isVisible && (
        <>
          {item.isItemNA && (
            <div className={groupStyles.item__notApplicable}>
              <h3>NA</h3>
            </div>
          )}
          <div>{item.itemType === 'signature' ? 'Signature' : item.title}</div>
          <div
            className={clsx(
              groupStyles.item__mainInput,
              groupStyles['item__mainInput--grid']
            )}
          >
            {showAttachment && (
              <Attachment
                photos={item.photos}
                inspectorNotes={item.inspectorNotes}
                notes={item.notes}
                photosData={item.photosData}
                unPublishedPhotosDataCount={unPublishedPhotosDataCount}
                onClickAttachmentNotes={() => onClickAttachmentNotes(item)}
                onClickPhotos={() => onClickPhotos(item)}
                isDeficient={isItemDeficient}
                canEdit={canEdit}
              />
            )}

            <InspectionItemControls
              item={item}
              signatureDownloadURL={signatureDownloadURL}
              onMainInputChange={(event, selectionIndex) =>
                onMainInputChange(event, item, selectionIndex)
              }
              onTextInputChange={(event, textValue) =>
                onTextInputChange(event, item, textValue)
              }
              onClickOneActionNotes={() => onClickOneActionNotes(item)}
              onClickSignatureInput={() => onClickSignatureInput(item)}
              canEdit={canEdit}
            />
          </div>
          {canEdit && (
            <Dropdown
              isItemNA={item.isItemNA}
              onChangeItemNA={(isItemNA) => onItemIsNAChange(item.id, isItemNA)}
            />
          )}
        </>
      )}
    </li>
  );
};

Item.defaultProps = {};

export default Item;
