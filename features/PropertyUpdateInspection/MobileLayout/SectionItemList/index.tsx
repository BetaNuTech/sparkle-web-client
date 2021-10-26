import { FunctionComponent } from 'react';
import inspectionTemplateItemModel from '../../../../common/models/inspectionTemplateItem';
import InspectionItemControls, {
  Attachment
} from '../../../../common/InspectionItemControls';
import styles from '../../styles.module.scss';

interface Props {
  item: inspectionTemplateItemModel;
}

const SectionItemList: FunctionComponent<Props> = ({ item }) => {
  const showAttachment = typeof item.mainInputType !== 'undefined';
  return (
    <li className={styles.section__list__item__row}>
      <div>{item.itemType === 'signature' ? 'Signature' : item.title}</div>
      <div className={styles['section__list__item__row--mainInput']}>
        {showAttachment && (
          <Attachment photos={item.photos} notes={item.notes} />
        )}
        <InspectionItemControls
          inputType={item.mainInputType}
          selected={item.mainInputSelected}
          selectedValue={item.mainInputSelection}
        />
      </div>
    </li>
  );
};

SectionItemList.defaultProps = {};

export default SectionItemList;
