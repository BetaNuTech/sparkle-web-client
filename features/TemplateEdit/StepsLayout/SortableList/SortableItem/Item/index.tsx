import { CSSProperties, forwardRef, useRef } from 'react';
import getConfig from 'next/config';
import clsx from 'clsx';

import DiamondIcon from '../../../../../../public/icons/sparkle/diamond.svg';
import DiamondLayersIcon from '../../../../../../public/icons/sparkle/diamond-layers.svg';
import HamburgerIcon from '../../../../../../public/icons/ios/hamburger.svg';
import InspectionItemIcon from '../../../../../../public/icons/sparkle/inspection-item.svg';
import TextInputIcon from '../../../../../../public/icons/sparkle/text-input.svg';
import QuillIcon from '../../../../../../public/icons/sparkle/quill.svg';

import styles from './styles.module.scss';
import ErrorLabel from '../../../../../../common/ErrorLabel';

const config = getConfig() || {};
const publicRuntimeConfig = config.publicRuntimeConfig || {};
const basePath = publicRuntimeConfig.basePath || '';

interface Props {
  item: any;
  onUpdateTitle?(title: string): void;
  onUpdateType?(): void;
  style?: CSSProperties;
  onSelectItem?(itemId: string): void;
  selectedItems?: string[];
  errors?: Record<string, string>;
  errorMessage?: string;
}

const Item = forwardRef<HTMLDivElement, Props>(
  (
    {
      item,
      onUpdateTitle,
      onUpdateType,
      style,
      onSelectItem,
      selectedItems,
      errors,
      errorMessage,
      ...props
    },
    nodeRef
  ) => {
    if (!item) {
      return <></>;
    }
    const title = useRef(item.title);

    const itemItype = item?.section_type || item.itemType;

    let icon = <DiamondIcon className={styles.controls__icon} />;
    if (itemItype === 'multi') {
      icon = <DiamondLayersIcon className={styles.controls__icon} />;
    }
    if (itemItype === 'signature') {
      icon = <QuillIcon className={styles.controls__icon} />;
    }
    if (itemItype === 'text_input') {
      icon = <TextInputIcon className={styles.controls__icon} />;
    }
    if (itemItype === 'main') {
      icon = <InspectionItemIcon className={styles.controls__icon} />;
    }

    const showError =
      item.itemType !== 'signature' && errorMessage && !item.title;

    return (
      <div
        style={style}
        className={styles.container}
        ref={nodeRef}
        data-testid="template-edit-item"
        data-item-type={itemItype}
      >
        <div className={styles.main}>
          <input
            type="checkbox"
            className={styles.main__checkbox}
            onChange={() => onSelectItem(item.id)}
            checked={selectedItems?.includes(item.id)}
            data-testid="template-edit-item-checkbox"
          />
          <div className={styles.content}>
            {item.itemType === 'signature' ? (
              <img src={`${basePath}/img/signature.png`} alt="signature" />
            ) : (
              <p
                className={styles.content__text}
                contentEditable
                suppressContentEditableWarning={true} // eslint-disable-line react/jsx-boolean-value
                onInput={(evt) => onUpdateTitle(evt.currentTarget.innerText)}
              >
                {title.current}
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
            <span
              className={clsx(
                styles.controls__dragHandle,
                'template-edit-drag-handle'
              )}
              {...props}
            >
              <HamburgerIcon className={styles.controls__icon} />
            </span>
          </div>
        </div>
        {showError && (
          <div className={styles.error}>
            <ErrorLabel errors={errors} message={errorMessage} />
          </div>
        )}
      </div>
    );
  }
);

Item.defaultProps = {
  onUpdateTitle: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  onUpdateType: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  onSelectItem: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  selectedItems: []
};

Item.displayName = 'Item';

export default Item;
