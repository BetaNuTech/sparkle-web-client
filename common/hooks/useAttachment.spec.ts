import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import useAttachment from './useAttachment';
import attachmentDb from '../services/firestore/attachments';

const emptyCollectionResult = {
  status: 'success',
  error: null,
  data: []
};

describe('Unit | Common | Hooks | Use Attachment', () => {
  afterEach(() => sinon.restore());

  test('should request attachment record', () => {
    const expected = 'attachment-123';
    const findRecord = sinon
      .stub(attachmentDb, 'findRecord')
      .returns(emptyCollectionResult);
    renderHook(() => useAttachment({}, expected));

    const result = findRecord.firstCall || { args: [] };
    const actual = result.args[1];
    expect(actual).toEqual(expected);
  });
});
