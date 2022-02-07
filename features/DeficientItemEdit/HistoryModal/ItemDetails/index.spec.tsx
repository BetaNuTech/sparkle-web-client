import { render, screen } from '@testing-library/react';
import createDeficientItem from '../../../../__tests__/helpers/createDeficientItem';
import { deficientItemCurrentStateDescriptions } from '../../../../config/deficientItems';
import ItemDetails from './index';

describe('Unit | features | Deficient Item Edit | History Modal | Item Details', () => {
  it('should not render if history type is not provided', () => {
    const props = {
      historyType: '',
      history: {}
    };
    render(<ItemDetails {...props} />);

    const detailEl = screen.queryByTestId('history-details');
    expect(detailEl).toBeNull();
  });

  it('should render state history if history type is state history and item has state history ', () => {
    const deficientItem = createDeficientItem(
      { state: 'pending' },
      { stateHistory: 1 }
    );
    const stateHistoryKeys = Object.keys(deficientItem.stateHistory)[0];
    const history = deficientItem.stateHistory[stateHistoryKeys[0]];

    const historyDescription =
      deficientItemCurrentStateDescriptions[history.state];

    const expected = historyDescription
      ? `${history.state} - ${historyDescription}`
      : history.state;

    const props = {
      historyType: 'stateHistory',
      history
    };
    render(<ItemDetails {...props} />);

    const detailEl = screen.queryByTestId('history-details');
    expect(detailEl).toHaveTextContent(expected);
  });

  it('should render fallback message "Data missing"', () => {
    const expected = 'Data missing';
    const props = {
      historyType: 'stateHistory',
      history: {}
    };
    render(<ItemDetails {...props} />);

    const detailEl = screen.queryByTestId('history-details');
    expect(detailEl).toHaveTextContent(expected);
  });

  it('should render plans to fix if history type is "plansToFix" and item has plans to fix', () => {
    const deficientItem = createDeficientItem(
      { state: 'pending' },
      { plansToFix: 1 }
    );
    const plansToFixKeys = Object.keys(deficientItem.plansToFix)[0];
    const history = deficientItem.plansToFix[plansToFixKeys[0]];
    const expected = history.planToFix;

    const props = {
      historyType: 'plansToFix',
      history
    };
    render(<ItemDetails {...props} />);

    const detailEl = screen.queryByTestId('history-details');
    expect(detailEl).toHaveTextContent(expected);
  });

  it('should render fallback message "Data missing"', () => {
    const expected = 'Data missing';
    const props = {
      historyType: 'plansToFix',
      history: {}
    };
    render(<ItemDetails {...props} />);

    const detailEl = screen.queryByTestId('history-details');
    expect(detailEl).toHaveTextContent(expected);
  });
});
