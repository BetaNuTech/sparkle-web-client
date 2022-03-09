import sinon from 'sinon';
import { render, screen } from '@testing-library/react';
import { categoryA, categoryB } from '../../../__mocks__/templateCategories';
import BulkUpdateModal from './index';

describe('Unit | Features | Templates | Manage Categories Modal', () => {
  afterEach(() => sinon.restore());

  it('should not render create category action if user does not permission', () => {
    const onClose = sinon.spy();
    const props = {
      isVisible: true,
      onClose,
      templateCategories: [categoryA, categoryB],
      unpublishedCategories: [],
      canCreateCategory: false,
      savingCategories: []
    };
    render(<BulkUpdateModal {...props} />);

    const footerCreateAction = screen.queryByTestId(
      'manage-categories-modal-footer-create-action'
    );
    const createAction = screen.queryByTestId(
      'manage-categories-modal-create-action'
    );

    expect(footerCreateAction).toBeFalsy();
    expect(createAction).toBeFalsy();
  });
});
