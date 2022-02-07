import { FunctionComponent } from 'react';
import { deficientItemCurrentStateDescriptions } from '../../../../config/deficientItems';

interface Props {
  history: any;
  historyType: string;
}

const HistoryItemDetails: FunctionComponent<Props> = ({
  history,
  historyType
}) => {
  switch (historyType) {
    case 'stateHistory':
      return history.state ? (
        <span data-testid="history-details">
          <span className="-tt-uppercase">{history.state}</span>{' '}
          {deficientItemCurrentStateDescriptions[history.state] &&
            ` - ${deficientItemCurrentStateDescriptions[history.state]}`}
        </span>
      ) : (
        <span data-testid="history-details">Data missing</span>
      );
      break;
    case 'plansToFix':
      return history.planToFix ? (
        <span data-testid="history-details">{history.planToFix}</span>
      ) : (
        <span data-testid="history-details">Data missing</span>
      );
      break;
    default:
      return <></>;
      break;
  }
};

export default HistoryItemDetails;
