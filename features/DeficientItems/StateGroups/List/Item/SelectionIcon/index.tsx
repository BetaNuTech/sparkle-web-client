import { FunctionComponent } from 'react';
import CheckmarkSimpleIcon from '../../../../../../public/icons/sparkle/checkmark-simple.svg';
import CancelSimpleIcon from '../../../../../../public/icons/sparkle/cancel-simple.svg';
import ThumbsUpSimpleIcon from '../../../../../../public/icons/sparkle/thumbs-up-simple.svg';
import ThumbsDownSimpleIcon from '../../../../../../public/icons/sparkle/thumbs-down-simple.svg';
import CautionSimpleIcon from '../../../../../../public/icons/sparkle/caution-simple.svg';
import ASimpleIcon from '../../../../../../public/icons/sparkle/a-simple.svg';
import BSimpleIcon from '../../../../../../public/icons/sparkle/b-simple.svg';
import CSimpleIcon from '../../../../../../public/icons/sparkle/c-simple.svg';
import OneSimpleIcon from '../../../../../../public/icons/sparkle/one-simple.svg';
import TwoSimpleIcon from '../../../../../../public/icons/sparkle/two-simple.svg';
import ThreeSimpleIcon from '../../../../../../public/icons/sparkle/three-simple.svg';
import FourSimpleIcon from '../../../../../../public/icons/sparkle/four-simple.svg';
import FiveSimpleIcon from '../../../../../../public/icons/sparkle/five-simple.svg';

const iconsList = {
  TwoActions_checkmarkX: [
    <CheckmarkSimpleIcon
      data-testid="checkmark-simple-icon"
      key="checkmark-0"
    />,
    <CancelSimpleIcon data-testid="cancel-simple-icon" key="checkmark-1" />
  ],
  TwoActions_thumbs: [
    <ThumbsUpSimpleIcon data-testid="thumbsup-simple-icon" key="thumb-0" />,
    <ThumbsDownSimpleIcon data-testid="thumbsdown-simple-icon" key="thumb-1" />
  ],
  ThreeActions_checkmarkExclamationX: [
    <CheckmarkSimpleIcon
      data-testid="checkmark-simple-icon"
      key="checkmarkExclamation-0"
    />,
    <CautionSimpleIcon
      data-testid="caution-simple-icon"
      key="checkmarkExclamation-1"
    />,
    <CancelSimpleIcon
      data-testid="cancel-simple-icon"
      key="checkmarkExclamation-2"
    />
  ],
  ThreeActions_ABC: [
    <ASimpleIcon data-testid="a-simple-icon" key="abc-0" />,
    <BSimpleIcon data-testid="b-simple-icon" key="abc-1" />,
    <CSimpleIcon data-testid="c-simple-icon" key="abc-2" />
  ],
  FiveActions_oneToFive: [
    <OneSimpleIcon data-testid="one-simple-icon" key="oneToFive-0" />,
    <TwoSimpleIcon data-testid="two-simple-icon" key="oneToFive-1" />,
    <ThreeSimpleIcon data-testid="three-simple-icon" key="oneToFive-2" />,
    <FourSimpleIcon data-testid="four-simple-icon" key="oneToFive-3" />,
    <FiveSimpleIcon data-testid="five-simple-icon" key="oneToFive-4" />
  ]
};

interface Props {
  itemMainInputType: string;
  itemMainInputSelection: number;
}

const DeficientItemsStateGroupsListItemSelectionIcon: FunctionComponent<
  Props
> = ({ itemMainInputType, itemMainInputSelection }) => {
  const icon =
    (iconsList[itemMainInputType] &&
      iconsList[itemMainInputType][itemMainInputSelection]) ||
    '';
  return <>{icon}</>;
};

export default DeficientItemsStateGroupsListItemSelectionIcon;
