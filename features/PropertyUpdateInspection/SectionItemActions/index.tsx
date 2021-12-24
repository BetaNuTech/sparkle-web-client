import { FunctionComponent } from 'react';

interface DropdownProps {
  isItemNA: boolean;
  onChangeItemNA(isItemNA: boolean): void;
}

const SectionItemActions: FunctionComponent<DropdownProps> = ({
  isItemNA,
  onChangeItemNA
}) => (
  <div>
    {isItemNA ? (
      <button
        type="button"
        onClick={() => onChangeItemNA(false)}
        data-testid="button-change-NA-add"
      >
        ADD
      </button>
    ) : (
      <button
        type="button"
        onClick={() => onChangeItemNA(true)}
        data-testid="button-change-NA"
      >
        NA
      </button>
    )}
  </div>
);

SectionItemActions.defaultProps = {};

export default SectionItemActions;
