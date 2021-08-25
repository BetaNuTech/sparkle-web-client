import sinon from 'sinon';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TemplatesEditModal from './index';

describe('Unit | Features | Property Edit | Templates Edit Modal', () => {
  afterEach(() => sinon.restore());

  it('invokes on close action when on close button clicked', () => {
    const expected = true;
    const onClose = sinon.spy();
    const props = {
      categories: [],
      onClose,
      selectedTemplates: [],
      updateTempatesList: () => [],
      isVisible: true,
      changeTeamSelection: () => true
    };
    render(<TemplatesEditModal {...props} />);

    const closeButton = screen.queryByTestId('close');
    userEvent.click(closeButton);
    const actual = onClose.called;
    expect(actual).toEqual(expected);
  });
});
