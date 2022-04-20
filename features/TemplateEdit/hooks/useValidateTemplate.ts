import { useEffect, useMemo, useState } from 'react';
import TemplateModel from '../../../common/models/template';
import SectionModel from '../../../common/models/inspectionTemplateSection';
import ItemModel from '../../../common/models/inspectionTemplateItem';
import deepmerge from '../../../common/utils/deepmerge';

type Errors = {
  name?: string;
  title?: string;
  itemTitle?: string;
  sectionError?: string;
  sectionItemError?: string;
};

type StepsStatus = {
  general?: string;
  sections?: string;
  'section-items'?: string;
  items?: string;
  'item-values'?: string;
};

interface Result {
  setErrorMessages(): void;
  errors: Errors;
  stepsStatus: StepsStatus;
  isValidGeneral: boolean;
  isValidForm: boolean;
  invalidSections: string[];
  invalidItems: string[];
}

type UserNotifications = (message: string, options?: any) => any;

export default function useValidateTemplate(
  updatedTemplate: TemplateModel,
  currentTemplate: TemplateModel,
  sendNotification: UserNotifications
): Result {
  const [errors, setErrors] = useState<Errors>({});

  const items = deepmerge(
    currentTemplate.items || {},
    updatedTemplate.items || {}
  );

  const sections = deepmerge(
    currentTemplate.sections || {},
    updatedTemplate.sections || {}
  );

  const flattenedItems = Object.keys(items)
    .filter((id) => items[id])
    .map((id) => ({ id, ...items[id] } as ItemModel));

  const flattenedSections = Object.keys(sections)
    .filter((id) => sections[id])
    .map(
      (id) =>
        ({
          id,
          ...sections[id]
        } as SectionModel)
    );

  // validate general step
  const isValidGeneral = useMemo(
    () =>
      typeof updatedTemplate.name === 'string'
        ? Boolean(updatedTemplate.name)
        : Boolean(currentTemplate.name),
    [updatedTemplate.name, currentTemplate.name]
  );

  // validate sections step
  const { invalidSections, hasValidSections } = useMemo(() => {
    // get invalid section ids
    const invalidSectionIds: string[] = flattenedSections
      .filter((section) => !section.title)
      .filter((section) => Boolean(section.id)) // sandity check
      .map((section) => section.id);

    return {
      invalidSections: invalidSectionIds,
      hasValidSections: invalidSectionIds.length < 1
    };
  }, [flattenedSections]);

  // validate items step
  const { invalidItems, hasValidSectionItems } = useMemo(() => {
    // get invalidate item ids and sort it by section
    // to focus on first invalid item
    const invalidItemIds: string[] = flattenedItems
      .filter((item) => !item.title && item.itemType !== 'signature')
      .filter((item) => item.id && item.sectionId) // sanity check
      .sort(
        (a, b) => sections[a.sectionId].index - sections[b.sectionId].index
        //  a.sectionId.localeCompare(b.sectionId)
      )
      .map((item) => item.id);

    return {
      invalidItems: invalidItemIds,
      hasValidSectionItems: invalidItemIds.length < 1
    };
  }, [flattenedItems, sections]);

  // check if template have sections
  const hasSections = flattenedSections.length > 0;

  // check if all sections have items
  const hasItemsInAllSections = useMemo(
    () =>
      flattenedItems.length > 0 &&
      flattenedSections.every(
        (section) =>
          flattenedItems &&
          flattenedItems.some((item) => item.sectionId === section.id)
      ),
    [flattenedSections, flattenedItems]
  );

  const isValidForm =
    isValidGeneral &&
    hasValidSections &&
    hasValidSectionItems &&
    hasItemsInAllSections &&
    hasSections;

  const stepsStatus = {
    general: isValidGeneral ? 'valid' : 'invalid',
    sections: hasValidSections && hasSections ? 'valid' : 'invalid',
    'section-items':
      hasValidSectionItems && hasItemsInAllSections ? 'valid' : 'invalid',
    items: 'valid',
    'item-values': 'valid'
  };

  const setErrorMessages = () => {
    const err = {
      name: isValidGeneral ? '' : 'Name is required',
      title: hasValidSections ? '' : 'Name is required',
      itemTitle: hasValidSectionItems ? '' : 'Name is required',
      sectionError: hasSections ? '' : 'Minimum 1 section is required',
      sectionItemError: !hasItemsInAllSections
        ? 'Minimum 1 item required in each section'
        : ''
    };

    sendNotification('Please correct issues on this step before progressing', {
      type: 'error'
    });
    setErrors(err);
  };

  const resetErrors = () => {
    const err = { ...errors };
    if (isValidGeneral && errors.name) {
      delete err.name;
    }
    if (hasValidSections && errors.title) {
      delete err.title;
    }
    if (hasValidSectionItems && errors.itemTitle) {
      delete err.itemTitle;
    }
    if (hasSections && errors.sectionError) {
      delete err.sectionError;
    }
    if (hasItemsInAllSections && errors.sectionItemError) {
      delete err.sectionItemError;
    }
    if (JSON.stringify(err) !== JSON.stringify(errors)) {
      setErrors(err);
    }
  };

  // reset errors on template update
  useEffect(() => {
    resetErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isValidGeneral,
    hasValidSections,
    hasValidSectionItems,
    flattenedSections,
    hasItemsInAllSections,
    errors
  ]);

  return {
    setErrorMessages,
    errors,
    stepsStatus,
    isValidGeneral,
    isValidForm,
    invalidSections,
    invalidItems
  };
}
