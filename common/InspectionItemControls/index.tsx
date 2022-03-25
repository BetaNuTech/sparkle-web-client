import { FunctionComponent, MouseEvent, ChangeEvent } from 'react';
import InspectionTemplateItemModal from '../models/inspectionTemplateItem';
import TwoActionCheck from './TwoActionCheck';
import TwoActionThumb from './TwoActionThumb';
import ThreeActionCheckExclamation from './ThreeActionCheckExclamation';
import ThreeActionAbc from './ThreeActionAbc';
import FiveActionOneToFive from './FiveActionOneToFive';
import OneActionNotes from './OneActionNotes';
import Attachment from './Attachment';
import TextInput from './TextInput';
import Signature from './Signature';

interface Props {
  item: InspectionTemplateItemModal;
  signatureDownloadURL?: string;
  onMainInputChange?(event: MouseEvent<HTMLLIElement>, value: number): void;
  onMainInputMouseDown?(event: MouseEvent<HTMLLIElement>, value: number): void;
  onTextInputChange?(event: ChangeEvent<HTMLInputElement>, value: string): void;
  onClickOneActionNotes?(): void;
  onClickSignatureInput?(): void;
  canEdit: boolean;
  showValues?: boolean;
  selectedToScore?: number;
}

const InspectionItemControls: FunctionComponent<Props> = ({
  item,
  signatureDownloadURL,
  onMainInputChange,
  onMainInputMouseDown,
  onTextInputChange,
  onClickOneActionNotes,
  onClickSignatureInput,
  canEdit,
  showValues,
  selectedToScore
}) => {
  // Adding support for old item schemas
  // when `isTextInputItem` then always make it
  // a text input otherwise accept main input type
  // and lastly use any available item type
  let inputType = item.isTextInputItem
    ? 'text_input'
    : (item.itemType || '').toLowerCase();

  // Use main input type as type for main
  // all main items
  if (inputType === 'main') {
    inputType = `${item.mainInputType || ''}`.toLowerCase();
  }

  const selected = Boolean(item.mainInputSelected);
  const mainInputSelection =
    typeof item.mainInputSelection === 'number' ? item.mainInputSelection : -1;
  const textInputValue = `${item.textInputValue || ''}`;

  switch (inputType) {
    case 'twoactions_checkmarkx':
      return (
        <TwoActionCheck
          item={item}
          selected={selected}
          value={mainInputSelection}
          selectedToScore={selectedToScore}
          onChange={onMainInputChange}
          onMouseDown={onMainInputMouseDown}
          canEdit={canEdit}
          showValues={showValues}
        />
      );
    case 'threeactions_checkmarkexclamationx':
      return (
        <ThreeActionCheckExclamation
          item={item}
          selected={selected}
          value={mainInputSelection}
          selectedToScore={selectedToScore}
          onChange={onMainInputChange}
          onMouseDown={onMainInputMouseDown}
          canEdit={canEdit}
          showValues={showValues}
        />
      );
    case 'threeactions_abc':
      return (
        <ThreeActionAbc
          item={item}
          selected={selected}
          value={mainInputSelection}
          selectedToScore={selectedToScore}
          onChange={onMainInputChange}
          onMouseDown={onMainInputMouseDown}
          canEdit={canEdit}
          showValues={showValues}
        />
      );
    case 'fiveactions_onetofive':
      return (
        <FiveActionOneToFive
          item={item}
          selected={selected}
          value={mainInputSelection}
          selectedToScore={selectedToScore}
          onChange={onMainInputChange}
          onMouseDown={onMainInputMouseDown}
          canEdit={canEdit}
          showValues={showValues}
        />
      );
    case 'oneaction_notes':
      return (
        <OneActionNotes
          onClick={onClickOneActionNotes}
          selected={selected}
          showValues={showValues}
        />
      );
    case 'text_input':
      return (
        <TextInput
          selected={selected}
          value={textInputValue}
          onChange={onTextInputChange}
          canEdit={canEdit}
          showValues={showValues}
        />
      );
    case 'signature':
      return (
        <Signature
          downloadURL={signatureDownloadURL}
          onClick={onClickSignatureInput}
          canEdit={canEdit}
          showValues={showValues}
        />
      );

    // Rendering two action thumb as default
    // for when item is missing main input type
    // (assuming an item is not text input or signature)
    // it will fallback to this input
    default:
      return (
        <TwoActionThumb
          item={item}
          selected={selected}
          value={mainInputSelection}
          selectedToScore={selectedToScore}
          onChange={onMainInputChange}
          onMouseDown={onMainInputMouseDown}
          canEdit={canEdit}
          showValues={showValues}
        />
      );
  }
};

InspectionItemControls.defaultProps = {};

export { Attachment };

export default InspectionItemControls;
