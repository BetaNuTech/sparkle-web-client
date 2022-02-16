import { render, screen } from '@testing-library/react';
import moment from 'moment';
import getResponsibilityGroup from '../../../../../common/utils/deficientItem/getResponsibilityGroup';
import createDeficientItem from '../../../../../__tests__/helpers/createDeficientItem';
import stubIntersectionObserver from '../../../../../__tests__/helpers/stubIntersectionObserver';
import dateUtils from '../../../../../common/utils/date';
import ItemIcon from './index';

describe('Unit | Features | Deficient Items | State Groups | List | Item', () => {
  beforeEach(() => stubIntersectionObserver());

  it('should render "Not Set" item dont have current responsibility group', () => {
    const deficientItem = createDeficientItem({
      state: 'pending',
      currentResponsibilityGroup: null
    });

    render(
      <ItemIcon
        deficientItem={deficientItem}
        selectedDeficiencies={[]}
        forceVisible
      />
    );
    const currentResponsibilityGroupEl = screen.queryByTestId(
      'current-responsibility-group'
    );

    expect(currentResponsibilityGroupEl).toHaveTextContent('Not Set');
  });

  it('should render current responsibility group', () => {
    const deficientItem = createDeficientItem({
      state: 'pending',
      currentResponsibilityGroup: 'site_level_in-house'
    });

    render(
      <ItemIcon
        deficientItem={deficientItem}
        selectedDeficiencies={[]}
        forceVisible
      />
    );
    const currentResponsibilityGroupEl = screen.queryByTestId(
      'current-responsibility-group'
    );
    const responsibilityGroupLabel = getResponsibilityGroup(
      deficientItem.currentResponsibilityGroup
    );
    expect(currentResponsibilityGroupEl).toHaveTextContent(
      responsibilityGroupLabel
    );
  });

  it('should render Duplicate if item state is closed and its duplicate', () => {
    const deficientItem = createDeficientItem({
      state: 'closed',
      isDuplicate: true
    });

    render(
      <ItemIcon
        deficientItem={deficientItem}
        selectedDeficiencies={[]}
        forceVisible
      />
    );
    const badgeEl = screen.queryByTestId('item-right-badge');

    expect(badgeEl).toHaveTextContent('Duplicate');
  });

  it('should render current deferred date in MM/DD/YYYY format', () => {
    const currentDeferredDate = moment().unix();
    const expected =
      dateUtils.toUserDateDisplayWithFullYear(currentDeferredDate);
    const deficientItem = createDeficientItem({
      state: 'closed',
      currentDeferredDate
    });

    render(
      <ItemIcon
        deficientItem={deficientItem}
        selectedDeficiencies={[]}
        forceVisible
      />
    );
    const badgeEl = screen.queryByTestId('item-right-badge');

    expect(badgeEl).toHaveTextContent(expected);
  });

  it('should render current due date in MM/DD/YYYY format', () => {
    const currentDueDate = moment().unix();
    const expected = dateUtils.toUserDateDisplayWithFullYear(currentDueDate);
    const deficientItem = createDeficientItem({
      state: 'closed',
      currentDueDate
    });

    render(
      <ItemIcon
        deficientItem={deficientItem}
        selectedDeficiencies={[]}
        forceVisible
      />
    );
    const badgeEl = screen.queryByTestId('item-right-badge');

    expect(badgeEl).toHaveTextContent(expected);
  });

  it('should render item title', () => {
    const deficientItem = createDeficientItem({
      state: 'pending'
    });

    render(
      <ItemIcon
        deficientItem={deficientItem}
        selectedDeficiencies={[]}
        forceVisible
      />
    );
    const titleEl = screen.queryByTestId('item-title');

    expect(titleEl).toHaveTextContent(deficientItem.itemTitle);
  });

  it('should render section title', () => {
    const deficientItem = createDeficientItem({
      state: 'pending'
    });

    render(
      <ItemIcon
        deficientItem={deficientItem}
        selectedDeficiencies={[]}
        forceVisible
      />
    );
    const sectionTitleEl = screen.queryByTestId('section-title');

    expect(sectionTitleEl).toHaveTextContent(deficientItem.sectionTitle);
  });

  it('should render section sub title if relevant', () => {
    const deficientItem = createDeficientItem({
      state: 'pending',
      sectionSubtitle: 'section sub title'
    });
    render(
      <ItemIcon
        deficientItem={deficientItem}
        selectedDeficiencies={[]}
        forceVisible
      />
    );
    const sectionTitleEl = screen.queryByTestId('section-sub-title');

    expect(sectionTitleEl).toHaveTextContent(deficientItem.sectionSubtitle);
  });

  it('should not render section sub title if not present', () => {
    const deficientItem = createDeficientItem({
      state: 'pending',
      sectionSubtitle: ''
    });
    render(
      <ItemIcon
        deficientItem={deficientItem}
        selectedDeficiencies={[]}
        forceVisible
      />
    );
    const sectionTitleEl = screen.queryByTestId('section-sub-title');

    expect(sectionTitleEl).toBeNull();
  });
});
