import { FunctionComponent } from 'react';
import TwoActionCheck from './TwoActionCheck';
import TwoActionThumb from './TwoActionThumb';
import ThreeActionCheckExclamation from './ThreeActionCheckExclamation';
import ThreeActionAbc from './ThreeActionAbc';
import FiveActionOneToFive from './FiveActionOneToFive';
import OneActionNotes from './OneActionNotes';
import Attachment from './Attachment';

interface Props {
  inputType: string;
  selected?: boolean;
  selectedValue?: number;
  onMainInputChange?(
    event: React.MouseEvent<HTMLLIElement>,
    selectionIndex: number
  ): void;
}

const InspectionItemControls: FunctionComponent<Props> = ({
  inputType,
  selected,
  selectedValue,
  onMainInputChange
}) => {
  switch (inputType) {
    case 'twoactions_checkmarkx':
      return (
        <TwoActionCheck
          selected={selected}
          selectedValue={selectedValue}
          onMainInputChange={onMainInputChange}
        />
      );
    case 'twoactions_thumbs':
      return (
        <TwoActionThumb
          selected={selected}
          selectedValue={selectedValue}
          onMainInputChange={onMainInputChange}
        />
      );
    case 'threeactions_checkmarkexclamationx':
      return (
        <ThreeActionCheckExclamation
          selected={selected}
          selectedValue={selectedValue}
          onMainInputChange={onMainInputChange}
        />
      );
    case 'threeactions_abc':
      return (
        <ThreeActionAbc
          selected={selected}
          selectedValue={selectedValue}
          onMainInputChange={onMainInputChange}
        />
      );
    case 'fiveactions_onetofive':
      return (
        <FiveActionOneToFive
          selected={selected}
          selectedValue={selectedValue}
          onMainInputChange={onMainInputChange}
        />
      );
    case 'oneaction_notes':
      return <OneActionNotes />;
    default:
      return <div></div>;
  }
};

InspectionItemControls.defaultProps = {
  selected: false,
  selectedValue: 0
};

export { Attachment };

export default InspectionItemControls;
