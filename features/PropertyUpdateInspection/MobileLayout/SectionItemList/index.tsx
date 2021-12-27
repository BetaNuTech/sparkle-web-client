import { FunctionComponent, useRef, useState } from 'react';
import clsx from 'clsx';
import inspectionTemplateItemModel from '../../../../common/models/inspectionTemplateItem';
import unPublishedPhotoDataModel from '../../../../common/models/inspections/templateItemUnpublishedPhotoData';
import InspectionItemControls, {
  Attachment
} from '../../../../common/InspectionItemControls';
import useSwipeReveal from '../../../../common/hooks/useSwipeReveal';
import useVisibility from '../../../../common/hooks/useVisibility';
import SectionItemActions from '../../SectionItemActions';
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

const SectionItemList: FunctionComponent<Props> = ({
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
  const [isSwipeOpen, setIsSwipeOpen] = useState(false);
  const swipeContainerRef = useRef();

  const setSwipeOpen = (isOpen: boolean) => {
    if (canEdit) setIsSwipeOpen(isOpen);
  };

  useSwipeReveal(swipeContainerRef, setSwipeOpen);

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

  const onChangeNA = (itemId: string, isItemNA: boolean) => {
    onItemIsNAChange(itemId, isItemNA);
    setIsSwipeOpen(false);
  };
  return (
    <li
      className={clsx(
        styles.section__list__item__row,
        isSignature && styles['section__list__item__row--gridSignature']
      )}
      ref={placeholderRef}
    >
      <div ref={swipeContainerRef}>
        {isVisible && (
          <>
            <div
              className={clsx(
                styles.section__list__item__row__swipeContainer,
                isSwipeOpen &&
                  styles['section__list__item__row__swipeContainer--swipeOpen'],
                isSwipeOpen &&
                  item.isItemNA &&
                  styles[
                    'section__list__item__row__swipeContainer--swipeOpenNA'
                  ]
              )}
            >
              {item.isItemNA && (
                <div
                  className={styles['section__list__item__row--notApplicable']}
                >
                  <h3>NA</h3>
                </div>
              )}
              <div>
                {item.itemType === 'signature' ? 'Signature' : item.title}
              </div>
              <div className={styles['section__list__item__row--mainInput']}>
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
                {showAttachment && (
                  <Attachment
                    photos={item.photos}
                    notes={item.notes}
                    photosData={item.photosData}
                    unPublishedPhotosDataCount={unPublishedPhotosDataCount}
                    inspectorNotes={item.inspectorNotes}
                    onClickAttachmentNotes={() => onClickAttachmentNotes(item)}
                    onClickPhotos={() => onClickPhotos(item)}
                  />
                )}
              </div>
            </div>
            <div
              className={clsx(
                styles.section__list__item__row__swipeActions,
                isSwipeOpen &&
                  styles['section__list__item__row__swipeActions--reveal']
              )}
            >
              <SectionItemActions
                isItemNA={item.isItemNA}
                onChangeItemNA={(isItemNA) => onChangeNA(item.id, isItemNA)}
              />
            </div>
          </>
        )}
      </div>
    </li>
  );
};

SectionItemList.defaultProps = {};

export default SectionItemList;
