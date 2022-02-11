import { ChangeEvent, FunctionComponent, useMemo, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import breakpoints from '../../config/breakpoints';
import propertyModel from '../../common/models/property';
import deficientItemModel from '../../common/models/deficientItem';
import userModel from '../../common/models/user';
import utilArray from '../../common/utils/array';
import StateGroups from './StateGroups';
import Header from './Header';

interface Props {
  isOnline?: boolean;
  isStaging?: boolean;
  user: userModel;
  property: propertyModel;
  deficientItems: deficientItemModel[];
  forceVisible?: boolean;
}

const DeficientItems: FunctionComponent<Props> = ({
  isOnline,
  isStaging,
  deficientItems,
  property,
  forceVisible
}) => {
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortDir, setSortDir] = useState('asc');

  // Grouping of deficient items by state
  const deficientItemsByState = useMemo(
    () =>
      utilArray.groupBy<string, deficientItemModel>(
        deficientItems,
        (item) => item.state
      ),
    [deficientItems]
  );

  // Responsive queries
  const isTablet = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });

  const isDesktop = useMediaQuery({
    minWidth: breakpoints.desktop.minWidth
  });

  const onSortChange = (key: string, evt?: ChangeEvent<HTMLSelectElement>) => {
    if (key === 'sortBy') {
      setSortBy(evt.target.value);
    }
    if (key === 'sortDir') {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    }
  };

  return (
    <>
      <Header
        property={property}
        isOnline={isOnline}
        isStaging={isStaging}
        isTablet={isTablet}
        isDesktop={isDesktop}
        sortBy={sortBy}
        sortDir={sortDir}
        onSortChange={onSortChange}
      />
      <StateGroups
        deficientItemsByState={deficientItemsByState}
        forceVisible={forceVisible}
      />
    </>
  );
};

export default DeficientItems;
