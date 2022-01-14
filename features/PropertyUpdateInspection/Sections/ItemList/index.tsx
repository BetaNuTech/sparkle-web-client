import clsx from 'clsx';
import { FunctionComponent, useRef, MouseEvent, ChangeEvent } from 'react';
import InspectionTemplateItemModel from '../../../../common/models/inspectionTemplateItem';
import UnPublishedPhotoDataModel from '../../../../common/models/inspections/templateItemUnpublishedPhotoData';
import InspectionItemControls, {
  Attachment
} from '../../../../common/InspectionItemControls';
import SectionItemDropdown from '../../SectionItemDropdown';
import useVisibility from '../../../../common/hooks/useVisibility';
import styles from '../../styles.module.scss';
import unpublishedSignatureModel from '../../../../common/models/inspections/templateItemUnpublishedSignature';

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

const ItemList: FunctionComponent<Props> = ({
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
  const { isVisible } = useVisibility(placeholderRef, {}, forceVisible);

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
        styles.section__list__item__row,
        styles['section__list__item__row--grid'],
        isSignature && styles['section__list__item__row--gridSignature'],
        !isItemCompleted &&
          isIncompleteRevealed &&
          styles['section__list__item__row--incomplete']
      )}
      ref={placeholderRef}
      data-testid="section-list-item-row"
    >
      {isVisible && (
        <>
          {item.isItemNA && (
            <div className={styles['section__list__item__row--notApplicable']}>
              <h3>NA</h3>
            </div>
          )}
          <div>{item.itemType === 'signature' ? 'Signature' : item.title}</div>
          <div
            className={clsx(
              styles['section__list__item__row--mainInput'],
              styles['section__list__item__row--mainInputGrid']
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
            <SectionItemDropdown
              isItemNA={item.isItemNA}
              onChangeItemNA={(isItemNA) => onItemIsNAChange(item.id, isItemNA)}
            />
          )}
        </>
      )}
    </li>
  );
};

ItemList.defaultProps = {};

export default ItemList;
