import { FunctionComponent } from 'react';
import TwoActionCheck from './TwoActionCheck';
import TwoActionThumb from './TwoActionThumb';
import ThreeActionCheckExclamation from './ThreeActionCheckExclamation';
import ThreeActionAbc from './ThreeActionAbc';
import FiveActionOneToFive from './FiveActionOneToFive';
import OneActionNotes from './OneActionNotes';
import Attachment from './Attachment';
import TextInput from './TextInput';

interface Props {
  inputType: string;
  selected?: boolean;
  selectedValue?: number;
  textInputValue?:string;
  onInputChange?(
    event: React.MouseEvent<HTMLLIElement> | React.ChangeEvent<HTMLInputElement>,
    value: string | number
  ): void;
  onClickOneActionNotes(): void;
}

const InspectionItemControls: FunctionComponent<Props> = ({
  inputType,
  selected,
  selectedValue,
  textInputValue,
  onInputChange,
  onClickOneActionNotes
}) => {
  switch (inputType) {
    case 'twoactions_checkmarkx':
      return (
        <TwoActionCheck
          selected={selected}
          selectedValue={selectedValue}
          onMainInputChange={onInputChange}
        />
      );
    case 'twoactions_thumbs':
      return (
        <TwoActionThumb
          selected={selected}
          selectedValue={selectedValue}
          onMainInputChange={onInputChange}
        />
      );
    case 'threeactions_checkmarkexclamationx':
      return (
        <ThreeActionCheckExclamation
          selected={selected}
          selectedValue={selectedValue}
          onMainInputChange={onInputChange}
        />
      );
    case 'threeactions_abc':
      return (
        <ThreeActionAbc
          selected={selected}
          selectedValue={selectedValue}
          onMainInputChange={onInputChange}
        />
      );
    case 'fiveactions_onetofive':
      return (
        <FiveActionOneToFive
          selected={selected}
          selectedValue={selectedValue}
          onMainInputChange={onInputChange}
        />
      );
    case 'oneaction_notes':
      return (
        <OneActionNotes
          onClickOneActionNotes={onClickOneActionNotes}
          selected={selected}
        />
      );
    case 'text_input':
      return (
      <TextInput
        selected={selected}
        textInputValue={textInputValue}
        onMainInputChange={onInputChange}
      />);
    default:
      return <></>;
  }
};

InspectionItemControls.defaultProps = {
  selected: false,
  selectedValue: 0
};

export { Attachment };

export default InspectionItemControls;
