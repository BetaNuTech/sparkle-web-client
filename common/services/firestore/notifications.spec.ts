import sinon from 'sinon';
import currentUser from '../../utils/currentUser';
import notifications from './notifications';
/* eslint-enable */

describe('Unit | Services | global notifications', () => {
  afterEach(() => sinon.restore());

  test('it throws for bad requests', async () => {
    const firestore = stubFirestore(); // eslint-disable-line
    const queries = [
      { title: 'missing summary', userId: '1' },
      { summary: 'missing title', userId: '2' },
      { title: 'missing creator', summary: 'ok' }
    ];

    for (let i = 0; i < queries.length; i += 1) {
      const query = queries[i];

      try {
        if (query.userId) {
          sinon.stub(currentUser, 'getId').returns(query.userId);
        }
        // eslint-disable-next-line
        await notifications.send(firestore, {
          title: query.title,
          summary: query.summary
        });
        expect(true).toEqual(false); // force throw
      } catch (err) {
        expect(err).toBeTruthy();
      }
    }
  });

  test('it configures creator from account if not specified in arguments', async () => {
    const firestore = stubFirestore(); // eslint-disable-line

    // Setup account lookup test
    const userId = 'two';
    sinon.stub(currentUser, 'getId').returns(userId);

    // Argument
    let expected = 'one';
    // eslint-disable-next-line
    let result = await notifications.send(firestore, {
      title: 'title',
      summary: 'summ',
      creator: expected
    });
    let actual = result.creator;
    expect(actual).toEqual(expected); // finds used id from arguments

    // Account
    expected = userId;
    // eslint-disable-next-line
    result = await notifications.send(firestore, {
      title: 'title',
      summary: 'summ'
    });
    actual = result.creator;
    expect(actual).toEqual(expected); // finds used creator from firebase auth
  });

  test('it adds staging prefix to title in staging environment', async () => {
    const expected = '[STAGING]';
    const firestore = stubFirestore(); // eslint-disable-line

    // eslint-disable-next-line
    const result = await notifications.send(
      firestore,
      {
        title: 't',
        summary: 's',
        creator: '123'
      },
      true
    );

    const [actual] = result.title.split(' ');
    expect(actual).toEqual(expected);
  });

  test('it does not create notifications in incognito mode', async () => {
    const expected = false;
    const firestore = stubFirestore(); // eslint-disable-line
    const writeNotification = sinon.stub(firestore, 'collection').callThrough();
    notifications.setIncognitoMode(true); // eslint-disable-line

    // eslint-disable-next-line
    await notifications.send(firestore, {
      title: 't',
      summary: 's',
      creator: '123'
    });

    const actual = writeNotification.called;
    expect(actual).toEqual(expected);
  });

  test('it adds a new notification to database', async () => {
    const expected = { title: 't', summary: 's', creator: '123' };
    const firestore = stubFirestore(); // eslint-disable-line

    // eslint-disable-next-line
    const actual = await notifications.send(firestore, expected);
    delete actual.userAgent; // environment dependent
    expect(actual).toEqual(expected);
  });
});

function stubFirestore(success = true, err = Error()): any {
  return {
    collection: () => ({
      add: (notification) => {
        if (success) {
          return Promise.resolve(notification);
        }
        return Promise.reject(err);
      }
    })
  };
}
