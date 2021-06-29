import { render } from '@testing-library/react';
import DropdownLink from './index';

describe('Unit | Common | Dropdown | Link', () => {
  it('matches prior snapshot', () => {
    const props = {
      href: '/properties/'
    };
    const { container } = render(
      <DropdownLink {...props}>Delete</DropdownLink>
    );
    expect(container).toMatchSnapshot();
  });

  it('allows dynamic setting text on link', () => {
    const expected = 'Delete';
    const props = {
      href: '/properties/'
    };
    const { container } = render(
      <DropdownLink {...props}>Delete</DropdownLink>
    );

    const actual = container.querySelector(
      '[data-testid=dropdown-link]'
    ).textContent;

    expect(actual).toEqual(expected);
  });

  it('allows dynamic setting href on link', () => {
    const expected = '/properties';
    const props = {
      href: '/properties'
    };
    const { container } = render(
      <DropdownLink {...props}>Delete</DropdownLink>
    );

    const actual = container.querySelector('a').getAttribute('href');

    expect(actual).toEqual(expected);
  });
});
