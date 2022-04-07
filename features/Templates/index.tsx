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
import ManageCategoriesModal from './ManageCategoriesModal';
import { uuid } from '../../common/utils/uuidv4';
import useTemplatesActions from './hooks/useTemplatesActions';
import LoadingHud from '../../common/LoadingHud';
import useCategoriesActions from './hooks/useCategoriesActions';
import DeleteTemplatePrompt from './DeletePrompt';
import useSearchTemplates from './hooks/useSearchTemplates';

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
  const [deleteTemplateId, setDeleteTemplateId] = useState(null);
  const [deletedIds, setDeletedIds] = useState([]);

  // Responsive queries
  const isMobile = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });

  const isDesktop = useMediaQuery({
    minWidth: breakpoints.desktop.minWidth
  });

  const {
    createTemplate,
    deleteTemplate,
    isLoading: isCreatingTemplate
  } = useTemplatesActions(sendNotification);

  const {
    createCategory,
    updateCategory,
    deleteCategory,
    savingCategories,
    unpublishedCategories,
    setUnpublishedCategories,
    deletedCategories
  } = useCategoriesActions(sendNotification);

  const scrollElementRef = useRef();
  usePreserveScrollPosition('TemplatesScroll', scrollElementRef, isMobile);

  const { categorizedTemplate, searchValue, onSearchKeyDown, onClearSearch } =
    useSearchTemplates(templates, templateCategories, deletedIds);

  // sort categories by name in ascending order
  const sortedCategories = templateCategories
    .filter((cat) => deletedCategories.includes(cat.id) === false)
    .sort((a, b) => a.name.localeCompare(b.name));

  const onCreateNewCategory = () => {
    setUnpublishedCategories([
      ...unpublishedCategories,
      { id: uuid(), name: '' }
    ]);
  };

  const onRemoveNewCategory = (category: TemplateCategoryModel) => {
    setUnpublishedCategories(
      [...unpublishedCategories].filter((cat) => cat.id !== category.id)
    );
  };

  const onCloseCategoriesModal = () => {
    setIsVisibleCategoryModal(false);
    setUnpublishedCategories([]);
  };

  const onCreateCategory = (category: TemplateCategoryModel) => {
    createCategory(category);
  };

  const onDeleteTemplate = (templateId: string) => {
    setDeleteTemplateId(templateId);
  };

  const onCloseDeletePrompt = () => {
    setDeleteTemplateId(null);
  };

  const onConfirmDeleteTemplate = async () => {
    setDeletedIds([...deletedIds, deleteTemplateId]);
    setDeleteTemplateId(null);
    const { isDeleted, templateId } = await deleteTemplate(deleteTemplateId);

    // if template is not deleted
    // remove it from deleted Ids list
    if (!isDeleted) {
      setDeletedIds([...deletedIds].filter((id) => id !== templateId));
    }
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
        templateCategories={sortedCategories}
        unpublishedCategories={unpublishedCategories}
        canCreateCategory={canCreateCategory}
        canUpdateCategory={canUpdateCategory}
        canDeleteCategory={canDeleteCategory}
        onCreateNewCategory={onCreateNewCategory}
        onCreateCategory={onCreateCategory}
        updateCategory={updateCategory}
        savingCategories={savingCategories}
        deleteCategory={deleteCategory}
        onRemoveNewCategory={onRemoveNewCategory}
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
        onDeleteTemplate={onDeleteTemplate}
        isMobile={isMobile}
        searchQuery={searchValue}
        onSearchKeyDown={onSearchKeyDown}
        onClearSearch={onClearSearch}
      />

      <DeleteTemplatePrompt
        isVisible={Boolean(deleteTemplateId)}
        onClose={onCloseDeletePrompt}
        onConfirm={onConfirmDeleteTemplate}
      />
    </>
  );
};

export default Templates;
