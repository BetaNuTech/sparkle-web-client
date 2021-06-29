import sinon from 'sinon';
import { render } from '@testing-library/react';
import Dropdown, { DropdownLink, DropdownButton } from './index';

const TestLinkItems = () => (
  <>
    <DropdownLink href="/properties/">Add Team</DropdownLink>
    <DropdownLink href="/properties/">Add Property</DropdownLink>
  </>
);

const TestLinkButtons = () => (
  <>
    <DropdownButton>Delete</DropdownButton>
    <DropdownButton>Edit</DropdownButton>
  </>
);

describe('Unit | Common | Dropdown | Link', () => {
  afterEach(() => sinon.restore());

  it('matches prior snapshot', () => {
    const { container } = render(<Dropdown>{TestLinkItems()}</Dropdown>);
    expect(container).toMatchSnapshot();
  });

  it('checks that all the link elements are rendered', () => {
    const expected = 2;
    const { container } = render(<Dropdown>{TestLinkItems()}</Dropdown>);

    const actual = container.querySelectorAll('[data-testid=dropdown-link]');

    expect(actual.length).toEqual(expected);
  });

  it('checks that all the button elements are rendered', () => {
    const expected = 2;
    const { container } = render(<Dropdown>{TestLinkButtons()}</Dropdown>);

    const actual = container.querySelectorAll('[data-testid=dropdown-button]');

    expect(actual.length).toEqual(expected);
  });
});
