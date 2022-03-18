import { FunctionComponent, useRef } from 'react';
import getConfig from 'next/config';
import DiamondIcon from '../../../../public/icons/sparkle/diamond.svg';
import DiamondLayersIcon from '../../../../public/icons/sparkle/diamond-layers.svg';
import HamburgerIcon from '../../../../public/icons/ios/hamburger.svg';
import InspectionItemIcon from '../../../../public/icons/sparkle/inspection-item.svg';
import TextInputIcon from '../../../../public/icons/sparkle/text-input.svg';
import QuillIcon from '../../../../public/icons/sparkle/quill.svg';

import styles from './styles.module.scss';
import useVisibility from '../../../../common/hooks/useVisibility';

const config = getConfig() || {};
const publicRuntimeConfig = config.publicRuntimeConfig || {};
const basePath = publicRuntimeConfig.basePath || '';

interface Props {
  item: any;
  forceVisible?: boolean;
  onUpdateTitle(title: string): void;
  onUpdateType(): void;
}

const EditableItem: FunctionComponent<Props> = ({
  item,
  forceVisible,
  onUpdateTitle,
  onUpdateType
}) => {
  const ref = useRef(null);

  const { isVisible } = useVisibility(ref, {}, forceVisible);

  let icon = <DiamondIcon className={styles.controls__icon} />;
  if (item.section_type === 'multi') {
    icon = <DiamondLayersIcon className={styles.controls__icon} />;
  }
  if (item.itemType === 'signature') {
    icon = <QuillIcon className={styles.controls__icon} />;
  }
  if (item.itemType === 'text_input') {
    icon = <TextInputIcon className={styles.controls__icon} />;
  }
  if (item.itemType === 'main') {
    icon = <InspectionItemIcon className={styles.controls__icon} />;
  }

  return (
    <li className={styles.container} ref={ref}>
      {isVisible && (
        <>
          <input type="checkbox" className={styles.container__checkbox} />
          <div className={styles.content}>
            {item.itemType === 'signature' ? (
              <img src={`${basePath}/img/signature.png`} alt="signature" />
            ) : (
              <p
                className={styles.content__text}
                contentEditable
                suppressContentEditableWarning={true} // eslint-disable-line react/jsx-boolean-value
                onBlur={(evt) => onUpdateTitle(evt.currentTarget.innerText)}
              >
                {item.title}
              </p>
            )}
          </div>
          <div className={styles.controls}>
            <span
              className="-flex-center-content -cu-pointer"
              onClick={onUpdateType}
            >
              {icon}
            </span>
            <span className={styles.controls__dragHandle}>
              <HamburgerIcon className={styles.controls__icon} />
            </span>
          </div>
        </>
      )}
    </li>
  );
};

export default EditableItem;
