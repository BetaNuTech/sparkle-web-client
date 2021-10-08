import { FunctionComponent } from 'react';
import TwoActionCheck from './TwoActionCheck';
import TwoActionThumb from './TwoActionThumb';
import ThreeActionCheckExclamation from './ThreeActionCheckExclamation';
import ThreeActionAbc from './ThreeActionAbc';
import FiveActionOneToFive from './FiveActionOneToFive';
import OneActionNotes from './OneActionNotes';

interface Props {
  inputType: string;
}

const InspectionItemControls: FunctionComponent<Props> = ({ inputType }) => {
  switch (inputType) {
    case 'twoactions_checkmarkx':
      return <TwoActionCheck />;
    case 'twoactions_thumbs':
      return <TwoActionThumb />;
    case 'threeactions_checkmarkexclamationx':
      return <ThreeActionCheckExclamation />;
    case 'threeactions_abc':
      return <ThreeActionAbc />;
    case 'fiveactions_onetofive':
      return <FiveActionOneToFive />;
    case 'oneaction_notes':
      return <OneActionNotes />;
    default:
      return <div></div>;
  }
};

export default InspectionItemControls;
