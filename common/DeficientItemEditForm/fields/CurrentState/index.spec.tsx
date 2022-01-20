import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import createDeficientItem from '../../../../__tests__/helpers/createDeficientItem';
import CurrentState from './index';

describe('Unit | Common | Deficient Item Edit Form | fields | Current State ', () => {
  afterEach(() => sinon.restore());

  it('should not render show history button if item does not have state history', () => {
    const onShowHistory = sinon.spy();
    render(
      <CurrentState
        deficientItem={createDeficientItem({}, { stateHistory: 0 })}
        isMobile={false}
        onShowHistory={onShowHistory}
      />
    );

    const showHistoryBtn = screen.queryByTestId('show-history-button');
    expect(showHistoryBtn).toBeNull();
  });

  it('should triggers request to show state history when present', async () => {
    const expected = true;
    const onShowHistory = sinon.spy();
    render(
      <CurrentState
        deficientItem={createDeficientItem({}, { stateHistory: 1 })}
        isMobile={false}
        onShowHistory={onShowHistory}
      />
    );

    const showHistoryBtn = screen.queryByTestId('show-history-button');
    expect(showHistoryBtn).toBeTruthy();
    act(() => {
      userEvent.click(showHistoryBtn);
    });
    const actual = onShowHistory.called;
    expect(actual).toBe(expected);
  });
});
