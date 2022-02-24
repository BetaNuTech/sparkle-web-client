import { render, screen } from '@testing-library/react';
import { admin, teamMember } from '../../__mocks__/users';
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
        user={admin}
      />
    );
    const result = screen.queryByTestId('app-release-version');
    const actual = `${result.textContent || ''}`.trim();
    expect(actual).toEqual(expected);
  });

  it('should not render templates link if user does not have permission', () => {
    const expected = 'v1.1.12';
    const appVersion = expected.replace(/^v/, '');
    render(
      <SlideNav
        appVersion={appVersion}
        isOnline={false}
        isStaging={false}
        toggleNavOpen={() => false}
        user={teamMember}
      />
    );
    const linkEl = screen.queryByTestId('templates-link');
    expect(linkEl).toBeNull();
  });
});
