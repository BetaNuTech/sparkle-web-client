import { FunctionComponent, useRef } from 'react';
import clsx from 'clsx';
import inspectionTemplateItemModel from '../../../../common/models/inspectionTemplateItem';
import InspectionItemControls, {
  Attachment
} from '../../../../common/InspectionItemControls';
import useVisibility from '../../../../common/hooks/useVisibility';
import SectionItemDropdown from '../../SectionItemDropdown';
import styles from '../../styles.module.scss';

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
}

const SectionItemList: FunctionComponent<Props> = ({
  item,
  forceVisible,
  onInputChange,
  onClickOneActionNotes,
  onItemIsNAChange,
  onClickAttachmentNotes,
  onClickSignatureInput
}) => {
  const showAttachment = typeof item.mainInputType !== 'undefined';
  const isSignature = item.itemType === 'signature';
  const placeholderRef = useRef(null);
  const { isVisible } = useVisibility(placeholderRef, {}, forceVisible);
  return (
    <li
      className={clsx(
        styles.section__list__item__row,
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
          <div className={styles['section__list__item__row--mainInput']}>
            <InspectionItemControls
              inputType={item.mainInputType || item.itemType}
              selected={item.mainInputSelected}
              selectedValue={item.mainInputSelection}
              textInputValue={item.textInputValue}
              signatureDownloadURL={item.signatureDownloadURL}
              onInputChange={(event, selectionIndex) =>
                onInputChange(event, item, selectionIndex)
              }
              onClickOneActionNotes={() => onClickOneActionNotes(item)}
              onClickSignatureInput={() => onClickSignatureInput(item)}
            />
            {showAttachment && (
              <Attachment
                photos={item.photos}
                notes={item.notes}
                photosData={item.photosData}
                inspectorNotes={item.inspectorNotes}
                onClickAttachmentNotes={() => onClickAttachmentNotes(item)}
              />
            )}

            <SectionItemDropdown
              isItemNA={item.isItemNA}
              onChangeItemNA={(isItemNA) => onItemIsNAChange(item.id, isItemNA)}
            />
          </div>
        </>
      )}
    </li>
  );
};

SectionItemList.defaultProps = {};

export default SectionItemList;
