import countPendingUploads from './countPendingUploads';
import inspectionTemplateModel from '../../models/inspectionTemplate';

const photo = (downloadURL = '') => ({ caption: '', downloadURL });

describe('Unit | Common | Utils | Inspection | Count Pending Uploads', () => {
  test('it counts nothing for a missing or empty template', () => {
    const expected = 0;
    [undefined, null, {}, { items: {} }, { items: null }].forEach(
      (template) => {
        expect(
          countPendingUploads(template as inspectionTemplateModel)
        ).toEqual(expected);
      }
    );
  });

  test('it counts photos without a download url and signed items without a signature url', () => {
    const expected = 4;
    const template = {
      items: {
        'item-1': {
          photosData: {
            'photo-1': photo(''),
            'photo-2': photo('https://cdn.test/photo-2.jpg'),
            'photo-3': photo()
          }
        },
        'item-2': {
          signatureTimestampKey: '1700000000',
          signatureDownloadURL: ''
        },
        'item-3': {
          signatureTimestampKey: '1700000001',
          signatureDownloadURL: 'https://cdn.test/signature.png',
          photosData: { 'photo-4': photo('') }
        }
      }
    } as unknown as inspectionTemplateModel;

    expect(countPendingUploads(template)).toEqual(expected);
  });

  test('it ignores null items, delete markers and uploaded entries', () => {
    const expected = 0;
    const template = {
      items: {
        'item-1': null,
        'item-2': 'not an item',
        'item-3': {
          photosData: {
            'photo-1': null,
            'photo-2': {},
            'photo-3': photo('https://cdn.test/photo-3.jpg')
          },
          signatureDownloadURL: ''
        },
        'item-4': { photosData: null }
      }
    } as unknown as inspectionTemplateModel;

    expect(countPendingUploads(template)).toEqual(expected);
  });
});
