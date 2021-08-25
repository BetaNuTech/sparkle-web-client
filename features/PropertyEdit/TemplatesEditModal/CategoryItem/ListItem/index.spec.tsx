import { render, screen } from '@testing-library/react';
import { templateA, templateC } from '../../../../../__mocks__/templates';
import ListItem from './index';

describe('Unit | Features | Property Edit | Templates Edit Modal | Category Item | List Item', () => {
  it('should render selected templates', () => {
    const expected = true;
    const props = {
      template: templateA,
      selectedTemplates: [templateA.id],
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      updateTempatesList: () => []
    };
    render(<ListItem {...props} />);

    const item = screen.getByTestId(
      `checkbox-item-${templateA.id}`
    ) as HTMLInputElement;

    const actual = item.checked;
    expect(actual).toEqual(expected);
  });

  it('should render name and description of the template', () => {
    const props = {
      template: templateA,
      selectedTemplates: [''],
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      updateTempatesList: () => []
    };
    const { container } = render(<ListItem {...props} />);
    const templateName = container.querySelector('[data-testid=template-name]');
    const templateDesc = container.querySelector('[data-testid=template-desc]');

    expect(templateName.textContent).toEqual('Hall');
    expect(templateDesc.textContent).toEqual('Template for hall inspection');
  });

  it('should render no description text for template that has no description', () => {
    const props = {
      template: templateC,
      selectedTemplates: [''],
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      updateTempatesList: () => []
    };
    const { container } = render(<ListItem {...props} />);
    const templateDesc = container.querySelector('[data-testid=template-desc]');

    expect(templateDesc.textContent).toEqual('No description');
  });
});
