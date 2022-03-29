import { ChangeEvent } from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { act } from 'react-dom/test-utils';
import ResidentModel from '../../../common/models/yardi/resident';
import { shuffle } from '../../../__tests__/helpers/array';
import useSearchingAndSorting from './useSearchingAndSorting';

describe('Unit | features | Property Residents | Hooks | use searching and sorting', () => {
  test('should sort residents by unit in ascending order', () => {
    const expected = '1, 2, 3, 4, 5, 6';

    const residents = shuffle([
      createResident('1', { leaseUnit: 1 }),
      createResident('2', { leaseUnit: 2 }),
      createResident('3', { leaseUnit: 3 }),
      createResident('4', { leaseUnit: 4 }),
      createResident('5', { leaseUnit: 5 }),
      createResident('6', { leaseUnit: 6 })
    ]);

    const { result } = renderHook(() =>
      useSearchingAndSorting(residents, 'asc')
    );

    const { sortedResidents } = result.current;

    const actual = sortedResidents.map((item) => item.id).join(', ');
    expect(actual).toEqual(expected);
  });

  test('should sort residents by unit in descending order', () => {
    const expected = '6, 5, 4, 3, 2, 1';
    const residents = shuffle([
      createResident('1', { leaseUnit: 1 }),
      createResident('2', { leaseUnit: 2 }),
      createResident('3', { leaseUnit: 3 }),
      createResident('4', { leaseUnit: 4 }),
      createResident('5', { leaseUnit: 5 }),
      createResident('6', { leaseUnit: 6 })
    ]);

    const { result } = renderHook(() =>
      useSearchingAndSorting(residents, 'asc')
    );
    act(() => {
      result.current.onSortDirChange();
    });

    const { sortedResidents } = result.current;

    const actual = sortedResidents.map((item) => item.id).join(', ');
    expect(actual).toEqual(expected);
  });

  test('should sort residents by id in ascending order', () => {
    const expected = ['1', '2', '3', '4', '5', '6'];

    const residents = shuffle([
      createResident('1', { leaseUnit: 1 }),
      createResident('2', { leaseUnit: 2 }),
      createResident('3', { leaseUnit: 3 }),
      createResident('4', { leaseUnit: 4 }),
      createResident('5', { leaseUnit: 5 }),
      createResident('6', { leaseUnit: 6 })
    ]);

    const { result } = renderHook(() =>
      useSearchingAndSorting(residents, 'asc')
    );
    act(() => {
      result.current.onSortChange({
        target: { value: 'id' }
      } as ChangeEvent<HTMLSelectElement>);
    });

    const { sortedResidents } = result.current;

    sortedResidents.forEach((item: ResidentModel, i: number) => {
      expect(item.id).toEqual(expected[i]);
    });
  });

  test('should sort residents by first name in ascending order', () => {
    const expected = '1, 2, 3, 4, 5, 6';

    const residents = shuffle([
      createResident('1', { firstName: 'Ajay' }),
      createResident('2', { firstName: 'Elen' }),
      createResident('3', { firstName: 'Garry' }),
      createResident('4', { firstName: 'Harry' }),
      createResident('5', { firstName: 'Kate' }),
      createResident('6', { firstName: 'Rose' })
    ]);

    const { result } = renderHook(() =>
      useSearchingAndSorting(residents, 'asc')
    );
    act(() => {
      result.current.onSortChange({
        target: { value: 'firstName' }
      } as ChangeEvent<HTMLSelectElement>);
    });

    const { sortedResidents } = result.current;

    const actual = sortedResidents.map((item) => item.id).join(', ');
    expect(actual).toEqual(expected);
  });

  test('should sort residents by last name in ascending order', () => {
    const expected = '1, 2, 3, 4, 5, 6';

    const residents = shuffle([
      createResident('1', { lastName: 'Ajay' }),
      createResident('2', { lastName: 'Elen' }),
      createResident('3', { lastName: 'Garry' }),
      createResident('4', { lastName: 'Harry' }),
      createResident('5', { lastName: 'Kate' }),
      createResident('6', { lastName: 'Rose' })
    ]);

    const { result } = renderHook(() =>
      useSearchingAndSorting(residents, 'asc')
    );
    act(() => {
      result.current.onSortChange({
        target: { value: 'lastName' }
      } as ChangeEvent<HTMLSelectElement>);
    });

    const { sortedResidents } = result.current;

    const actual = sortedResidents.map((item) => item.id).join(', ');
    expect(actual).toEqual(expected);
  });

  test('should sort residents by current status in ascending order', () => {
    const expected = '1, 2, 3';

    const residents = shuffle([
      createResident('1', { yardiStatus: 'applicant' }),
      createResident('2', { yardiStatus: 'current' }),
      createResident('3', { yardiStatus: 'past' })
    ]);

    const { result } = renderHook(() =>
      useSearchingAndSorting(residents, 'asc')
    );
    act(() => {
      result.current.onSortChange({
        target: { value: 'yardiStatus' }
      } as ChangeEvent<HTMLSelectElement>);
    });

    const { sortedResidents } = result.current;

    const actual = sortedResidents.map((item) => item.id).join(', ');
    expect(actual).toEqual(expected);
  });
});

const createResident = (id: string, config: any): ResidentModel => {
  const now = new Date().toISOString();

  return {
    id,
    firstName: 'first',
    middleName: 'middle',
    lastName: 'last',
    email: 'test@email.com',
    mobileNumber: '12345678910',
    homeNumber: '12345678911',
    officeNumber: '12345678912',
    status: 'current resident',
    yardiStatus: 'current',
    leaseUnit: '1235',
    leaseSqFt: '123',
    leaseFrom: now,
    leaseTo: now,
    moveIn: now,
    occupants: [],
    ...config
  };
};
