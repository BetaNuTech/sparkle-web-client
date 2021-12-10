import { FunctionComponent } from 'react';
import clsx from 'clsx';
import ActionsIcon from '../../../public/icons/ios/actions.svg';

import Dropdown, { DropdownButton } from '../../../common/Dropdown';

import styles from '../styles.module.scss';

interface DropdownProps {
  isItemNA: boolean;
  onChangeItemNA(isItemNA: boolean): void;
}

const SectionItemDropdown: FunctionComponent<DropdownProps> = ({
  isItemNA,
  onChangeItemNA
}) => (
    <div className={clsx(styles['section__list__item__row--gridAction'])}>
      <ActionsIcon />

      <Dropdown>
        {isItemNA ? (
          <DropdownButton
            type="button"
            onClick={() => onChangeItemNA(false)}
            data-testid="button-change-NA-add"
          >
            Add
          </DropdownButton>
        ) : (
          <DropdownButton
            type="button"
            onClick={() => onChangeItemNA(true)}
            data-testid="button-change-NA"
          >
            NA
          </DropdownButton>
        )}
      </Dropdown>
    </div>
  );

SectionItemDropdown.defaultProps = {};

export default SectionItemDropdown;
