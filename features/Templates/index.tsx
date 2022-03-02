import { FunctionComponent, useRef, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import usePreserveScrollPosition from '../../common/hooks/usePreserveScrollPosition';
import TemplateModel from '../../common/models/template';
import TemplateCategoryModel from '../../common/models/templateCategory';
import UserModel from '../../common/models/user';
import {
  canCreateTemplate,
  canCreateTemplateCategory,
  canDeleteTemplate,
  canDeleteTemplateCategory,
  canUpdateTemplate,
  canUpdateTemplateCategory
} from '../../common/utils/userPermissions';
import breakpoints from '../../config/breakpoints';
import Header from './Header';
import TemplatesGroup from './Group';
import useCategorizedTemplates from '../../common/hooks/useCategorizedTemplates';
import useSearching from '../../common/hooks/useSearching';
import ManageCategoriesModal from './ManageCategoriesModal';
import { uuid } from '../../common/utils/uuidv4';
import useCreateTemplate from './hooks/useCreateTemplate';
import LoadingHud from '../../common/LoadingHud';

type userNotifications = (message: string, options?: any) => any;
interface Props {
  user: UserModel;
  templates: TemplateModel[];
  templateCategories: TemplateCategoryModel[];
  forceVisible?: boolean;
  isOnline?: boolean;
  isStaging?: boolean;
  toggleNavOpen?(): void;
  sendNotification: userNotifications;
}

const Templates: FunctionComponent<Props> = ({
  user,
  templates,
  templateCategories,
  forceVisible,
  isOnline,
  isStaging,
  toggleNavOpen,
  sendNotification
}) => {
  const [isVisibleCategoryModal, setIsVisibleCategoryModal] = useState(false);
  const [unpublishedCategories, setUnpublishedCategories] = useState([]);

  // Responsive queries
  const isMobile = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });

  const isDesktop = useMediaQuery({
    minWidth: breakpoints.desktop.minWidth
  });

  const { createTemplate, isLoading: isCreatingTemplate } =
    useCreateTemplate(sendNotification);

  const scrollElementRef = useRef();
  usePreserveScrollPosition('TemplatesScroll', scrollElementRef, isMobile);

  // Templates search setup
  const { onSearchKeyDown, filteredItems, searchValue, onClearSearch } =
    useSearching(templates, ['name', 'description']);
  const filteredTemplates = filteredItems.map((itm) => itm as TemplateModel);

  const { categories: categorizedTemplate } = useCategorizedTemplates(
    templateCategories,
    filteredTemplates
  );

  const onCreateNewCategory = () => {
    setUnpublishedCategories([
      ...unpublishedCategories,
      { id: uuid(), name: '' }
    ]);
  };

  const onCloseCategoriesModal = () => {
    setIsVisibleCategoryModal(false);
    setUnpublishedCategories([]);
  };

  // Template permissions check
  const canEdit = canUpdateTemplate(user);
  const canCreate = canCreateTemplate(user);
  const canDelete = canDeleteTemplate(user);

  // Categories permissions checks
  const canCreateCategory = canCreateTemplateCategory(user);
  const canUpdateCategory = canUpdateTemplateCategory(user);
  const canDeleteCategory = canDeleteTemplateCategory(user);
  const canManageCategories =
    canCreateCategory || canUpdateCategory || canDeleteCategory;

  if (isCreatingTemplate) {
    return <LoadingHud title="Creating Template" />;
  }
  return (
    <>
      <Header
        isOnline={isOnline}
        isStaging={isStaging}
        isMobile={isMobile}
        isDesktop={isDesktop}
        toggleNavOpen={toggleNavOpen}
        searchQuery={searchValue}
        onSearchKeyDown={onSearchKeyDown}
        onClearSearch={onClearSearch}
        onManageCategory={() => setIsVisibleCategoryModal(true)}
        canManageCategories={canManageCategories}
        canCreate={canCreate}
        onCreateTemplate={createTemplate}
      />
      <ManageCategoriesModal
        isVisible={isVisibleCategoryModal}
        onClose={onCloseCategoriesModal}
        templateCategories={templateCategories}
        unpublishedCategories={unpublishedCategories}
        canCreateCategory={canCreateCategory}
        canUpdateCategory={canUpdateCategory}
        canDeleteCategory={canDeleteCategory}
        onCreateNewCategory={onCreateNewCategory}
      />
      <TemplatesGroup
        isOnline={isOnline}
        categorizedTemplate={categorizedTemplate}
        canEdit={canEdit}
        canDelete={canDelete}
        canCreate={canCreate}
        forceVisible={forceVisible}
        scrollElementRef={scrollElementRef}
        onCreateTemplate={createTemplate}
        isMobile={isMobile}
        searchQuery={searchValue}
        onSearchKeyDown={onSearchKeyDown}
        onClearSearch={onClearSearch}
      />
    </>
  );
};

export default Templates;
