import { FunctionComponent } from 'react';
import clsx from 'clsx';
import ActionsIcon from '../../../../public/icons/ios/actions.svg';
import inspectionTemplateItemModel from '../../../../common/models/inspectionTemplateItem';
import InspectionItemControls, {
  Attachment
} from '../../../../common/InspectionItemControls';
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
}

const SectionItemList: FunctionComponent<Props> = ({
  item,
  onInputChange,
  onClickOneActionNotes
}) => {
  const showAttachment = typeof item.mainInputType !== 'undefined';
  return (
    <li
      className={clsx(
        styles.section__list__item__row,
        styles['section__list__item__row--grid']
      )}
    >
      <div>{item.itemType === 'signature' ? 'Signature' : item.title}</div>
      <div
        className={clsx(
          styles['section__list__item__row--mainInput'],
          styles['section__list__item__row--mainInputGrid']
        )}
      >
        {showAttachment && (
          <Attachment photos={item.photos} notes={item.notes} />
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
      <div className={clsx(styles['section__list__item__row--gridAction'])}>
        <ActionsIcon />
      </div>
    </li>
  );
};

SectionItemList.defaultProps = {};

export default SectionItemList;
