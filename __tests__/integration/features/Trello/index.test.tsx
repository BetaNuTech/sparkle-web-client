import sinon from 'sinon';
import Router from 'next/router';
import {
  render as rtlRender,
  screen,
  waitFor,
  act
} from '@testing-library/react';
import { Context as ResponsiveContext } from 'react-responsive';
import { FirebaseAppProvider } from 'reactfire';
import userEvent from '@testing-library/user-event';
import { ToastContainer } from 'react-toastify';
import {
  trelloBoards,
  trelloLists,
  trelloUser,
  propertyTrelloIntegration
} from '../../../../__mocks__/trello';
import { fullProperty } from '../../../../__mocks__/properties';
import Trello from '../../../../features/Trello';
import breakpoints from '../../../../config/breakpoints';
import firebaseConfig from '../../../../config/firebase';
import trelloApi from '../../../../common/services/api/trello';
import integrationsDb from '../../../../common/services/firestore/integrations';

function render(ui: any, options: any = {}) {
  const contextWidth = options.contextWidth || breakpoints.desktop.minWidth;
  return rtlRender(
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <ResponsiveContext.Provider value={{ width: contextWidth }}>
        {ui}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
        />
      </ResponsiveContext.Provider>
    </FirebaseAppProvider>,
    options
  );
}

describe('Integration | Features | Trello', () => {
  afterEach(() => sinon.restore());

  it('submits user property trello selections to be saved', async () => {
    const expected = true;

    // Stubs
    const putReq = sinon
      .stub(integrationsDb, 'updatePropertyTrelloRecord')
      .resolves(propertyTrelloIntegration);
    sinon.stub(Router, 'push').returns();
    sinon.stub(trelloApi, 'findAllBoardLists').resolves(trelloLists);

    const props = {
      property: fullProperty,
      isOnline: true,
      trelloUser,
      trelloProperty: propertyTrelloIntegration,
      trelloBoards,
      hasUpdateCompanySettingsPermission: true,
      redirectToProperty: () => true
    };
    render(<Trello {...props} />);

    await act(async () => {
      await waitFor(() => screen.queryByTestId('trello-modal'));

      const boardsPill = screen.getByTestId('open-boards-pill');
      await userEvent.click(boardsPill);

      await waitFor(() => screen.queryByTestId('selection-modal'));
      const board1 = screen.getByTestId('checkbox-item-board-1');
      const close = screen.getByTestId('close-selection');
      const save = screen.getByTestId('save-button');

      await userEvent.click(board1);
      await userEvent.click(close);
      await userEvent.click(save);
    });

    const actual = putReq.called;
    expect(actual).toEqual(expected);
  });

  it('renders all trello boards in selection modal', async () => {
    const expected = [trelloBoards[0].id, trelloBoards[1].id].join(' | ');

    // Stubs
    sinon.stub(trelloApi, 'findAllBoardLists').resolves(trelloLists);

    const props = {
      property: fullProperty,
      isOnline: true,
      trelloUser,
      trelloProperty: propertyTrelloIntegration,
      trelloBoards,
      hasUpdateCompanySettingsPermission: true,
      redirectToProperty: () => true
    };
    render(<Trello {...props} />);

    const results = [];
    await act(async () => {
      await waitFor(() => screen.queryByTestId('trello-modal'));

      const boardsPill = screen.getByTestId('open-boards-pill');
      await userEvent.click(boardsPill);

      await waitFor(() => screen.queryByTestId('selection-modal'));
      const board1 = screen.getByTestId(
        `checkbox-item-${trelloBoards[0].id}`
      ) as HTMLInputElement;
      results.push(board1 ? board1.value : '');
      const board2 = screen.getByTestId(
        `checkbox-item-${trelloBoards[1].id}`
      ) as HTMLInputElement;
      results.push(board2 ? board2.value : '');
    });

    const actual = results.join(' | ');
    expect(actual).toEqual(expected);
  });

  it('renders all a trello boards lists in selection modal', async () => {
    const expected = [trelloLists[0].id, trelloLists[1].id].join(' | ');

    // Stubs
    sinon.stub(trelloApi, 'findAllBoardLists').resolves(trelloLists);

    const props = {
      property: fullProperty,
      isOnline: true,
      trelloUser,
      trelloProperty: propertyTrelloIntegration,
      trelloBoards,
      hasUpdateCompanySettingsPermission: true,
      redirectToProperty: () => true
    };
    render(<Trello {...props} />);

    const results = [];
    await act(async () => {
      await waitFor(() => screen.queryByTestId('trello-modal'));
      await waitFor(() => {
        const listPill = screen.getByTestId('open-lists-pill');
        const content = (listPill && listPill.textContent) || '';
        return content.search(/loading/i) > -1;
      });

      const listsPill = screen.getByTestId('open-lists-pill');
      await userEvent.click(listsPill);
      await waitFor(() => screen.queryByTestId('selection-modal'));

      const list1 = screen.getByTestId(
        `checkbox-item-${trelloLists[0].id}`
      ) as HTMLInputElement;
      results.push(list1 ? list1.value : '');
      const list2 = screen.getByTestId(
        `checkbox-item-${trelloLists[1].id}`
      ) as HTMLInputElement;
      results.push(list2 ? list2.value : '');
    });

    const actual = results.join(' | ');
    expect(actual).toEqual(expected);
  });
});
