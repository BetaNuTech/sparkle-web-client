import { render } from '@testing-library/react';
import { templateA, templateC } from '../../../../__mocks__/templates';
import ListItem from './index';

describe('Unit | Features | Create Inspection | Category Item | List Item', () => {
  it('should render name and description of the template', () => {
    const { container } = render(<ListItem template={templateA} />);
    const templateName = container.querySelector('[data-testid=template-name]');
    const templateDesc = container.querySelector('[data-testid=template-desc]');

    expect(templateName.textContent).toEqual('Hall');
    expect(templateDesc.textContent).toEqual('Template for hall inspection');
  });

  it('should render no description text for template that has no description', () => {
    const { container } = render(<ListItem template={templateC} />);
    const templateDesc = container.querySelector('[data-testid=template-desc]');

    expect(templateDesc.textContent).toEqual('No description');
  });
});
