import { FunctionComponent } from 'react';
import clsx from 'clsx';
import inspectionTemplateItemModel from '../../../../common/models/inspectionTemplateItem';
import InspectionItemControls, {
  Attachment
} from '../../../../common/InspectionItemControls';
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
    <li
      className={clsx(
        styles.section__list__item__row,
        styles['section__list__item__row--grid']
      )}
    >
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
            onClickAttachmentNotes={() => onClickAttachmentNotes(item)}
          />
        )}
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
      </div>
      <SectionItemDropdown
        isItemNA={item.isItemNA}
        onChangeItemNA={(isItemNA) => onItemIsNAChange(item.id, isItemNA)}
      />
    </li>
  );
};

SectionItemList.defaultProps = {};

export default SectionItemList;
