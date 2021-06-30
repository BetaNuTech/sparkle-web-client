import sinon from 'sinon';
import { getOnlineStatus } from './getOnlineStatus.js';

describe('Unit | Common | Utils | Get Online Status', () => {
  afterEach(() => sinon.restore());

  test('it defaults to online when online status lookup is unsupported', () => {
    const expected = true;
    sinon.stub(navigator, 'onLine').returns(false);

    const actual = getOnlineStatus();
    expect(actual).toEqual(expected);
  });
});
