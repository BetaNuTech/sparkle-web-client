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

  it('should disable save button if no updates to the inspection are publishable', () => {
    const props = {
      property: fullProperty,
      inspection: fullInspection,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onShareAction: () => {},
      isOnline: true,
      hasUpdates: false,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onSaveInspection: () => {}
    };

    render(<MobileLayout {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const saveButton = screen.queryByTestId('header-save-button');
    expect(saveButton).toBeDisabled();
  });

  it('should disable save button if user is offline', () => {
    const props = {
      property: fullProperty,
      inspection: fullInspection,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onShareAction: () => {},
      isOnline: false,
      hasUpdates: true,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onSaveInspection: () => {}
    };

    render(<MobileLayout {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const saveButton = screen.queryByTestId('header-save-button');
    expect(saveButton).toBeDisabled();
  });

  it('should enable save button if user is online and we have publishable updates', () => {
    const props = {
      property: fullProperty,
      inspection: fullInspection,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onShareAction: () => {},
      isOnline: true,
      hasUpdates: true,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onSaveInspection: () => {}
    };

    render(<MobileLayout {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const saveButton = screen.queryByTestId('header-save-button');
    expect(saveButton).not.toBeDisabled();
  });
});
