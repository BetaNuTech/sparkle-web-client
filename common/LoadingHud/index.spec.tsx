import { render, screen } from '@testing-library/react';
import LoadingHud from './index';

describe('Unit | Common | App Loader', () => {
  it('renders custom loading text', () => {
    const expected = 'Custom Text';
    render(<LoadingHud title="Custom Text" />);

    const title = screen.queryByTestId('api-loader-text');
    const actual = title.textContent;
    expect(actual).toEqual(expected);
  });
});
