import { render, screen } from '@testing-library/react';
import sinon from 'sinon';
import Details from './index';
import dateUtils from '../../utils/date';
import { deficientItem } from '../../../__mocks__/deficientItems';

describe('Unit | Common | Deficient Item Controls | Details ', () => {
  afterEach(() => sinon.restore());

  it('renders the creation date in the local timezone', () => {
    const expected = dateUtils.toUserFullDateDisplay(deficientItem.createdAt);
    render(
      <Details
        deficientItem={deficientItem}
        isMobile={false}
        onClickViewPhotos={sinon.spy()}
      />
    );

    const createdAt = screen.queryByTestId('created-at');
    expect(createdAt).toHaveTextContent(expected);
  });

  it('renders the item title', () => {
    const expected = deficientItem.itemTitle;
    render(
      <Details
        deficientItem={deficientItem}
        isMobile={false}
        onClickViewPhotos={sinon.spy()}
      />
    );

    const itemTitle = screen.queryByTestId('item-title');
    expect(itemTitle).toHaveTextContent(expected);
  });

  it('renders the section title', () => {
    const expected = deficientItem.sectionTitle;
    render(
      <Details
        deficientItem={deficientItem}
        isMobile={false}
        onClickViewPhotos={sinon.spy()}
      />
    );

    const sectionTitle = screen.queryByTestId('section-title');
    expect(sectionTitle).toHaveTextContent(expected);
  });

  it('renders the section subtitle when present', () => {
    const expected = 'Section SubTitle';
    render(
      <Details
        deficientItem={{ ...deficientItem, sectionSubtitle: expected }}
        isMobile={false}
        onClickViewPhotos={sinon.spy()}
      />
    );

    const sectionSubTitle = screen.queryByTestId('section-subtitle');
    expect(sectionSubTitle).toHaveTextContent(expected);
  });

  it('should enable view photos button if there are inspection item photos', () => {
    render(
      <Details
        deficientItem={deficientItem}
        isMobile={false}
        onClickViewPhotos={sinon.spy()}
      />
    );

    const viewPhotosButton = screen.queryByTestId('view-photo-button');
    expect(viewPhotosButton).not.toBeDisabled();
  });

  it('should disable view photos button if there are no photos', () => {
    render(
      <Details
        deficientItem={{ ...deficientItem, hasItemPhotoData: false }}
        isMobile={false}
        onClickViewPhotos={sinon.spy()}
      />
    );

    const viewPhotosButton = screen.queryByTestId('view-photo-button');
    expect(viewPhotosButton).toBeDisabled();
  });
});
