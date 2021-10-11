import sinon from 'sinon';
import bidsApi from '../../../common/services/firestore/bids';
import utilApi from '../../../common/services/firestore/util';
import { openBid } from '../../../__mocks__/bids';
import uploadAttachment from './uploadAttachment';
import stubFirestore from '../../../__tests__/helpers/stubFirestore';

describe('Unit | Features | Property Profile | Services | Upload Attachment', () => {
  afterEach(() => sinon.restore());

  test('it throws error on error call', async () => {
    const firestore = stubFirestore(); // eslint-disable-line
    sinon.stub(firestore, 'collection').callThrough();
    sinon.stub(utilApi, 'createId').callThrough();
    sinon.stub(bidsApi, 'addBidAttachment').rejects();

    const file = new File(['(⌐□_□)'], 'test.png', { type: 'image/png' });

    await expect(
      uploadAttachment.updateBidAttachment(firestore, openBid, file, {
        fileUrl: '',
        fileDestination: ''
      })
    ).rejects.toThrowError(Error);
  });
});
