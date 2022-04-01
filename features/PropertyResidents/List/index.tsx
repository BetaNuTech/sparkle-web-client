import { FunctionComponent } from 'react';
import residentModel from '../../../common/models/yardi/resident';
import Item from './Item';

interface Props {
  residents: residentModel[];
  isMobile: boolean;
  forceVisible?: boolean;
  onClickResident(resident: residentModel): void;
  activeFilter: string;
  searchValue: string;
}

const ResidentList: FunctionComponent<Props> = ({
  residents,
  isMobile,
  forceVisible,
  onClickResident,
  activeFilter,
  searchValue
}) => {
  const hasLength = Boolean(residents.length);
  let emptyStateMessage = '';

  if (!hasLength && searchValue) {
    emptyStateMessage = 'No residents or occupants match your search';
  } else if (!hasLength) {
    emptyStateMessage =
      activeFilter === 'notice'
        ? 'No residents on notice for this property'
        : `No ${activeFilter} residents for this property`;
  }

  return (
    <div>
      {hasLength ? (
        <ul>
          {residents.map((resident) => (
            <Item
              key={resident.id}
              resident={resident}
              isMobile={isMobile}
              forceVisible={forceVisible}
              onClick={() => onClickResident(resident)}
            />
          ))}
        </ul>
      ) : (
        <h3 className="-c-gray-light -pt-sm -pl-sm -pb-sm -ta-center">
          {emptyStateMessage}
        </h3>
      )}
    </div>
  );
};

export default ResidentList;
