import { FunctionComponent, useMemo } from 'react';
import { useMediaQuery } from 'react-responsive';
import breakpoints from '../../config/breakpoints';
import propertyModel from '../../common/models/property';
import deficientItemModel from '../../common/models/deficientItem';
import userModel from '../../common/models/user';
import utilArray from '../../common/utils/array';
import ItemsStateGroup from './ItemsStateGroup';
import Header from './Header';

interface Props {
  isOnline?: boolean;
  isStaging?: boolean;
  user: userModel;
  property: propertyModel;
  deficientItems: deficientItemModel[];
}

const DeficientItems: FunctionComponent<Props> = ({
  isOnline,
  isStaging,
  deficientItems,
  property
}) => {
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

  return (
    <>
      <Header
        propertyId={property.id}
        isOnline={isOnline}
        isStaging={isStaging}
        isTablet={isTablet}
        isDesktop={isDesktop}
      />
      <ItemsStateGroup deficientItemsByState={deficientItemsByState} />
    </>
  );
};

export default DeficientItems;
