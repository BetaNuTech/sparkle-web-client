import { FunctionComponent } from 'react';
import inspectionTemplateItemModel from '../../../../common/models/inspectionTemplateItem';
import InspectionItemControls, {
  Attachment
} from '../../../../common/InspectionItemControls';
import styles from '../../styles.module.scss';
import SectionItemDropdown from '../../SectionItemDropdown';

interface Props {
  item: inspectionTemplateItemModel;
  onInputChange(
    event:
      | React.MouseEvent<HTMLLIElement>
      | React.ChangeEvent<HTMLInputElement>,
    item: inspectionTemplateItemModel,
    value: string | number
  ): void;
  onClickOneActionNotes(item: inspectionTemplateItemModel): void;
  onItemIsNAChange(itemId: string, isItemNA: boolean): void;
  onClickAttachmentNotes(item: inspectionTemplateItemModel): void;
}

const SectionItemList: FunctionComponent<Props> = ({
  item,
  onInputChange,
  onClickOneActionNotes,
  onItemIsNAChange,
  onClickAttachmentNotes
}) => {
  const showAttachment = typeof item.mainInputType !== 'undefined';
  return (
    <li className={styles.section__list__item__row}>
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
          onInputChange={(event, selectionIndex) =>
            onInputChange(event, item, selectionIndex)
          }
          onClickOneActionNotes={() => onClickOneActionNotes(item)}
        />
        {showAttachment && (
          <Attachment
            photos={item.photos}
            notes={item.notes}
            inspectorNotes={item.inspectorNotes}
            photosData={item.photosData}
            onClickAttachmentNotes={() => onClickAttachmentNotes(item)}
          />
        )}
        <SectionItemDropdown
          isItemNA={item.isItemNA}
          onChangeItemNA={(isItemNA) => onItemIsNAChange(item.id, isItemNA)}
        />
      </div>
    </li>
  );
};

SectionItemList.defaultProps = {};

export default SectionItemList;
