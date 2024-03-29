import sinon from 'sinon';

import { renderHook } from '@testing-library/react-hooks';

import { inspectionA } from '../../../__mocks__/inspections';
import usePDFReport from './usePdfReport';

describe('Unit | Features | Inspection Edit | Hooks | Use PDF Report', () => {
  afterEach(() => sinon.restore());

  test('should allow to show PDF report status for completed inspection', async () => {
    const completedInspectionWithReport = {
      ...inspectionA,
      inspectionReportStatus: 'completed_success',
      inspectionReportURL: 'https://dummyimage.com/600x400/000/fff'
    };
    const { result } = renderHook(() =>
      usePDFReport(completedInspectionWithReport, sinon.spy(), true, false)
    );

    expect(result.current.isPdfReportStatusShowing).toBeTruthy();
  });

  test('should show report status out-of-date if its report is older than latest updates', () => {
    const expected = true;
    const completedInspectionWithReport = {
      ...inspectionA,
      inspectionReportStatus: 'completed_success',
      inspectionReportURL: 'https://dummyimage.com/600x400/000/fff',
      updatedAt: 100,
      inspectionReportUpdateLastDate: 99 // older than most recent updates
    };
    const { result } = renderHook(() =>
      usePDFReport(completedInspectionWithReport, sinon.spy(), true, false)
    );
    expect(result.current.isPdfReportStatusShowing).toBeTruthy();
    expect(result.current.isPdfReportOutOfDate).toEqual(expected);
  });

  test('should show report status out-of-date if it has unpublished updates', async () => {
    const completedInspectionWithReport = {
      ...inspectionA,
      inspectionReportStatus: 'completed_success',
      inspectionReportURL: 'https://dummyimage.com/600x400/000/fff',
      updatedAt: 1,
      inspectionReportUpdateLastDate: 1 // same age
    };
    const { result } = renderHook(() =>
      usePDFReport(completedInspectionWithReport, sinon.spy(), true, true)
    );
    expect(result.current.isPdfReportStatusShowing).toBeTruthy();
    expect(result.current.isPdfReportOutOfDate).toBeTruthy();
  });

  test('should show report status generating if report status is generating', async () => {
    const completedInspectionWithReport = {
      ...inspectionA,
      inspectionReportStatus: 'generating',
      inspectionReportURL: 'https://dummyimage.com/600x400/000/fff',
      inspectionReportUpdateLastDate: inspectionA.updatedAt
    };
    const { result } = renderHook(() =>
      usePDFReport(completedInspectionWithReport, sinon.spy(), true, false)
    );
    expect(result.current.isPdfReportStatusShowing).toBeTruthy();
    expect(result.current.isPdfReportGenerating).toBeTruthy();
  });

  test('should show report status queued if report status is queued', async () => {
    const completedInspectionWithReport = {
      ...inspectionA,
      inspectionReportStatus: 'queued'
    };
    const { result } = renderHook(() =>
      usePDFReport(completedInspectionWithReport, sinon.spy(), true, false)
    );
    expect(result.current.isPdfReportStatusShowing).toBeTruthy();
    expect(result.current.isPdfReportQueued).toBeTruthy();
  });

  test('should show the restart action if the report has been queued for over 3 minutes', async () => {
    const fiveMinUnix = 60 * 5;
    const fiveMinutesAgo = Math.round(Date.now() / 1000) - fiveMinUnix;
    const completedInspectionWithReport = {
      ...inspectionA,
      inspectionReportStatusChanged: fiveMinutesAgo,
      inspectionReportStatus: 'queued'
    };
    const { result } = renderHook(() =>
      usePDFReport(completedInspectionWithReport, sinon.spy(), true, false)
    );
    expect(result.current.isPdfReportStatusShowing).toBeTruthy();
    expect(result.current.showRestartAction).toBeTruthy();
  });

  test('should show the restart action if the report has been generating for over 3 minutes', async () => {
    const fiveMinUnix = 60 * 5;
    const fiveMinutesAgo = Math.round(Date.now() / 1000) - fiveMinUnix;
    const completedInspectionWithReport = {
      ...inspectionA,
      inspectionReportStatusChanged: fiveMinutesAgo,
      inspectionReportStatus: 'generating'
    };
    const { result } = renderHook(() =>
      usePDFReport(completedInspectionWithReport, sinon.spy(), true, false)
    );
    expect(result.current.isPdfReportStatusShowing).toBeTruthy();
    expect(result.current.showRestartAction).toBeTruthy();
  });

  test('should show report status as failed', async () => {
    const completedInspectionWithReport = {
      ...inspectionA,
      inspectionReportStatus: 'completed_failure',
      inspectionReportURL: 'https://dummyimage.com/600x400/000/fff',
      inspectionReportUpdateLastDate: inspectionA.updatedAt
    };
    const { result } = renderHook(() =>
      usePDFReport(completedInspectionWithReport, sinon.spy(), true, false)
    );
    expect(result.current.isPdfReportStatusShowing).toBeTruthy();
    expect(result.current.hasPdfReportGenerationFailed).toBeTruthy();
  });
});
