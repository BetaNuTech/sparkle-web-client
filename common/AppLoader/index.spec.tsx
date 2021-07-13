import { render, screen } from '@testing-library/react';
import AppLoader from './index';

describe('Unit | Common | App Loader', () => {
  it('matches prior snapshot', () => {
    const expected = 'Custom Text';
    render(<AppLoader title="Custom Text" />);

    const title = screen.queryByTestId('app-loader-text');
    const actual = title.textContent;
    expect(actual).toEqual(expected);
  });
});
