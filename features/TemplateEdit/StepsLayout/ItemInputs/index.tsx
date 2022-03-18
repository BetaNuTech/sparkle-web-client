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
  onClickItemInput?(): void;
  onMouseDownNotes?(): void;
  onMouseDownAttachment?(): void;
}

const ItemInputs: FunctionComponent<Props> = ({
  item,
  forceVisible,
  onMouseDownMainInput,
  selectedToScore,
  onClickItemInput,
  onMouseDownNotes,
  onMouseDownAttachment
}) => {
  const ref = useRef(null);
  const { isVisible } = useVisibility(ref, {}, forceVisible);
  const isMainItem = item.itemType === 'main';
  const clickHandler = isMainItem ? onClickItemInput : () => null; // Propagate or noop

  return (
    <li className={styles.container} ref={ref}>
      {isVisible && (
        <>
          <label className={styles.title}>{item.title}</label>
          <div
            className={clsx(styles.content, !isMainItem && '-mr-none')}
            onClick={clickHandler}
          >
            <InspectionItemControls
              item={item}
              canEdit={false} // eslint-disable-line react/jsx-boolean-value
              showValues={true} // eslint-disable-line react/jsx-boolean-value
              onMainInputMouseDown={onMouseDownMainInput}
              selectedToScore={selectedToScore}
            />
          </div>
          {isMainItem && (
            <div className={styles.controls}>
              <Attachment
                photos={item.photos}
                notes={item.notes}
                canEdit={true} // eslint-disable-line react/jsx-boolean-value
                onMouseDownNotes={onMouseDownNotes}
                onMouseDownAttachment={onMouseDownAttachment}
              />
            </div>
          )}
        </>
      )}
    </li>
  );
};

ItemInputs.defaultProps = {
  onClickItemInput: () => {} // eslint-disable-line @typescript-eslint/no-empty-function
};

export default ItemInputs;
