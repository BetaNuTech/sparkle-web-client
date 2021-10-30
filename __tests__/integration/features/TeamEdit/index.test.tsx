import sinon from 'sinon';
import Router from 'next/router';
import {
  render as rtlRender,
  screen,
  act,
  fireEvent
} from '@testing-library/react';
import { Context as ResponsiveContext } from 'react-responsive';
import { FirebaseAppProvider } from 'reactfire';
import userEvent from '@testing-library/user-event';
import { ToastContainer } from 'react-toastify';
import TeamEdit from '../../../../features/TeamEdit';
import breakpoints from '../../../../config/breakpoints';
import firebaseConfig from '../../../../config/firebase';
import teamsApi from '../../../../common/services/api/teams';

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

describe('Integration | Features | Team Edit', () => {
  afterEach(() => sinon.restore());

  it('creates a new team when it does not exist yet', async () => {
    const expected = true;

    render(<TeamEdit team={{ id: 'new' }} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const postReq = sinon.stub(teamsApi, 'createTeam').resolves({});
    sinon.stub(Router, 'push').returns();

    await act(async () => {
      const [save] = await screen.findAllByTestId('save-button');
      const nameInput = await screen.findByTestId('team-name');
      await fireEvent.change(nameInput, { target: { value: 'New Team' } });
      await userEvent.click(save);
    });

    const actual = postReq.called;
    expect(actual).toEqual(expected);
  });

  it('updates a team when it already exists', async () => {
    const expected = true;
    render(<TeamEdit team={{ id: 'team-1', name: 'Team One' }} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const putReq = sinon.stub(teamsApi, 'updateTeam').resolves({});

    await act(async () => {
      const [save] = await screen.findAllByTestId('save-button');
      const nameInput = await screen.findByTestId('team-name');
      await fireEvent.change(nameInput, { target: { value: 'Update' } });
      await userEvent.click(save);
    });

    const actual = putReq.called;
    expect(actual).toEqual(expected);
  });
});
