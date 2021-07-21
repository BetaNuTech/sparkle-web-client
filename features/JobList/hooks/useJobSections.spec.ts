import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import {
  openImprovementJob,
  openMaintenanceJob,
  approvedMaintenanceJob,
  authorizedImprovementJob,
  completeImprovementJob
} from '../../../__mocks__/jobs';
import useJobSections from './useJobSections';

describe('Unit | Features | Job Section | Hooks | Sections', () => {
  afterEach(() => sinon.restore());

  test('should return all section', () => {
    const expected = 4;

    const { result } = renderHook(() => useJobSections([openImprovementJob]));

    const actual = result.current.sections.length;

    expect(actual).toEqual(expected);
  });

  test('should show jobs in respective sections', () => {
    const expected =
      'open:job-1,job-2 | approved:job-4 | authorized:job-5 | complete:job-7';

    const { result } = renderHook(() =>
      useJobSections([
        approvedMaintenanceJob,
        openImprovementJob,
        completeImprovementJob,
        authorizedImprovementJob,
        openMaintenanceJob
      ])
    );

    const sections = result.current.sections.map((s) =>
      [s.state, s.jobs.map((j) => j.id).join(',')].join(':')
    );
    const actual = sections.join(' | ');

    expect(actual).toEqual(expected);
  });

  test('should return no jobs for state having no jobs', () => {
    const expected =
      'open:job-1,job-2 | approved: | authorized:job-5 | complete:job-7';

    const { result } = renderHook(() =>
      useJobSections([
        openImprovementJob,
        completeImprovementJob,
        authorizedImprovementJob,
        openMaintenanceJob
      ])
    );

    const sections = result.current.sections.map((s) =>
      [s.state, s.jobs.map((j) => j.id).join(',')].join(':')
    );
    const actual = sections.join(' | ');

    expect(actual).toEqual(expected);
  });
});
