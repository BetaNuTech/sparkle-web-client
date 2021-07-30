import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import useSearching from './useSearching';
import mockJobs, {
  authorizedImprovementJob,
  completeImprovementJob
} from '../../__mocks__/jobs';

describe('Unit | Common | Hooks | Use Searching', () => {
  afterEach(() => sinon.restore());

  test('should return filtered list from job', () => {
    const expected = [
      authorizedImprovementJob.title,
      completeImprovementJob.title
    ].join(' | ');

    const { result } = renderHook(() =>
      useSearching(mockJobs, ['title', 'type'], ['lat'])
    );

    const actual = result.current.filteredItems.map((j) => j.title).join(' | ');
    expect(actual).toEqual(expected);
  });
});
