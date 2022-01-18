import { render, screen } from '@testing-library/react';
import sinon from 'sinon';
import Details from './index';
import dateUtils from '../../../utils/date';
import createDeficientItem from '../../../../__tests__/helpers/createDeficientItem';

describe('Unit | Common | Deficient Item Edit Form | fields | Details ', () => {
  afterEach(() => sinon.restore());

  it('renders the creation date in the local timezone', () => {
    const deficientItem = createDeficientItem();
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
    const expected = 'test details title';
    const deficientItem = createDeficientItem({ itemTitle: expected });
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
    const expected = 'test details section title';
    const deficientItem = createDeficientItem({ sectionTitle: expected });
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
    const deficientItem = createDeficientItem({ sectionSubtitle: expected });
    render(
      <Details
        deficientItem={deficientItem}
        isMobile={false}
        onClickViewPhotos={sinon.spy()}
      />
    );

    const sectionSubTitle = screen.queryByTestId('section-subtitle');
    expect(sectionSubTitle).toHaveTextContent(expected);
  });

  it('should enable view photos button if there are inspection item photos', () => {
    const deficientItem = createDeficientItem({ hasItemPhotoData: true });
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
    const deficientItem = createDeficientItem({ hasItemPhotoData: false });
    render(
      <Details
        deficientItem={deficientItem}
        isMobile={false}
        onClickViewPhotos={sinon.spy()}
      />
    );

    const viewPhotosButton = screen.queryByTestId('view-photo-button');
    expect(viewPhotosButton).toBeDisabled();
  });
});
