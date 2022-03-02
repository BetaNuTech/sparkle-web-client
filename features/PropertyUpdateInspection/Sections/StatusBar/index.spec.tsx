import sinon from 'sinon';
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';

import StatusBar from './index';

describe('Unit | Features | Property Update Inspection | Status Bar', () => {
  it('should show completed percentage', () => {
    const expected = 50;
    const props = {
      showAction: false,
      inspCompletionPercentage: expected,
      showStatusBar: true,
      onSaveInspection: sinon.spy(),
      canEnableEditMode: false,
      onEnableAdminEditMode: sinon.spy(),
      canUpdateCompleteInspection: false,
      hasUpdates: false,
      isOnline: true,
      onCopyReportURL: sinon.spy(),
      isPdfReportStatusShowing: false,
      isPdfReportOutOfDate: false,
      isPdfReportGenerating: false,
      isPdfReportQueued: false,
      showRestartAction: false,
      hasPdfReportGenerationFailed: false,
      onRegenerateReport: sinon.spy(),
      inspectionReportURL: '',
      isRequestingReport: false
    };

    render(<StatusBar {...props} />);

    const percentageStatusEl = screen.queryByTestId(
      'status-bar-percentage-status'
    );
    expect(percentageStatusEl).toHaveTextContent(`${expected}%`);
  });

  it('should not show completed percentage when inspection is completed and PDF report status is displaying', () => {
    const props = {
      showAction: false,
      inspCompletionPercentage: 100,
      showStatusBar: true,
      onSaveInspection: sinon.spy(),
      canEnableEditMode: false,
      onEnableAdminEditMode: sinon.spy(),
      canUpdateCompleteInspection: false,
      hasUpdates: false,
      isOnline: true,
      onCopyReportURL: sinon.spy(),
      isPdfReportStatusShowing: true,
      isPdfReportOutOfDate: false,
      isPdfReportGenerating: false,
      isPdfReportQueued: false,
      showRestartAction: false,
      hasPdfReportGenerationFailed: false,
      onRegenerateReport: sinon.spy(),
      inspectionReportURL: '',
      isRequestingReport: false
    };

    render(<StatusBar {...props} />);

    const percentageStatusEl = screen.queryByTestId(
      'status-bar-percentage-status'
    );
    expect(percentageStatusEl).toBeNull();
  });

  it('should hide edit button and complete button if inspection not completed', () => {
    const props = {
      showAction: true,
      inspCompletionPercentage: 100,
      showStatusBar: true,
      onSaveInspection: sinon.spy(),
      canEnableEditMode: false,
      onEnableAdminEditMode: sinon.spy(),
      canUpdateCompleteInspection: false,
      hasUpdates: false,
      isOnline: true,
      onCopyReportURL: sinon.spy(),
      isPdfReportStatusShowing: true,
      isPdfReportOutOfDate: false,
      isPdfReportGenerating: false,
      isPdfReportQueued: false,
      showRestartAction: false,
      hasPdfReportGenerationFailed: false,
      onRegenerateReport: sinon.spy(),
      inspectionReportURL: '',
      isRequestingReport: false
    };

    render(<StatusBar {...props} />);

    const editButton = screen.queryByTestId('status-bar-edit-button');
    const completeButton = screen.queryByTestId('status-bar-complete-button');

    expect(editButton).toBeNull();
    expect(completeButton).toBeNull();
  });

  it('should show edit button and complete button if inspection completed and user is admin', () => {
    const props = {
      showAction: true,
      inspCompletionPercentage: 100,
      showStatusBar: true,
      onSaveInspection: sinon.spy(),
      canEnableEditMode: true,
      onEnableAdminEditMode: sinon.spy(),
      canUpdateCompleteInspection: false,
      hasUpdates: false,
      isOnline: true,
      onCopyReportURL: sinon.spy(),
      isPdfReportStatusShowing: true,
      isPdfReportOutOfDate: false,
      isPdfReportGenerating: false,
      isPdfReportQueued: false,
      showRestartAction: false,
      hasPdfReportGenerationFailed: false,
      onRegenerateReport: sinon.spy(),
      inspectionReportURL: '',
      isRequestingReport: false
    };

    render(<StatusBar {...props} />);

    const editButton = screen.queryByTestId('status-bar-edit-button');

    expect(editButton).toBeTruthy();
  });

  it('should show complete button if inspection can be completed by updates', () => {
    const props = {
      showAction: true,
      inspCompletionPercentage: 100,
      showStatusBar: true,
      onSaveInspection: sinon.spy(),
      canEnableEditMode: false,
      onEnableAdminEditMode: sinon.spy(),
      canUpdateCompleteInspection: true,
      hasUpdates: false,
      isOnline: true,
      onCopyReportURL: sinon.spy(),
      isPdfReportStatusShowing: true,
      isPdfReportOutOfDate: false,
      isPdfReportGenerating: false,
      isPdfReportQueued: false,
      showRestartAction: false,
      hasPdfReportGenerationFailed: false,
      onRegenerateReport: sinon.spy(),
      inspectionReportURL: '',
      isRequestingReport: false
    };

    render(<StatusBar {...props} />);

    const completeButton = screen.queryByTestId('status-bar-complete-button');

    expect(completeButton).toBeTruthy();
  });

  it('should disable save button if no updates to the inspection are publishable', () => {
    const props = {
      showAction: true,
      inspCompletionPercentage: 100,
      showStatusBar: true,
      onSaveInspection: sinon.spy(),
      canEnableEditMode: false,
      onEnableAdminEditMode: sinon.spy(),
      canUpdateCompleteInspection: false,
      hasUpdates: false,
      isOnline: true,
      onCopyReportURL: sinon.spy(),
      isPdfReportStatusShowing: true,
      isPdfReportOutOfDate: false,
      isPdfReportGenerating: false,
      isPdfReportQueued: false,
      showRestartAction: false,
      hasPdfReportGenerationFailed: false,
      onRegenerateReport: sinon.spy(),
      inspectionReportURL: '',
      isRequestingReport: false
    };

    render(<StatusBar {...props} />);

    const completeButton = screen.queryByTestId('status-bar-save-button');

    expect(completeButton).toBeDisabled();
  });

  it('should request to update search query on search input change', () => {
    const onSearchKeyDown = sinon.spy();
    const props = {
      showAction: true,
      inspCompletionPercentage: 100,
      showStatusBar: true,
      onSaveInspection: sinon.spy(),
      canEnableEditMode: false,
      onEnableAdminEditMode: sinon.spy(),
      canUpdateCompleteInspection: false,
      hasUpdates: false,
      isOnline: true,
      onCopyReportURL: sinon.spy(),
      isPdfReportStatusShowing: true,
      isPdfReportOutOfDate: false,
      isPdfReportGenerating: false,
      isPdfReportQueued: false,
      showRestartAction: false,
      hasPdfReportGenerationFailed: false,
      onRegenerateReport: sinon.spy(),
      inspectionReportURL: '',
      isRequestingReport: false,
      searchQuery: '',
      setSearchQuery: sinon.spy(),
      onSearchKeyDown
    };

    render(<StatusBar {...props} />);

    const searchInput = screen.queryByTestId('status-bar-search-input');
    act(() => {
      fireEvent.change(searchInput, { target: { value: 'search' } });
    });
    expect(onSearchKeyDown.called).toBeTruthy();
  });

  it('should render clear search button if there is search query ', () => {
    const onClearSearch = sinon.spy();
    const props = {
      showAction: true,
      inspCompletionPercentage: 100,
      showStatusBar: true,
      onSaveInspection: sinon.spy(),
      canEnableEditMode: false,
      onEnableAdminEditMode: sinon.spy(),
      canUpdateCompleteInspection: false,
      hasUpdates: false,
      isOnline: true,
      onCopyReportURL: sinon.spy(),
      isPdfReportStatusShowing: true,
      isPdfReportOutOfDate: false,
      isPdfReportGenerating: false,
      isPdfReportQueued: false,
      showRestartAction: false,
      hasPdfReportGenerationFailed: false,
      onRegenerateReport: sinon.spy(),
      inspectionReportURL: '',
      isRequestingReport: false,
      searchQuery: 'one',
      setSearchQuery: sinon.spy(),
      onSearchKeyDown: sinon.spy(),
      onClearSearch
    };

    render(<StatusBar {...props} />);
    const clearBtn = screen.queryByTestId('status-bar-search-clear');
    expect(clearBtn).toBeTruthy();
  });

  it('should request to clear search query', () => {
    const onClearSearch = sinon.spy();
    const props = {
      showAction: true,
      inspCompletionPercentage: 100,
      showStatusBar: true,
      onSaveInspection: sinon.spy(),
      canEnableEditMode: false,
      onEnableAdminEditMode: sinon.spy(),
      canUpdateCompleteInspection: false,
      hasUpdates: false,
      isOnline: true,
      onCopyReportURL: sinon.spy(),
      isPdfReportStatusShowing: true,
      isPdfReportOutOfDate: false,
      isPdfReportGenerating: false,
      isPdfReportQueued: false,
      showRestartAction: false,
      hasPdfReportGenerationFailed: false,
      onRegenerateReport: sinon.spy(),
      inspectionReportURL: '',
      isRequestingReport: false,
      searchQuery: 'one',
      setSearchQuery: sinon.spy(),
      onSearchKeyDown: sinon.spy(),
      onClearSearch
    };

    render(<StatusBar {...props} />);
    const clearBtn = screen.queryByTestId('status-bar-search-clear');
    act(() => {
      userEvent.click(clearBtn);
    });
    expect(onClearSearch.called).toBeTruthy();
  });

  it('should not render PDF report status and inspection status if there is a search query ', () => {
    const onClearSearch = sinon.spy();
    const props = {
      showAction: true,
      inspCompletionPercentage: 100,
      showStatusBar: true,
      onSaveInspection: sinon.spy(),
      canEnableEditMode: false,
      onEnableAdminEditMode: sinon.spy(),
      canUpdateCompleteInspection: false,
      hasUpdates: false,
      isOnline: true,
      onCopyReportURL: sinon.spy(),
      isPdfReportStatusShowing: true,
      isPdfReportOutOfDate: false,
      isPdfReportGenerating: false,
      isPdfReportQueued: false,
      showRestartAction: false,
      hasPdfReportGenerationFailed: false,
      onRegenerateReport: sinon.spy(),
      inspectionReportURL: '',
      isRequestingReport: false,
      searchQuery: 'one',
      setSearchQuery: sinon.spy(),
      onSearchKeyDown: sinon.spy(),
      onClearSearch
    };

    render(<StatusBar {...props} />);
    const statusContent = screen.queryByTestId('status-bar-content');

    expect(statusContent).toBeNull();
  });

  it('should not render inspection actions if there is a search query ', () => {
    const onClearSearch = sinon.spy();
    const props = {
      showAction: true,
      inspCompletionPercentage: 100,
      showStatusBar: true,
      onSaveInspection: sinon.spy(),
      canEnableEditMode: false,
      onEnableAdminEditMode: sinon.spy(),
      canUpdateCompleteInspection: false,
      hasUpdates: false,
      isOnline: true,
      onCopyReportURL: sinon.spy(),
      isPdfReportStatusShowing: true,
      isPdfReportOutOfDate: false,
      isPdfReportGenerating: false,
      isPdfReportQueued: false,
      showRestartAction: false,
      hasPdfReportGenerationFailed: false,
      onRegenerateReport: sinon.spy(),
      inspectionReportURL: '',
      isRequestingReport: false,
      searchQuery: 'one',
      setSearchQuery: sinon.spy(),
      onSearchKeyDown: sinon.spy(),
      onClearSearch
    };

    render(<StatusBar {...props} />);
    const statusActions = screen.queryByTestId('status-bar-actions');

    expect(statusActions).toBeNull();
  });
});
