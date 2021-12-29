import { FunctionComponent, useRef } from 'react';
import clsx from 'clsx';
import inspectionTemplateItemModel from '../../../../common/models/inspectionTemplateItem';
import unPublishedPhotoDataModel from '../../../../common/models/inspections/templateItemUnpublishedPhotoData';
import InspectionItemControls, {
  Attachment
} from '../../../../common/InspectionItemControls';
import SectionItemDropdown from '../../SectionItemDropdown';
import useVisibility from '../../../../common/hooks/useVisibility';

import styles from '../../styles.module.scss';
import unpublishedSignatureModel from '../../../../common/models/inspections/templateItemUnpublishedSignature';

interface Props {
  item: inspectionTemplateItemModel;
  onInputChange(
    event:
      | React.MouseEvent<HTMLLIElement>
      | React.ChangeEvent<HTMLInputElement>,
    item: inspectionTemplateItemModel,
    value: string | number
  ): void;
  forceVisible: boolean;
  onClickOneActionNotes(item: inspectionTemplateItemModel): void;
  onItemIsNAChange(itemId: string, isItemNA: boolean): void;
  onClickAttachmentNotes(item: inspectionTemplateItemModel): void;
  onClickSignatureInput(item: inspectionTemplateItemModel): void;
  onClickPhotos(item: inspectionTemplateItemModel): void;
  inspectionItemsPhotos: Map<string, unPublishedPhotoDataModel[]>;
  inspectionItemsSignature: Map<string, unpublishedSignatureModel[]>;
  canEdit: boolean;
}

const ItemList: FunctionComponent<Props> = ({
  item,
  forceVisible,
  onInputChange,
  onClickOneActionNotes,
  onItemIsNAChange,
  onClickAttachmentNotes,
  onClickSignatureInput,
  onClickPhotos,
  inspectionItemsPhotos,
  inspectionItemsSignature,
  canEdit
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

  return (
    <li
      className={clsx(
        styles.section__list__item__row,
        styles['section__list__item__row--grid'],
        isSignature && styles['section__list__item__row--gridSignature']
      )}
      ref={placeholderRef}
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
              />
            )}

            <InspectionItemControls
              inputType={item.mainInputType || item.itemType}
              selected={item.mainInputSelected}
              selectedValue={item.mainInputSelection}
              textInputValue={item.textInputValue}
              signatureDownloadURL={signatureDownloadURL}
              onInputChange={(event, selectionIndex) =>
                onInputChange(event, item, selectionIndex)
              }
              onClickOneActionNotes={() => onClickOneActionNotes(item)}
              onClickSignatureInput={() => onClickSignatureInput(item)}
              isDisabled={!canEdit}
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