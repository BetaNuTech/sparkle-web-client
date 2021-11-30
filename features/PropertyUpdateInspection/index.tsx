import { FunctionComponent, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
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
import inspectionTemplateModel from '../../common/models/inspectionTemplate';
import useUpdateTemplate from './hooks/useUpdateTemplate';
import useUnpublishedTemplateUpdates from './hooks/useUnpublishedTemplateUpdates';
import OneActionNotesModal from './OneActionNotesModal';

interface Props {
  user: userModel;
  inspection: inspectionModel;
  unpublishedTemplateUpdates: inspectionTemplateModel;
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
  inspection,
  unpublishedTemplateUpdates
}) => {


  const { updateMainInputSelection, updateMainInputNotes, updateTextInputValue } = useUpdateTemplate(
    unpublishedTemplateUpdates,
    inspection.template
  );
  const [isVisibleOneActionNotesModal, setIsVisibleOneActionNotesModal] =
    useState(false);
  const [selectedInspectionItem, setSelectedInspectionItem] = useState(null);
  const { setLatestTemplateUpdates } = useUnpublishedTemplateUpdates(
    unpublishedTemplateUpdates
  );

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

  // User selects new main input option
  const onMainInputChange = (
    event: React.MouseEvent<HTMLLIElement> | React.ChangeEvent<HTMLInputElement>,
    item: inspectionTemplateItemModel,
    selectionIndex: number
  ) => {
    setLatestTemplateUpdates(updateMainInputSelection(item.id, selectionIndex));
  };
  const onTextInputValueChange = (
    event: React.MouseEvent<HTMLLIElement> | React.ChangeEvent<HTMLInputElement>,
    item: inspectionTemplateItemModel,
    textInputValue: string
  ) => {
    setLatestTemplateUpdates(updateTextInputValue(item.id, textInputValue));
  };

  const onInputChange = (
    event: React.MouseEvent<HTMLLIElement> | React.ChangeEvent<HTMLInputElement>,
    item: inspectionTemplateItemModel,
    value: any
  ) => {
    if(item.itemType === 'text_input'){
      onTextInputValueChange(event,item,value)
    }
    else{
      onMainInputChange(event,item,value)
    }
  };

  //update mainInputNotes in inspections item.
  const onOneActionNotesChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setLatestTemplateUpdates(
      updateMainInputNotes(selectedInspectionItem.id, event.target.value)
    );
  };

  const { sortedTemplateSections, collapsedSections, onSectionCollapseToggle } =
    useInspectionSectionSort(inspection.template.sections);

  // Items grouped by their section
  const { sectionItems } = useInspectionItems(
    unpublishedTemplateUpdates,
    inspection.template
  );

  const onShareAction = () => {
    copyTextToClipboard(window.location.href);
    sendNotification('Copied to clipboard.', { type: 'success' });
  };

  //opens OneActionsNotes modal and also set selected inspection
  const onClickOneActionNotes = (item: inspectionTemplateItemModel) => {
    setIsVisibleOneActionNotesModal(true);
    setSelectedInspectionItem(item);
  };

  //closes OneActionsNotes modal and also remove value for selected inspection item.
  const closeOneActionNotesModal = () => {
    setIsVisibleOneActionNotesModal(false);
    setSelectedInspectionItem(null);
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
            onInputChange={onInputChange}
            onShareAction={onShareAction}
            sectionItems={sectionItems}
            onClickOneActionNotes={onClickOneActionNotes}
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
            onInputChange={onInputChange}
            onShareAction={onShareAction}
            sectionItems={sectionItems}
            onClickOneActionNotes={onClickOneActionNotes}
          />
        </>
      )}
      <OneActionNotesModal
        isVisible={isVisibleOneActionNotesModal}
        onClose={closeOneActionNotesModal}
        onChange={onOneActionNotesChange}
        selectedInspectionItem={selectedInspectionItem}
      />
    </>
  );
};

export default PropertyUpdateInspection;
