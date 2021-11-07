/* eslint-disable camelcase */
interface inspectionTemplateItem {
  id?: string;
  deficient: boolean;
  index: number;
  isItemNA?: boolean;
  isTextInputItem?: boolean;
  itemType: string;
  title: string;
  mainInputType?: string;
  mainInputZeroValue?: number;
  mainInputOneValue?: number;
  mainInputTwoValue?: number;
  mainInputThreeValue?: number;
  mainInputFourValue?: number;
  textInputValue?: string;
  mainInputNotes?: string;
  notes?: boolean;
  photos?: boolean;
  inspectorNotes?: string;
  sectionId: string;
  signatureDownloadURL?: string;
  signatureTimestampKey?: string;
  mainInputSelected?: boolean;
  mainInputSelection?: number;
  version?: number;
}

export default inspectionTemplateItem;
