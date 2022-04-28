import { render, waitFor } from '@testing-library/react';
import sinon from 'sinon';

import Settings from '../../../../features/Settings/index';
import trelloApi from '../../../../common/services/api/trello';
import slackApi from '../../../../common/services/api/slack';
import SlackIntegration from '../../../../common/models/slackIntegration';
import TrelloIntegration from '../../../../common/models/trelloIntegration';
import withTestRouter from '../../../helpers/withTestRouter';
import systemSettings from '../../../../config/systemSettings';
import winLocation from '../../../../common/utils/winLocation';

const TRELLO_API_KEY = systemSettings.trello.apiKey;

describe('Integration | features | Settings', () => {
  afterEach(() => sinon.restore());

  it('should initiate trello authorization when it has trello token with valid token and api key', async () => {
    const apikey = TRELLO_API_KEY;
    // Stub trello api key
    const sandbox = sinon.createSandbox();
    sandbox.stub(systemSettings, 'trello').value({ apiKey: apikey });

    const authToken = 'trello-auth-token-123';
    const expected = {
      apikey,
      authToken
    };
    const authorizationCall = sinon.stub(trelloApi, 'createAuthorization');

    const props = {
      slackIntegration: {} as SlackIntegration,
      trelloIntegration: {} as TrelloIntegration,
      token: authToken,
      code: null,
      sendNotification: sinon.spy()
    };
    render(withTestRouter(<Settings {...props} />));

    await waitFor(() => authorizationCall.called);

    const actual = authorizationCall.getCall(0).args[0];
    expect(actual).toMatchObject(expected);
  });

  it('should initiate slack authorization when it has slack code with valid code and api key', async () => {
    const redirectUri = 'https://google.com/';
    sinon.stub(winLocation, 'getRedirectUrl').callsFake(() => redirectUri);
    const slackCode = 'slack-auth-code-123';

    const expected = {
      redirectUri,
      slackCode
    };
    const authorizationCall = sinon.stub(slackApi, 'createAuthorization');

    const props = {
      slackIntegration: {} as SlackIntegration,
      trelloIntegration: {} as TrelloIntegration,
      token: null,
      code: slackCode,
      sendNotification: sinon.spy()
    };
    render(withTestRouter(<Settings {...props} />));

    await waitFor(() => authorizationCall.called);

    const actual = authorizationCall.getCall(0).args[0];
    expect(actual).toMatchObject(expected);
  });
});
