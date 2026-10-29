import {
  PENDING_UPLOADS_TITLE,
  findPendingUploadsMessage
} from './pendingUploads';

describe('Unit | Common | Utils | API | Pending Uploads', () => {
  test('it finds the first pending uploads message by its title', () => {
    const expected = {
      title: PENDING_UPLOADS_TITLE,
      detail: 'inspection "abc" has 3 photo(s) still uploading'
    };

    const actual = findPendingUploadsMessage([
      { title: 'Oversized inspection', detail: 'too big' },
      null,
      expected,
      { title: PENDING_UPLOADS_TITLE, detail: 'second match' }
    ]);

    expect(actual).toEqual(expected);
  });

  test('it returns null when no message is about pending uploads', () => {
    const expected = null;
    [
      undefined,
      null,
      [],
      [{ title: 'Oversized inspection', detail: 'too big' }],
      [{ name: 'unknown', title: '', detail: 'inspection "abc" not completed' }]
    ].forEach((messages) => {
      expect(findPendingUploadsMessage(messages)).toEqual(expected);
    });
  });
});
