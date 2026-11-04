import sinon from 'sinon';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { render, screen } from '@testing-library/react';
import PDFStatusReport from './index';

describe('Unit | Features | Property Update Inspection | PDF Report Status', () => {
  it('should show PDF report status', () => {
    const props = {
      isPdfReportStatusShowing: true
    };

    render(<PDFStatusReport {...props} />);

    const pdfReport = screen.queryByTestId('header-pdf-report');
    expect(pdfReport).toBeTruthy();
  });

  it('should show PDF report view and copy action as available if it has inspection report url', () => {
    const expected = 'View PDF Report|Copy PDF Link';
    const props = {
      inspectionReportURL: 'https://google.com',
      isPdfReportStatusShowing: true,
      isPdfReportOutOfDate: false
    };

    render(<PDFStatusReport {...props} />);

    const pdfReportText = screen.queryByTestId('header-pdf-report-text');
    expect(pdfReportText).toHaveTextContent(expected);
  });

  it('should not show PDF report view and copy action as available if does not have inspection report url', () => {
    const expected = '';
    const props = {
      isPdfReportStatusShowing: true,
      isPdfReportOutOfDate: false
    };

    render(<PDFStatusReport {...props} />);

    const pdfReportText = screen.queryByTestId('header-pdf-report-text');
    expect(pdfReportText).toHaveTextContent(expected);
  });

  it('should show PDF report status as out of date', () => {
    const expected = 'PDF Report is out-of-date';
    const props = {
      isPdfReportStatusShowing: true,
      isPdfReportOutOfDate: true
    };

    render(<PDFStatusReport {...props} />);

    const pdfReportText = screen.queryByTestId('header-pdf-report-text');
    expect(pdfReportText).toHaveTextContent(expected);
  });

  it('should show PDF report status as Generating PDF if inspection report is generating', () => {
    const expected = 'Generating PDF';
    const props = {
      isPdfReportStatusShowing: true,
      isPdfReportGenerating: true
    };

    render(<PDFStatusReport {...props} />);

    const pdfReportGenerating = screen.queryByTestId('header-pdf-report-text');
    expect(pdfReportGenerating).toHaveTextContent(expected);
  });

  it('should show PDF report status as PDF Report failed if inspection report is generation failed', () => {
    const expected = 'PDF Report failed';
    const props = {
      isPdfReportStatusShowing: true,
      hasPdfReportGenerationFailed: true
    };

    render(<PDFStatusReport {...props} />);

    const pdfReportGenerating = screen.queryByTestId('header-pdf-report-text');
    expect(pdfReportGenerating).toHaveTextContent(expected);
  });

  it('should show PDF report status as PDF report in queue if inspection report is in queue', () => {
    const expected = 'PDF report in queue';
    const props = {
      isPdfReportStatusShowing: true,
      isPdfReportQueued: true
    };

    render(<PDFStatusReport {...props} />);

    const pdfReportGenerating = screen.queryByTestId('header-pdf-report-text');
    expect(pdfReportGenerating).toHaveTextContent(expected);
  });

  it('should show restart action and request to regenerate PDF', () => {
    const expected = true;
    const onRegenerateReport = sinon.spy();

    const props = {
      isPdfReportStatusShowing: true,
      isPdfReportGenerating: false,
      showRestartAction: true,
      onRegenerateReport
    };

    render(<PDFStatusReport {...props} />);

    const restartAction = screen.queryByTestId('pdf-report-restart-action');
    expect(restartAction).toBeTruthy();

    act(() => {
      userEvent.click(restartAction);
    });

    const actual = onRegenerateReport.called;
    expect(actual).toEqual(expected);
  });

  it('should request to copy PDF report url', () => {
    const expected = true;
    const onCopyReportURL = sinon.spy();

    const props = {
      inspectionReportURL: 'https://google.com',
      isPdfReportStatusShowing: true,
      onCopyReportURL
    };

    render(<PDFStatusReport {...props} />);

    const copyAction = screen.queryByTestId('pdf-report-copy-url-action');
    expect(copyAction).toBeTruthy();

    act(() => {
      userEvent.click(copyAction);
    });

    const actual = onCopyReportURL.called;
    expect(actual).toEqual(expected);
  });

  it('should show how many photos are still uploading from the inspector device', () => {
    const pendingUploadsCount = 3;
    const expected = `${pendingUploadsCount} photos still uploading from the inspector's device`;
    const props = {
      isPdfReportStatusShowing: true,
      isPdfReportOutOfDate: true,
      pendingUploadsCount
    };

    render(<PDFStatusReport {...props} />);

    const pdfReportText = screen.queryByTestId('header-pdf-report-text');
    expect(pdfReportText).toHaveTextContent(expected);
  });

  it('should use the singular for one photo still uploading', () => {
    const pendingUploadsCount = 1;
    const expected = `${pendingUploadsCount} photo still uploading from the inspector's device`;
    const props = {
      isPdfReportStatusShowing: true,
      pendingUploadsCount
    };

    render(<PDFStatusReport {...props} />);

    const pdfReportText = screen.queryByTestId('header-pdf-report-text');
    expect(pdfReportText).toHaveTextContent(expected);
  });

  it('should hide the restart and report link actions while photos are still uploading', () => {
    const props = {
      inspectionReportURL: 'https://google.com',
      isPdfReportStatusShowing: true,
      hasPdfReportGenerationFailed: true,
      showRestartAction: true,
      pendingUploadsCount: 2
    };

    render(<PDFStatusReport {...props} />);

    expect(screen.queryByTestId('pdf-report-restart-action')).toBeNull();
    expect(screen.queryByTestId('pdf-report-copy-url-action')).toBeNull();
  });

  it('should still show a report that is generating over pending uploads', () => {
    const expected = 'Generating PDF';
    const props = {
      isPdfReportStatusShowing: true,
      isPdfReportGenerating: true,
      pendingUploadsCount: 2
    };

    render(<PDFStatusReport {...props} />);

    const pdfReportText = screen.queryByTestId('header-pdf-report-text');
    expect(pdfReportText).toHaveTextContent(expected);
  });
});
