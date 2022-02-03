import { render, screen } from '@testing-library/react';
import moment from 'moment';
import sinon from 'sinon';
import { deficientItemsHistoryTitles } from '../../../config/deficientItems';
import createDeficientItem from '../../../__tests__/helpers/createDeficientItem';
import dateUtils from '../../../common/utils/date';

import HistoryModal from './index';

describe('Unit | features | Deficient Item Edit | History Modal', () => {
  it('should render title based on history type', () => {
    const historyTypes = Object.keys(deficientItemsHistoryTitles);

    const props = {
      historyType: 'stateHistory',
      onClose: sinon.spy(),
      deficientItem: createDeficientItem(
        { state: 'pending' },
        { stateHistory: 2 }
      ),
      isVisible: true
    };
    const { rerender } = render(<HistoryModal {...props} />);

    // eslint-disable-next-line no-restricted-syntax
    for (const historyType of historyTypes) {
      const componentProps = { ...props, historyType };
      rerender(<HistoryModal {...componentProps} />);
      const titleEl = screen.queryByTestId('history-modal-title');
      expect(titleEl).toHaveTextContent(
        deficientItemsHistoryTitles[historyType]
      );
    }
  });

  it('should render history in ascending order from oldest to newest', () => {
    const deficientItem = createDeficientItem(
      { state: 'pending' },
      { stateHistory: 2 }
    );
    const currentDate = moment().unix();
    const twoDaysBackDate = moment().subtract(2, 'days').unix();

    const currentDateTimeFormatted = `${dateUtils.toUserFullDateDisplay(
      currentDate
    )} at ${dateUtils.toUserTimeDisplay(currentDate)}`;

    const twoDaysBackDateTimeFormatted = `${dateUtils.toUserFullDateDisplay(
      twoDaysBackDate
    )} at ${dateUtils.toUserTimeDisplay(twoDaysBackDate)}`;

    Object.keys(deficientItem.stateHistory).forEach((key, index) => {
      deficientItem.stateHistory[key] = {
        ...deficientItem.stateHistory[key],
        createdAt: index % 2 === 0 ? twoDaysBackDate : currentDate
      };
    });

    const props = {
      historyType: 'stateHistory',
      onClose: sinon.spy(),
      deficientItem,
      isVisible: true
    };
    render(<HistoryModal {...props} />);

    const dateTimeEl = screen.queryAllByTestId('history-created-date-time');

    // first render older date
    expect(dateTimeEl[0]).toHaveTextContent(twoDaysBackDateTimeFormatted);

    // then render newer date
    expect(dateTimeEl[1]).toHaveTextContent(currentDateTimeFormatted);
  });
});
