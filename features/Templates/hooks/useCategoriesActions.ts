import { useState } from 'react';
import categoriesApi from '../../../common/services/api/categories';
import errorReports from '../../../common/services/api/errorReports';
import BaseError from '../../../common/models/errors/baseError';
import TemplateCategoryModel from '../../../common/models/templateCategory';
import ErrorConflictingRequest from '../../../common/models/errors/conflictingRequest';

const PREFIX = 'features: Templates: hooks: useCategories:';

interface useCategoriesActionsResult {
  createCategory(category: TemplateCategoryModel): void;
  updateCategory(category: TemplateCategoryModel): void;
  deleteCategory(category: TemplateCategoryModel): void;
  savingCategories: string[];
  unpublishedCategories: TemplateCategoryModel[];
  setUnpublishedCategories(catIds: TemplateCategoryModel[]): void;
  deletedCategories: string[];
}

type userNotifications = (message: string, options?: any) => any;

export default function useCategoriesActions(
  sendNotification: userNotifications
): useCategoriesActionsResult {
  const [savingCategories, setSavingCategories] = useState([]);
  const [unpublishedCategories, setUnpublishedCategories] = useState([]);
  const [deletedCategories, setDeletedCategories] = useState([]);

  const sendErrorReports = (error: BaseError) => {
    // Log issue and send error report
    // eslint-disable-next-line no-case-declarations
    const wrappedErr = Error(`${PREFIX} sendErrorReports: ${error}`);

    // eslint-disable-next-line import/no-named-as-default-member
    errorReports.send(wrappedErr);
  };

  const handleErrorResponse = (error: BaseError, type: string) => {
    if (error instanceof ErrorConflictingRequest) {
      sendNotification(
        'Category name already exists, please choose a different name',
        {
          type: 'error'
        }
      );
    } else {
      sendNotification(`Failed to ${type} category, please try again`, {
        type: 'error'
      });
      sendErrorReports(error);
    }
  };

  const createCategory = async (category: TemplateCategoryModel) => {
    addToSavingcategories(category.id);
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      await categoriesApi.createRecord(category.name);
      // once category is created
      // remove it from unpublished categories
      setUnpublishedCategories((categories) =>
        [...categories].filter((cat) => cat.id !== category.id)
      );
    } catch (err) {
      handleErrorResponse(err, 'create');
    }
    removeFromSavingcategories(category.id);
  };

  const updateCategory = async (category: TemplateCategoryModel) => {
    addToSavingcategories(category.id);
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      await categoriesApi.updateRecord(category.id, category.name);
    } catch (err) {
      handleErrorResponse(err, 'update');
    }
    removeFromSavingcategories(category.id);
  };

  const addToSavingcategories = (id: string) => {
    setSavingCategories((categories) => [...categories, id]);
  };

  const removeFromSavingcategories = (id: string) => {
    setSavingCategories((categories) =>
      [...categories].filter((cat) => cat !== id)
    );
  };

  const deleteCategory = async (category: TemplateCategoryModel) => {
    setDeletedCategories([...deletedCategories, category.id]);
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      await categoriesApi.deleteRecord(category.id);
    } catch (err) {
      sendErrorReports(err);
      setDeletedCategories(
        [...deletedCategories].filter((id) => id !== category.id)
      );
      sendNotification(
        `Failed to delete category: ${category.name}, please try again`,
        {
          type: 'error'
        }
      );
    }
  };

  return {
    createCategory,
    updateCategory,
    deleteCategory,
    savingCategories,
    unpublishedCategories,
    setUnpublishedCategories,
    deletedCategories
  };
}
