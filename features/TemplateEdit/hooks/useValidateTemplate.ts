import { useEffect, useMemo, useState } from 'react';
import TemplateModel from '../../../common/models/template';
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
}

export default function useValidateTemplate(
  updatedTemplate: TemplateModel,
  currentTemplate: TemplateModel
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

  const flattenedItems = Object.keys(items).map((id) => ({ id, ...items[id] }));
  const flattenedSections = Object.keys(sections).map((id) => ({
    id,
    ...sections[id]
  }));

  // validate general step
  const isValidGeneral = useMemo(
    () =>
      typeof updatedTemplate.name === 'string'
        ? Boolean(updatedTemplate.name)
        : Boolean(currentTemplate.name),
    [updatedTemplate.name, currentTemplate.name]
  );

  // validate section step
  const isValidSections = useMemo(
    () => flattenedSections.every((section) => Boolean(section.title)),

    [flattenedSections]
  );

  // validate section items step
  const isValidSectionItems = useMemo(
    () =>
      flattenedItems.every(
        (item) => Boolean(item.title) || item.itemType === 'signature'
      ),

    [flattenedItems]
  );

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
    isValidSections &&
    isValidSectionItems &&
    hasItemsInAllSections &&
    hasSections;

  const stepsStatus = {
    general: isValidGeneral ? 'valid' : 'invalid',
    sections: isValidSections && hasSections ? 'valid' : 'invalid',
    'section-items':
      isValidSectionItems && hasItemsInAllSections ? 'valid' : 'invalid',
    items: 'valid',
    'item-values': 'valid'
  };
  // console.log(stepsStatus,isValidSectionItems)
  const setErrorMessages = () => {
    const err = {
      name: isValidGeneral ? '' : 'Name is required',
      title: isValidSections ? '' : 'Name is required',
      itemTitle: isValidSectionItems ? '' : 'Name is required',
      sectionError: hasSections ? '' : 'Minimum 1 section is required',
      sectionItemError: !hasItemsInAllSections
        ? 'Minimum 1 item required in each section'
        : ''
    };

    setErrors(err);
  };

  const resetErrors = () => {
    const err = { ...errors };
    if (isValidGeneral && errors.name) {
      delete err.name;
    }
    if (isValidSections && errors.title) {
      delete err.title;
    }
    if (isValidSectionItems && errors.itemTitle) {
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
    isValidSections,
    isValidSectionItems,
    flattenedSections,
    hasItemsInAllSections,
    errors
  ]);

  return {
    setErrorMessages,
    errors,
    stepsStatus,
    isValidGeneral,
    isValidForm
  };
}
