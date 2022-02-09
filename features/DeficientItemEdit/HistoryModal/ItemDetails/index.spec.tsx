import { render, screen } from '@testing-library/react';
import createDeficientItem from '../../../../__tests__/helpers/createDeficientItem';
import {
  deficientItemCurrentStateDescriptions,
  deficientItemsHistoryTitles
} from '../../../../config/deficientItems';
import dateUtils from '../../../../common/utils/date';
import getResponsibilityGroup from '../../../../common/utils/deficientItem/getResponsibilityGroup';

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
    const stateHistoryKeys = Object.keys(deficientItem.stateHistory);
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

  it('should render plans to fix if history type is "plansToFix" and item has plans to fix', () => {
    const deficientItem = createDeficientItem(
      { state: 'pending' },
      { plansToFix: 1 }
    );
    const plansToFixKeys = Object.keys(deficientItem.plansToFix);
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

  it('should render responsible group if history type is "responsibilityGroups"', () => {
    const deficientItem = createDeficientItem(
      { state: 'pending' },
      { responsibilityGroups: 1 }
    );
    const responsibilityGroupsKeys = Object.keys(
      deficientItem.responsibilityGroups
    );
    const history =
      deficientItem.responsibilityGroups[responsibilityGroupsKeys[0]];

    const expected = getResponsibilityGroup(history.groupResponsible);

    const props = {
      historyType: 'responsibilityGroups',
      history
    };
    render(<ItemDetails {...props} />);

    const detailEl = screen.queryByTestId('history-details');
    expect(detailEl).toHaveTextContent(expected);
  });

  it('should render complete now reason if history type is "completeNowReasons"', () => {
    const deficientItem = createDeficientItem(
      { state: 'pending' },
      { completeNowReasons: 1 }
    );
    const completeNowReasonsKeys = Object.keys(
      deficientItem.completeNowReasons
    );
    const history = deficientItem.completeNowReasons[completeNowReasonsKeys[0]];

    const expected = history.completeNowReason;

    const props = {
      historyType: 'completeNowReasons',
      history
    };
    render(<ItemDetails {...props} />);

    const detailEl = screen.queryByTestId('history-details');
    expect(detailEl).toHaveTextContent(expected);
  });

  it('should render reason incomplete if history type is "reasonsIncomplete"', () => {
    const deficientItem = createDeficientItem(
      { state: 'pending' },
      { reasonsIncomplete: 1 }
    );
    const reasonsIncompleteKeys = Object.keys(deficientItem.reasonsIncomplete);
    const history = deficientItem.reasonsIncomplete[reasonsIncompleteKeys[0]];

    const expected = history.reasonIncomplete;

    const props = {
      historyType: 'reasonsIncomplete',
      history
    };
    render(<ItemDetails {...props} />);

    const detailEl = screen.queryByTestId('history-details');
    expect(detailEl).toHaveTextContent(expected);
  });

  it('should render due date if history type is "dueDates"', () => {
    const deficientItem = createDeficientItem(
      { state: 'pending' },
      { dueDates: 1 }
    );
    const dueDatesKeys = Object.keys(deficientItem.dueDates);
    const history = deficientItem.dueDates[dueDatesKeys[0]];

    const expected = dateUtils.toUserDateDisplay(history.dueDate);

    const props = {
      historyType: 'dueDates',
      history
    };
    render(<ItemDetails {...props} />);

    const detailEl = screen.queryByTestId('history-details');
    expect(detailEl).toHaveTextContent(expected);
  });

  it('should render deferred date if history type is "deferredDates"', () => {
    const deficientItem = createDeficientItem(
      { state: 'deferred' },
      { deferredDates: 1 }
    );
    const deferredDatesKeys = Object.keys(deficientItem.deferredDates);
    const history = deficientItem.deferredDates[deferredDatesKeys[0]];

    const expected = `${dateUtils.toUserFullDateDisplay(
      history.deferredDate
    )} at ${dateUtils.toUserTimeDisplay(history.deferredDate)}`;

    const props = {
      historyType: 'deferredDates',
      history
    };
    render(<ItemDetails {...props} />);

    const detailEl = screen.queryByTestId('history-details');
    expect(detailEl).toHaveTextContent(expected);
  });

  it('should render fallback message "Data missing"', () => {
    const expected = 'Data missing';
    const historyTypes = Object.keys(deficientItemsHistoryTitles);
    const props = {
      historyType: 'responsibilityGroups',
      history: {}
    };
    const { rerender } = render(<ItemDetails {...props} />);

    // eslint-disable-next-line no-restricted-syntax
    for (const historyType of historyTypes) {
      const componentProps = { ...props, historyType };
      rerender(<ItemDetails {...componentProps} />);
      const detailEl = screen.queryByTestId('history-details');
      expect(detailEl).toHaveTextContent(expected);
    }
  });
});
