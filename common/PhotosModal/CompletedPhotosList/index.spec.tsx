import sinon from 'sinon';
import { render, screen } from '@testing-library/react';
import moment from 'moment';
import DeficientItemCompletedPhoto from '../../models/deficientItems/deficientItemCompletedPhoto';
import createDeficientItem, {
  createCompletedPhotosTree
} from '../../../__tests__/helpers/createDeficientItem';
import dateUtils from '../../utils/date';
import CompletedPhotosList from './index';

describe('Common | Photos Modal | Completed Photos List', () => {
  afterEach(() => sinon.restore());

  it('should not render if there is no completed photos ', () => {
    const props = {
      onClickPhotoItem: sinon.spy(),
      isProcessingPhotos: false,
      onClickImage: sinon.spy(),
      completedPhotos: {} as DeficientItemCompletedPhoto
    };
    render(<CompletedPhotosList {...props} />);
    const completedPhotosGroup = screen.queryByTestId('completed-photos-group');
    expect(completedPhotosGroup).toBeFalsy();
  });

  it('should render completed photos', () => {
    const deficientItem = createDeficientItem(
      { state: 'pending' },
      { completedPhotos: 1 }
    );

    const props = {
      onClickPhotoItem: sinon.spy(),
      isProcessingPhotos: false,
      onClickImage: sinon.spy(),
      completedPhotos: deficientItem.completedPhotos
    };
    render(<CompletedPhotosList {...props} />);
    const completedPhotosGroup = screen.queryByTestId('completed-photos-group');
    expect(completedPhotosGroup).toBeTruthy();
  });

  it('should group completed photos by start date', () => {
    const date = moment();
    const currentDate = date.unix();
    const towDaysBackDate = date.subtract(2, 'day').unix();
    const completedPhotos = createCompletedPhotosTree(moment().unix(), 6);

    const expectedGroupTitleOne = `COMPLETED: ${dateUtils.toUserFullDateDisplay(
      Number(currentDate)
    )} at ${dateUtils.toUserTimeDisplay(Number(currentDate))}`;
    const expectedGroupTitleTwo = `COMPLETED: ${dateUtils.toUserFullDateDisplay(
      Number(towDaysBackDate)
    )} at ${dateUtils.toUserTimeDisplay(Number(towDaysBackDate))}`;

    Object.keys(completedPhotos).forEach((key, index) => {
      completedPhotos[key] = {
        ...completedPhotos[key],
        startDate: index % 2 === 0 ? towDaysBackDate : currentDate
      };
    });

    const props = {
      onClickPhotoItem: sinon.spy(),
      isProcessingPhotos: false,
      onClickImage: sinon.spy(),
      completedPhotos
    };
    render(<CompletedPhotosList {...props} />);
    const completedPhotosGroup = screen.queryAllByTestId(
      'completed-photos-group'
    );
    expect(completedPhotosGroup).toHaveLength(2);
    expect(completedPhotosGroup[0]).toHaveTextContent(expectedGroupTitleOne);
    expect(completedPhotosGroup[1]).toHaveTextContent(expectedGroupTitleTwo);
  });

  it('should sort completed photos by creation date and render latest first', () => {
    const date = moment();
    const currentDate = date.unix();
    const towDaysBackDate = date.subtract(2, 'day').unix();
    const completedPhotos = createCompletedPhotosTree(moment().unix(), 6);

    Object.keys(completedPhotos).forEach((key, index) => {
      completedPhotos[key] = {
        ...completedPhotos[key],
        startDate: index % 2 === 0 ? towDaysBackDate : currentDate,

        // createdAt value assigned here in accending order
        createdAt: date.add(index, 'hours').unix(),

        // captions value assigned in accending order
        caption: index.toString()
      };
    });

    // group 1 will render odd number in caption
    // and group2 will render even numbers in captin
    // in decending order
    const expectedCaptionsOrder = [5, 3, 1, 4, 2, 0];

    const props = {
      onClickPhotoItem: sinon.spy(),
      isProcessingPhotos: false,
      onClickImage: sinon.spy(),
      completedPhotos
    };
    render(<CompletedPhotosList {...props} />);
    const captionElement = screen.queryAllByTestId(
      'published-photo-item-caption'
    );
    expectedCaptionsOrder.forEach((caption, index) => {
      expect(captionElement[index]).toHaveTextContent(caption.toString());
    });
  });
});
