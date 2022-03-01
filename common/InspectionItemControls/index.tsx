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
  onTextInputChange?(event: ChangeEvent<HTMLInputElement>, value: string): void;
  onClickOneActionNotes?(): void;
  onClickSignatureInput?(): void;
  canEdit: boolean;
}

const InspectionItemControls: FunctionComponent<Props> = ({
  item,
  signatureDownloadURL,
  onMainInputChange,
  onTextInputChange,
  onClickOneActionNotes,
  onClickSignatureInput,
  canEdit
}) => {
  // Adding support for old item schemas
  // when `isTextInputItem` then always make it
  // a text input otherwise accept main input type
  // and lastly use any available item type
  const inputType = item.isTextInputItem
    ? 'text_input'
    : (item.mainInputType || item.itemType || '').toLowerCase();

  const selected = Boolean(item.mainInputSelected);
  const mainInputSelection =
    typeof item.mainInputSelection === 'number' ? item.mainInputSelection : -1;
  const textInputValue = `${item.textInputValue || ''}`;

  switch (inputType) {
    case 'twoactions_checkmarkx':
      return (
        <TwoActionCheck
          selected={selected}
          value={mainInputSelection}
          onChange={onMainInputChange}
          canEdit={canEdit}
        />
      );
    case 'threeactions_checkmarkexclamationx':
      return (
        <ThreeActionCheckExclamation
          selected={selected}
          value={mainInputSelection}
          onChange={onMainInputChange}
          canEdit={canEdit}
        />
      );
    case 'threeactions_abc':
      return (
        <ThreeActionAbc
          selected={selected}
          value={mainInputSelection}
          onChange={onMainInputChange}
          canEdit={canEdit}
        />
      );
    case 'fiveactions_onetofive':
      return (
        <FiveActionOneToFive
          selected={selected}
          value={mainInputSelection}
          onChange={onMainInputChange}
          canEdit={canEdit}
        />
      );
    case 'oneaction_notes':
      return (
        <OneActionNotes onClick={onClickOneActionNotes} selected={selected} />
      );
    case 'text_input':
      return (
        <TextInput
          selected={selected}
          value={textInputValue}
          onChange={onTextInputChange}
          canEdit={canEdit}
        />
      );
    case 'signature':
      return (
        <Signature
          downloadURL={signatureDownloadURL}
          onClick={onClickSignatureInput}
          canEdit={canEdit}
        />
      );

    // Rendering two action thumb as default
    // for when item is missing main input type
    // (assuming an item is not text input or signature)
    // it will fallback to this input
    default:
      return (
        <TwoActionThumb
          selected={selected}
          value={mainInputSelection}
          onChange={onMainInputChange}
          canEdit={canEdit}
        />
      );
  }
};

InspectionItemControls.defaultProps = {};

export { Attachment };

export default InspectionItemControls;
