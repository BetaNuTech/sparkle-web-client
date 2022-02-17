import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import sinon from 'sinon';
import createDeficientItem from '../../../../__tests__/helpers/createDeficientItem';
import TrelloCard from './index';

describe('Unit | Common | Deficient Item Edit Form | fields | Trello Card ', () => {
  afterEach(() => sinon.restore());

  it('it reveals link to card when provided and does not show create card action', () => {
    render(
      <TrelloCard
        deficientItem={createDeficientItem({
          state: 'pending',
          trelloCardURL: 'https://google.com'
        })}
        onCreateTrelloCard={sinon.spy()}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
        isOnline={true} // eslint-disable-line react/jsx-boolean-value
        hasOpenList={true} // eslint-disable-line react/jsx-boolean-value
      />
    );

    const trelloCardLink = screen.queryByTestId('trello-card-link');
    const trelloCardAction = screen.queryByTestId('trello-card-action');

    expect(trelloCardLink).toBeTruthy();
    expect(trelloCardAction).toBeFalsy();
  });

  it('it reveals create card action when it does not have trello card url', () => {
    render(
      <TrelloCard
        deficientItem={createDeficientItem({
          state: 'pending',
          trelloCardURL: ''
        })}
        onCreateTrelloCard={sinon.spy()}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
        isOnline={true} // eslint-disable-line react/jsx-boolean-value
        hasOpenList={true} // eslint-disable-line react/jsx-boolean-value
      />
    );

    const trelloCardLink = screen.queryByTestId('trello-card-link');
    const trelloCardAction = screen.queryByTestId('trello-card-action');

    expect(trelloCardLink).toBeFalsy();
    expect(trelloCardAction).toBeTruthy();
  });

  it('it reveals configure trello action when property has not integrated with trello', () => {
    render(
      <TrelloCard
        deficientItem={createDeficientItem({
          state: 'pending',
          trelloCardURL: ''
        })}
        onCreateTrelloCard={sinon.spy()}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
        isOnline={true} // eslint-disable-line react/jsx-boolean-value
        hasOpenList={false}
      />
    );

    const trelloCardLink = screen.queryByTestId('trello-card-link');
    const trelloCardAction = screen.queryByTestId('trello-card-action');
    const configureTrelloAction = screen.queryByTestId(
      'configure-trello-action'
    );

    expect(trelloCardLink).toBeFalsy();
    expect(trelloCardAction).toBeFalsy();
    expect(configureTrelloAction).toBeTruthy();
  });

  it('it triggers create trello card action', () => {
    const expected = true;
    const onCreateTrelloCard = sinon.spy();
    render(
      <TrelloCard
        deficientItem={createDeficientItem({
          state: 'pending',
          trelloCardURL: ''
        })}
        onCreateTrelloCard={onCreateTrelloCard}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
        isOnline={true} // eslint-disable-line react/jsx-boolean-value
        hasOpenList={true} // eslint-disable-line react/jsx-boolean-value
      />
    );

    const trelloCardAction = screen.queryByTestId('trello-card-action');

    act(() => {
      userEvent.click(trelloCardAction);
    });

    const actual = onCreateTrelloCard.called;
    expect(actual).toEqual(expected);
  });
});
