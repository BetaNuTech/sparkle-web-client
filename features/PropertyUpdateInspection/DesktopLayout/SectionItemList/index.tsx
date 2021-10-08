import { FunctionComponent } from 'react';
import clsx from 'clsx';
import ActionsIcon from '../../../../public/icons/ios/actions.svg';
import inspectionTemplateItemModel from '../../../../common/models/inspectionTemplateItem';
import InspectionItemControls from '../../../../common/InspectionItemControls';
import styles from '../../styles.module.scss';

interface Props {
  item: inspectionTemplateItemModel;
}

const SectionItemList: FunctionComponent<Props> = ({ item }) => (
  <li
    className={clsx(
      styles.section__list__item__row,
      styles['section__list__item__row--grid']
    )}
  >
    <div>{item.itemType === 'signature' ? 'Signature' : item.title}</div>
    <InspectionItemControls
      inputType={item.mainInputType}
      selected={item.mainInputSelected}
      selectedValue={item.mainInputSelection}
    />
    <div className={clsx(styles['section__list__item__row--gridAction'])}>
      <ActionsIcon />
    </div>
  </li>
);

SectionItemList.defaultProps = {};

export default SectionItemList;
