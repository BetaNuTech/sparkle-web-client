import sinon from 'sinon';
import { render as rtlRender, screen } from '@testing-library/react';
import { Context as ResponsiveContext } from 'react-responsive';
import { fullInspection, inspectionB } from '../../../__mocks__/inspections';
import { fullProperty } from '../../../__mocks__/properties';
import breakpoints from '../../../config/breakpoints';
import MobileLayout from './index';

function render(ui: any, options: any = {}) {
  sinon.restore();

  const contextWidth = options.contextWidth || breakpoints.tablet.maxWidth;
  return rtlRender(
    <ResponsiveContext.Provider value={{ width: contextWidth }}>
      {ui}
    </ResponsiveContext.Provider>,
    options
  );
}

describe('Unit | Features | Property Update Inspection | Mobile Layout', () => {
  it('should hide edit button and disable complete button if inspection not completed', () => {
    const props = {
      property: fullProperty,
      inspection: inspectionB,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onShareAction: () => {},
      isOnline: true
    };

    render(<MobileLayout {...props} />);

    const editButton = screen.queryByTestId('header-edit-button');
    const completeButton = screen.queryByTestId('header-complete-button');

    expect(editButton).toBeNull();
    expect(completeButton).toBeDisabled();
  });

  it('should show edit button and enable complete button if inspection not completed', () => {
    const props = {
      property: fullProperty,
      inspection: fullInspection,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onShareAction: () => {},
      isOnline: true
    };

    render(<MobileLayout {...props} />);

    const editButton = screen.queryByTestId('header-edit-button');
    const completeButton = screen.queryByTestId('header-complete-button');

    expect(editButton).toBeTruthy();
    expect(completeButton).not.toBeDisabled();
  });
});
