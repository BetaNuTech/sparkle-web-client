import yardiResident from '../../../common/models/yardi/resident';
import { toUnitOptions, toOptionValue, findOption } from './unitOptions';

const resident = (attrs: Partial<yardiResident>): yardiResident =>
  ({ email: '', ...attrs } as yardiResident);

describe('Unit | Features | Property Work Orders | Utils | Unit Options', () => {
  it('should only offer units held by current residents', () => {
    const options = toUnitOptions([
      resident({ id: 't1', leaseUnit: '1-103', status: 'current resident' }),
      resident({ id: 't2', leaseUnit: '1-104', status: 'former resident' }),
      resident({ id: 't3', leaseUnit: '1-105', status: 'applicant' }),
      resident({ id: 't4', leaseUnit: '1-106', status: 'future resident' }),
      resident({ id: 't5', leaseUnit: '', status: 'current resident' }),
      resident({ id: 't6', leaseUnit: '2-201', yardiStatus: 'current' })
    ]);
    expect(options.map((o) => o.unit)).toEqual(['1-103', '2-201']);
  });

  it('should pair each unit with its resident tenant code and name', () => {
    const [option] = toUnitOptions([
      resident({
        id: 't0225029',
        leaseUnit: ' 1-103 ',
        firstName: 'Jane',
        lastName: 'Doe',
        status: 'Current Resident'
      })
    ]);
    expect(option).toEqual({
      unit: '1-103',
      resident: 't0225029',
      label: '1-103 · Jane Doe'
    });
  });

  it('should fall back to the unit alone when the resident has no name', () => {
    const [option] = toUnitOptions([
      resident({ id: 't1', leaseUnit: '1-103', status: 'current resident' })
    ]);
    expect(option.label).toEqual('1-103');
  });

  it('should sort units naturally so 1-2 precedes 1-10', () => {
    const options = toUnitOptions(
      ['1-10', '1-2', '10-1', '1-1'].map((leaseUnit, i) =>
        resident({ id: `t${i}`, leaseUnit, status: 'current resident' })
      )
    );
    expect(options.map((o) => o.unit)).toEqual(['1-1', '1-2', '1-10', '10-1']);
  });

  it('should list every current resident sharing a unit', () => {
    const options = toUnitOptions([
      resident({ id: 't2', leaseUnit: '1-103', status: 'current resident' }),
      resident({ id: 't1', leaseUnit: '1-103', status: 'current resident' })
    ]);
    expect(options.map((o) => o.resident)).toEqual(['t1', 't2']);
  });

  it('should round trip an option through its select value', () => {
    const options = toUnitOptions([
      resident({ id: 't1', leaseUnit: '1-103', status: 'current resident' })
    ]);
    const value = toOptionValue(options[0]);
    expect(value).toContain('1-103');
    expect(findOption(options, '1-103', 't1')).toEqual(options[0]);
    expect(findOption(options, '1-103', 'other')).toBeUndefined();
  });
});
