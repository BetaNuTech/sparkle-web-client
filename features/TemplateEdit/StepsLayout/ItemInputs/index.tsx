import { FunctionComponent, useRef } from 'react';
import clsx from 'clsx';
import useVisibility from '../../../../common/hooks/useVisibility';
import InspectionItemControls, {
  Attachment
} from '../../../../common/InspectionItemControls';
import styles from './styles.module.scss';
import deepClone from '../../../../__tests__/helpers/deepClone';

interface Props {
  item: any;
  step: string;
  forceVisible?: boolean;
}

const ItemInputs: FunctionComponent<Props> = ({ item, step, forceVisible }) => {
  const ref = useRef(null);
  const { isVisible } = useVisibility(ref, {}, forceVisible);
  const showAttachment = ['signature', 'text_input'].indexOf(item.itemType) < 0;
  const templateItem = deepClone(item);
  if (step === 'items') {
    templateItem.mainInputZeroValue = '?';
    templateItem.mainInputOneValue = '?';
    templateItem.mainInputTwoValue = '?';
    templateItem.mainInputThreeValue = '?';
    templateItem.mainInputFourValue = '?';
  }
  return (
    <li className={styles.container} ref={ref}>
      {isVisible && (
        <>
          <label className={styles.title}>{templateItem.title}</label>
          <div className={clsx(styles.content, !showAttachment && '-mr-none')}>
            <InspectionItemControls
              item={templateItem}
              canEdit={false} // eslint-disable-line react/jsx-boolean-value
              showValues={true} // eslint-disable-line react/jsx-boolean-value
            />
          </div>
          {showAttachment && (
            <div className={styles.controls}>
              <Attachment
                photos={templateItem.photos}
                notes={templateItem.notes}
                canEdit={true} // eslint-disable-line react/jsx-boolean-value
              />
            </div>
          )}
        </>
      )}
    </li>
  );
};

export default ItemInputs;
