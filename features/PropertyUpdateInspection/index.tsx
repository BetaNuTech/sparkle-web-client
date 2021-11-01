import { FunctionComponent } from 'react';
import { useMediaQuery } from 'react-responsive';
import deepmerge from '../../common/utils/deepmerge';
import breakpoints from '../../config/breakpoints';
import propertyModel from '../../common/models/property';
import inspectionModel from '../../common/models/inspection';
import userModel from '../../common/models/user';
import copyTextToClipboard from '../../common/utils/copyTextToClipboard';
import useNotifications from '../../common/hooks/useNotifications'; // eslint-disable-line
import notifications from '../../common/services/notifications'; // eslint-disable-line
import MobileLayout from './MobileLayout';
import useInspectionSectionSort from './hooks/useInspectionSections';
import DesktopLayout from './DesktopLayout';
import useInspectionItems from './hooks/useInspectionItems';
import inspectionTemplateItemModel from '../../common/models/inspectionTemplateItem';
import useItemUpdate from './hooks/useItemUpdate';

interface Props {
  user: userModel;
  inspection: inspectionModel;
  property: propertyModel;
  isOnline?: boolean;
  isStaging?: boolean;
  isNavOpen?: boolean;
  toggleNavOpen?(): void;
  forceVisible?: boolean;
}

const PropertyUpdateInspection: FunctionComponent<Props> = ({
  isOnline,
  isStaging,
  property,
  inspection
}) => {
  const { inspectionUpdates, updateMainInputSelection } = useItemUpdate();
  // User notifications setup
  /* eslint-disable */
  const sendNotification = notifications.createPublisher(useNotifications());
  // Responsive queries
  const isMobileorTablet = useMediaQuery({
    maxWidth: breakpoints.mobile.maxWidth
  });
  const isDesktop = useMediaQuery({
    minWidth: breakpoints.tablet.minWidth
  });

  const onMainInputChange = (
    event: React.MouseEvent<HTMLLIElement>,
    item: inspectionTemplateItemModel,
    selectionIndex: number
  ) => {
    updateMainInputSelection(
      item,
      inspection.template.items[item.id],
      selectionIndex
    );
  };

  const { sortedTemplateSections, collapsedSections, onSectionCollapseToggle } =
    useInspectionSectionSort(inspection.template.sections);

  const { sectionItems } = useInspectionItems(
    deepmerge(inspection.template.items, inspectionUpdates)
  );

  const onShareAction = () => {
    copyTextToClipboard(window.location.href);
    sendNotification('Copied to clipboard.', { type: 'success' });
  };

  return (
    <>
      {isMobileorTablet && (
        <>
          <MobileLayout
            property={property}
            isOnline={isOnline}
            isStaging={isStaging}
            inspection={inspection}
            templateSections={sortedTemplateSections}
            collapsedSections={collapsedSections}
            onSectionCollapseToggle={onSectionCollapseToggle}
            onMainInputChange={onMainInputChange}
            onShareAction={onShareAction}
            sectionItems={sectionItems}
          />
        </>
      )}
      {isDesktop && (
        <>
          <DesktopLayout
            property={property}
            isOnline={isOnline}
            isStaging={isStaging}
            inspection={inspection}
            templateSections={sortedTemplateSections}
            collapsedSections={collapsedSections}
            onSectionCollapseToggle={onSectionCollapseToggle}
            onMainInputChange={onMainInputChange}
            onShareAction={onShareAction}
            sectionItems={sectionItems}
          />
        </>
      )}
    </>
  );
};

export default PropertyUpdateInspection;
