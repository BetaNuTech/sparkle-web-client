import sinon from 'sinon';
import { render as rtlRender, screen } from '@testing-library/react';
import { Context as ResponsiveContext } from 'react-responsive';
import { fullInspection, inspectionB } from '../../../__mocks__/inspections';
import { fullProperty } from '../../../__mocks__/properties';
import breakpoints from '../../../config/breakpoints';
import MobileHeader from './index';

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

describe('Unit | Features | Property Update Inspection | Mobile Header', () => {
  it('should hide edit button and complete button if inspection not completed', () => {
    const props = {
      property: fullProperty,
      inspection: inspectionB,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onShareAction: () => {},
      isOnline: true
    };

    render(<MobileHeader {...props} />);

    const editButton = screen.queryByTestId('header-edit-button');
    const completeButton = screen.queryByTestId('header-complete-button');

    expect(editButton).toBeNull();
    expect(completeButton).toBeNull();
  });

  it('should hide edit button if inspection is completed but user is not admin', () => {
    const props = {
      property: fullProperty,
      inspection: fullInspection,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onShareAction: () => {},
      isOnline: true,
      canEnableEditMode: false
    };

    render(<MobileHeader {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const editButton = screen.queryByTestId('header-edit-button');

    expect(editButton).toBeNull();
  });

  it('should show edit button if inspection completed and current user is admin', () => {
    const props = {
      property: fullProperty,
      inspection: fullInspection,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onShareAction: () => {},
      canEnableEditMode: true
    };

    render(<MobileHeader {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const editButton = screen.queryByTestId('header-edit-button');

    expect(editButton).toBeTruthy();
  });

  it('should reveal complete button if inspection could be completed by updates', () => {
    const props = {
      property: fullProperty,
      inspection: fullInspection,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onShareAction: () => {},
      isOnline: true,
      canUpdateCompleteInspection: true
    };

    render(<MobileHeader {...props} />);

    const completeButton = screen.queryByTestId('header-complete-button');

    expect(completeButton).toBeTruthy();
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

    render(<MobileHeader {...props} />, {
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

    render(<MobileHeader {...props} />, {
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

    render(<MobileHeader {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const saveButton = screen.queryByTestId('header-save-button');
    expect(saveButton).not.toBeDisabled();
  });

  it('should show PDF report status', () => {
    const props = {
      property: fullProperty,
      inspection: fullInspection,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onShareAction: () => {},
      isOnline: true,
      hasUpdates: true,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onSaveInspection: () => {},
      isPdfReportStatusShowing: true
    };

    render(<MobileHeader {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const pdfReport = screen.queryByTestId('header-pdf-report');
    expect(pdfReport).toBeTruthy();
  });

  it('should show PDF report status as available', () => {
    const expected = 'PDF Report is available';
    const props = {
      property: fullProperty,
      inspection: fullInspection,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onShareAction: () => {},
      isOnline: true,
      hasUpdates: true,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onSaveInspection: () => {},
      isPdfReportStatusShowing: true,
      isPdfReportOutOfDate: false
    };

    render(<MobileHeader {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const pdfReportText = screen.queryByTestId('header-pdf-report-text');
    expect(pdfReportText).toHaveTextContent(expected);
  });

  it('should show PDF report status as out of date', () => {
    const expected = 'PDF Report is out-of-date';
    const props = {
      property: fullProperty,
      inspection: fullInspection,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onShareAction: () => {},
      isOnline: true,
      hasUpdates: true,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onSaveInspection: () => {},
      isPdfReportStatusShowing: true,
      isPdfReportOutOfDate: true
    };

    render(<MobileHeader {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const pdfReportText = screen.queryByTestId('header-pdf-report-text');
    expect(pdfReportText).toHaveTextContent(expected);
  });

  it('should show PDF report status as Generating PDF if inspection report is generating', () => {
    const expected = 'Generating PDF';
    const props = {
      property: fullProperty,
      inspection: fullInspection,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onShareAction: () => {},
      isOnline: true,
      hasUpdates: true,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onSaveInspection: () => {},
      isPdfReportStatusShowing: true,
      isPdfReportGenerating: true
    };

    render(<MobileHeader {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const pdfReportGenerating = screen.queryByTestId(
      'header-pdf-report-generating'
    );
    expect(pdfReportGenerating).toHaveTextContent(expected);
  });
});
