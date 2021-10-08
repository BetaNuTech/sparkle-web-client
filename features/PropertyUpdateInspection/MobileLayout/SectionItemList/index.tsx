import { FunctionComponent } from 'react';
import inspectionTemplateItemModel from '../../../../common/models/inspectionTemplateItem';
import InspectionItemControls from '../../../../common/InspectionItemControls';
import styles from '../../styles.module.scss';

interface Props {
  item: inspectionTemplateItemModel;
}

const SectionItemList: FunctionComponent<Props> = ({ item }) => (
  <li className={styles.section__list__item__row}>
    <div>{item.itemType === 'signature' ? 'Signature' : item.title}</div>
    <InspectionItemControls
      inputType={item.mainInputType}
      selected={item.mainInputSelected}
      selectedValue={item.mainInputSelection}
    />
  </li>
);

SectionItemList.defaultProps = {};

export default SectionItemList;
