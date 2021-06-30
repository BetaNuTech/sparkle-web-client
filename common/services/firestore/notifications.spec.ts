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

  test('it compiles all templates including all possible values', () => {
    const tests = [
      {
        template: 'property-creation-summary',
        values: ['name', 'authorName']
      },
      {
        template: 'property-creation-markdown-body',
        values: [
          'name',
          'addr1',
          'addr2',
          'city',
          'state',
          'zip',
          'teamName',
          'code',
          'slackChannel',
          'templateNames',
          'bannerPhotoURL',
          'photoURL',
          'authorName',
          'authorEmail'
        ]
      },
      {
        template: 'property-update-summary',
        values: ['name', 'authorName']
      },
      {
        template: 'property-update-markdown-body',
        values: [
          'previousName',
          'previousAddr1',
          'previousAddr2',
          'previousCity',
          'previousState',
          'previousZip',
          'previousTeamName',
          'previousCode',
          'previousSlackChannel',
          'previousTemplateNames',
          'previousBannerPhotoURL',
          'previousPhotoURL',
          'currentName',
          'currentAddr1',
          'currentAddr2',
          'currentCity',
          'currentState',
          'currentZip',
          'currentTeamName',
          'currentCode',
          'currentSlackChannel',
          'currentTemplateNames',
          'currentBannerPhotoURL',
          'currentPhotoURL',
          'authorName',
          'authorEmail'
        ]
      },
      {
        template: 'property-delete-summary',
        values: ['name', 'authorName']
      },
      {
        template: 'property-delete-markdown-body',
        values: ['name', 'authorName', 'authorEmail']
      },
      {
        template: 'template-creation-summary',
        values: ['name', 'authorName']
      },
      {
        template: 'template-creation-markdown-body',
        values: [
          'name',
          'description',
          'category',
          'sectionsCount',
          'itemsCount',
          'authorName',
          'authorEmail'
        ]
      },
      {
        template: 'template-update-summary',
        values: ['name', 'authorName']
      },
      {
        template: 'template-update-markdown-body',
        values: [
          'previousName',
          'previousDescription',
          'previousCategory',
          'previousSectionsCount',
          'previousItemsCount',
          'currentName',
          'currentDescription',
          'currentCategory',
          'currentSectionsCount',
          'currentItemsCount',
          'authorName',
          'authorEmail'
        ]
      },
      {
        template: 'template-delete-summary',
        values: ['name', 'authorName']
      },
      {
        template: 'template-delete-markdown-body',
        values: ['name', 'authorName', 'authorEmail']
      },
      {
        template: 'property-trello-integration-update-summary',
        values: ['authorName']
      },
      {
        template: 'property-trello-integration-update-markdown-body',
        values: [
          'previousOpenBoard',
          'previousOpenList',
          'previousClosedBoard',
          'previousClosedList',
          'currentOpenBoard',
          'currentOpenList',
          'currentClosedBoard',
          'currentClosedList',
          'authorName',
          'authorEmail'
        ]
      },
      {
        template: 'deficient-item-state-change-summary',
        values: ['title', 'previousState', 'state', 'authorName']
      },
      {
        template: 'deficient-item-state-change-markdown-body',
        values: [
          'previousState',
          'state',
          'title',
          'section',
          'subSection',
          'currentDueDateDay',
          'currentDeferredDateDay',
          'currentPlanToFix',
          'currentResponsibilityGroup',
          'currentProgressNote',
          {
            currentProgressNote: 'currentProgressNote',
            progressNoteDateDay: 'progressNoteDateDay'
          },
          'currentCompleteNowReason',
          'currentReasonIncomplete',
          'url',
          'trelloUrl',
          'authorName',
          'authorEmail'
        ]
      },
      {
        template: 'deficient-item-update-summary',
        values: ['title', 'authorName']
      },
      {
        template: 'deficient-item-update-markdown-body',
        values: [
          'title',
          'section',
          'subSection',
          'currentDueDateDay',
          'currentDeferredDateDay',
          'currentPlanToFix',
          'currentResponsibilityGroup',
          'currentProgressNote',
          {
            currentProgressNote: 'currentProgressNote',
            progressNoteDateDay: 'progressNoteDateDay'
          },
          'currentCompleteNowReason',
          'currentReasonIncomplete',
          'url',
          'trelloUrl',
          'authorName',
          'authorEmail'
        ]
      },
      {
        template: 'deficient-item-progress-note-markdown-body',
        values: [
          'progressNote',
          'title',
          'section',
          'subSection',
          'dueDateDay',
          'currentResponsibilityGroup',
          'currentPlanToFix',
          'authorName',
          'authorEmail'
        ]
      },
      {
        template: 'deficient-item-trello-card-create-summary',
        values: ['title', 'authorName']
      },
      {
        template: 'deficient-item-trello-card-create-markdown-body',
        values: [
          'title',
          'section',
          'subSection',
          'trelloCardURL',
          'authorName',
          'authorEmail'
        ]
      },

      {
        template: 'template-category-created-summary',
        values: ['name', 'authorName']
      },
      {
        template: 'template-category-created-markdown-body',
        values: ['name', 'authorName', 'authorEmail']
      },
      {
        template: 'template-category-update-summary',
        values: ['previousName', 'name', 'authorName']
      },
      {
        template: 'template-category-update-markdown-body',
        values: ['previousName', 'name', 'authorName', 'authorEmail']
      },
      {
        template: 'template-category-delete-summary',
        values: ['name', 'authorName']
      },
      {
        template: 'template-category-delete-markdown-body',
        values: ['name', 'authorName', 'authorEmail']
      },
      {
        template: 'team-created-summary',
        values: ['name', 'authorName']
      },
      {
        template: 'team-created-markdown-body',
        values: ['name', 'authorName', 'authorEmail']
      },
      {
        template: 'team-update-summary',
        values: ['previousName', 'name', 'authorName']
      },
      {
        template: 'team-update-markdown-body',
        values: ['previousName', 'name', 'authorName', 'authorEmail']
      },
      {
        template: 'team-delete-summary',
        values: ['name', 'authorName']
      },
      {
        template: 'team-delete-markdown-body',
        values: ['name', 'authorName', 'authorEmail']
      },
      {
        template: 'inspection-completion-summary',
        values: ['completionDate', 'authorName', 'authorEmail', 'templateName']
      },
      {
        template: 'inspection-completion-markdown-body',
        values: [
          'templateName',
          'startDate',
          'score',
          'deficientItemCount',
          'url',
          'authorName',
          'authorEmail'
        ]
      },
      {
        template: 'inspection-delete-summary',
        values: ['currentDate', 'authorName']
      },
      {
        template: 'inspection-delete-markdown-body',
        values: ['templateName', 'startDate', 'authorName', 'authorEmail']
      },
      {
        template: 'inspection-reassign-summary',
        values: ['currentDate', 'authorName']
      },
      {
        template: 'inspection-reassign-markdown-body',
        values: [
          'templateName',
          'startDate',
          'propertyName',
          'authorName',
          'authorEmail'
        ]
      },
      {
        template: 'user-disabled-summary',
        values: ['disabledEmail', 'authorName']
      },
      {
        template: 'user-disabled-markdown-body',
        values: ['disabledName', 'disabledEmail', 'authorName', 'authorEmail']
      },
      {
        template: 'user-update-summary',
        values: ['userEmail', 'authorName']
      },
      {
        template: 'user-update-markdown-body',
        values: [
          'previousName',
          'previousAdmin',
          'previousCorporate',
          'previousTeamCount',
          'previousPropertyCount',
          'currentName',
          'currentAdmin',
          'currentCorporate',
          'currentTeamCount',
          'currentPropertyCount',
          'authorName',
          'authorEmail'
        ]
      },
      {
        template: 'user-login-summary',
        values: ['email']
      },
      {
        template: 'user-login-markdown-body',
        values: ['email']
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { template, values } = tests[i];

      for (let k = 0; k < values.length; k += 1) {
        const value = values[k];
        const data = Object.create(null);

        if (typeof value === 'object') {
          Object.assign(data, value);
        } else {
          data[value] = value;
        }

        // eslint-disable-next-line
        const result = notifications.compileTemplate(template, data);
        const actual = result.search(`${value}`) > -1;
        expect(actual).toBeTruthy();
      }
    }
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
