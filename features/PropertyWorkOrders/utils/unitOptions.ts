import yardiResidentModel from '../../../common/models/yardi/resident';

// A unit a work order can be created
// for, paired with the resident whose
// tenant code it fills in
export interface UnitOption {
  unit: string;
  resident: string;
  label: string;
}

// Yardi statuses of residents who hold
// a unit right now
const CURRENT_STATUSES = ['current resident', 'current'];

const isCurrent = (resident: yardiResidentModel): boolean =>
  CURRENT_STATUSES.includes(`${resident.status || ''}`.toLowerCase()) ||
  CURRENT_STATUSES.includes(`${resident.yardiStatus || ''}`.toLowerCase());

const residentName = (resident: yardiResidentModel): string =>
  [resident.firstName, resident.lastName]
    .map((part) => `${part || ''}`.trim())
    .filter(Boolean)
    .join(' ');

// Compare unit codes so "1-2" sorts
// before "1-10" rather than after it
const compareUnits = (a: string, b: string): number =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });

// Build the pickable units from a
// property's residents: one option per
// current resident with a lease unit,
// ordered by unit then tenant code
export const toUnitOptions = (
  residents: yardiResidentModel[] = []
): UnitOption[] =>
  residents
    .filter((resident) => isCurrent(resident) && resident.leaseUnit)
    .map((resident) => {
      const unit = `${resident.leaseUnit}`.trim();
      const tenantCode = `${resident.id || ''}`.trim();
      const name = residentName(resident);
      return {
        unit,
        resident: tenantCode,
        label: name ? `${unit} · ${name}` : unit
      };
    })
    .filter((option) => option.unit)
    .sort(
      (a, b) =>
        compareUnits(a.unit, b.unit) || compareUnits(a.resident, b.resident)
    );

// Stable value a select can hold for
// an option, and its reverse
export const toOptionValue = (option: UnitOption): string =>
  `${option.unit}\u0000${option.resident}`;

export const findOption = (
  options: UnitOption[],
  unit: string,
  resident: string
): UnitOption | undefined =>
  options.find(
    (option) => option.unit === unit && option.resident === resident
  );

export default toUnitOptions;
