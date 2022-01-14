import clsx from 'clsx';
import {
  FunctionComponent,
  useRef,
  useState,
  MouseEvent,
  ChangeEvent
} from 'react';
import InspectionTemplateItemModel from '../../../../common/models/inspectionTemplateItem';
import UnPublishedPhotoDataModel from '../../../../common/models/inspections/templateItemUnpublishedPhotoData';
import InspectionItemControls, {
  Attachment
} from '../../../../common/InspectionItemControls';
import useSwipeReveal from '../../../../common/hooks/useSwipeReveal';
import useVisibility from '../../../../common/hooks/useVisibility';
import UnpublishedSignatureModel from '../../../../common/models/inspections/templateItemUnpublishedSignature';
import SectionItemActions from '../../SectionItemActions';
import styles from '../../styles.module.scss';

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
  inspectionItemsSignature: Map<string, UnpublishedSignatureModel[]>;
  canEdit: boolean;
  completedItems: InspectionTemplateItemModel[];
  isIncompleteRevealed: boolean;
  isItemDeficient: boolean;
}

const ItemListSwipable: FunctionComponent<Props> = ({
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

  const isItemCompleted = Boolean(
    completedItems.find((completedItem) => completedItem.id === item.id)
  );

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
                  ],
                !isItemCompleted &&
                  isIncompleteRevealed &&
                  styles['section__list__item__row__swipeContainer--incomplete']
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
                {showAttachment && (
                  <Attachment
                    photos={item.photos}
                    notes={item.notes}
                    photosData={item.photosData}
                    unPublishedPhotosDataCount={unPublishedPhotosDataCount}
                    inspectorNotes={item.inspectorNotes}
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

ItemListSwipable.defaultProps = {};

export default ItemListSwipable;
