import { FunctionComponent } from 'react';
import { useMediaQuery } from 'react-responsive';
import breakpoints from '../../config/breakpoints';
import propertyModel from '../../common/models/property';
import DeficientItemModel from '../../common/models/deficientItem';
import userModel from '../../common/models/user';
import Header from './Header';

interface Props {
  user: userModel;
  property: propertyModel;
  deficientItem: DeficientItemModel;
  isOnline?: boolean;
  isStaging?: boolean;
}

const DeficientItemEdit: FunctionComponent<Props> = ({
  property,
  deficientItem,
  isOnline,
  isStaging
}) => {
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
        property={property}
        isOnline={isOnline}
        isStaging={isStaging}
        isTablet={isTablet}
        isDesktop={isDesktop}
        itemTitle={deficientItem.itemTitle}
      />
    </>
  );
};

export default DeficientItemEdit;
