import { render, screen } from '@testing-library/react';
import SlideNav from './index';

describe('Integration | Common | SlideNav ', () => {
  it('should render the provided release version', () => {
    const expected = 'v1.1.12';
    const appVersion = expected.replace(/^v/, '');
    render(
      <SlideNav
        appVersion={appVersion}
        isNavOpen={false}
        isOnline={false}
        isStaging={false}
        toggleNavOpen={() => false}
      />
    );
    const result = screen.queryByTestId('app-release-version');
    const actual = `${result.textContent || ''}`.trim();
    expect(actual).toEqual(expected);
  });
});
