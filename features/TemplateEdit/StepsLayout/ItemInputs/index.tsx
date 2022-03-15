import { FunctionComponent, MouseEvent, useRef } from 'react';
import clsx from 'clsx';
import useVisibility from '../../../../common/hooks/useVisibility';
import InspectionItemControls, {
  Attachment
} from '../../../../common/InspectionItemControls';
import styles from './styles.module.scss';

interface Props {
  item: any;
  forceVisible?: boolean;
  onMouseDownMainInput(event: MouseEvent<HTMLLIElement>, value: number): void;
  selectedToScore?: number;
}

const ItemInputs: FunctionComponent<Props> = ({
  item,
  forceVisible,
  onMouseDownMainInput,
  selectedToScore
}) => {
  const ref = useRef(null);
  const { isVisible } = useVisibility(ref, {}, forceVisible);
  const showAttachment = ['signature', 'text_input'].indexOf(item.itemType) < 0;

  return (
    <li className={styles.container} ref={ref}>
      {isVisible && (
        <>
          <label className={styles.title}>{item.title}</label>
          <div className={clsx(styles.content, !showAttachment && '-mr-none')}>
            <InspectionItemControls
              item={item}
              canEdit={false} // eslint-disable-line react/jsx-boolean-value
              showValues={true} // eslint-disable-line react/jsx-boolean-value
              onMainInputMouseDown={onMouseDownMainInput}
              selectedToScore={selectedToScore}
            />
          </div>
          {showAttachment && (
            <div className={styles.controls}>
              <Attachment
                photos={item.photos}
                notes={item.notes}
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
