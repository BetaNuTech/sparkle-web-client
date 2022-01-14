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

  test('should show report status out-of-date if it has unpublished updates', async () => {
    const completedInspectionWithReport = {
      ...inspectionA,
      inspectionReportStatus: 'completed_success',
      inspectionReportURL: 'https://dummyimage.com/600x400/000/fff',
      inspectionReportUpdateLastDate: inspectionA.updatedAt
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

  test('should show the request again action if the report has been queued for over 3 minutes', async () => {
    const fourMinUnix = 60 * 4;
    const fourMinutesAgo = Math.round(Date.now() / 1000) - fourMinUnix;
    const completedInspectionWithReport = {
      ...inspectionA,
      inspectionReportLastQueued: fourMinutesAgo,
      inspectionReportStatus: 'queued'
    };
    const { result } = renderHook(() =>
      usePDFReport(completedInspectionWithReport, sinon.spy(), true, false)
    );
    expect(result.current.isPdfReportStatusShowing).toBeTruthy();
    expect(result.current.showRequestAgainAction).toBeTruthy();
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
