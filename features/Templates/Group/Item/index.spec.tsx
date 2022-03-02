import { render, screen } from '@testing-library/react';
import TemplateItem from './index';
import { templateA } from '../../../../__mocks__/templates';
import stubIntersectionObserver from '../../../../__tests__/helpers/stubIntersectionObserver';

describe('Unit | Features | Templates | Group | Item', () => {
  beforeEach(() => stubIntersectionObserver());

  it('should not render dropdown if user does not have any permission', () => {
    const props = {
      template: templateA,
      canEdit: false,
      canDelete: false,
      canCreate: false,
      forceVisible: true
    };
    render(<TemplateItem {...props} />);

    const dropdownEl = screen.queryByTestId('template-item-dropdown');
    expect(dropdownEl).toBeFalsy();
  });

  it('should not allow user to copy if user does not have permission to create template', () => {
    const props = {
      template: templateA,
      canEdit: true,
      canDelete: true,
      canCreate: false,
      forceVisible: true
    };
    render(<TemplateItem {...props} />);

    const dropdownEl = screen.queryByTestId('template-item-dropdown');
    const copyAction = screen.queryByTestId(
      'template-item-dropdown-copy-action'
    );
    expect(dropdownEl).toBeTruthy();
    expect(copyAction).toBeFalsy();
  });

  it('should disable copy action if user is offline ', () => {
    const props = {
      template: templateA,
      canEdit: true,
      canDelete: true,
      canCreate: true,
      forceVisible: true,
      isOnline: false
    };
    render(<TemplateItem {...props} />);

    const dropdownEl = screen.queryByTestId('template-item-dropdown');
    const copyAction = screen.queryByTestId(
      'template-item-dropdown-copy-action'
    );
    expect(dropdownEl).toBeTruthy();
    expect(copyAction).toBeTruthy();
    expect(copyAction).toBeDisabled();
  });

  it('should not allow user to edit if user does not have permission to update template', () => {
    const props = {
      template: templateA,
      canEdit: false,
      canDelete: true,
      canCreate: true,
      forceVisible: true
    };
    render(<TemplateItem {...props} />);

    const dropdownEl = screen.queryByTestId('template-item-dropdown');
    const editLink = screen.queryByTestId('template-item-dropdown-edit-link');
    expect(dropdownEl).toBeTruthy();
    expect(editLink).toBeFalsy();
  });

  it('should not allow user to delete if user does not have permission to delete template', () => {
    const props = {
      template: templateA,
      canEdit: true,
      canDelete: false,
      canCreate: true,
      forceVisible: true
    };
    render(<TemplateItem {...props} />);

    const dropdownEl = screen.queryByTestId('template-item-dropdown');
    const deleteAction = screen.queryByTestId(
      'template-item-dropdown-delete-action'
    );
    expect(dropdownEl).toBeTruthy();
    expect(deleteAction).toBeFalsy();
  });
});
