import { FunctionComponent } from 'react';

import { useMediaQuery } from 'react-responsive';
import TemplateModel from '../../common/models/template';
import TemplateCategoryModel from '../../common/models/templateCategory';
import UserModel from '../../common/models/user';
import breakpoints from '../../config/breakpoints';
import Header from './Header';
import StepsLayout from './StepsLayout';
import useSteps from './hooks/useSteps';
import useTemplateSectionItems from './hooks/useTemplateSectionItems';

interface Props {
  user: UserModel;
  template: TemplateModel;
  unpublishedUpdates: TemplateModel;
  templateCategories: TemplateCategoryModel[];
  forceVisible?: boolean;
  isOnline?: boolean;
  isStaging?: boolean;
  toggleNavOpen?(): void;
}

const TemplateEdit: FunctionComponent<Props> = ({
  isOnline,
  isStaging,
  template,
  templateCategories,
  forceVisible
}) => {
  // Responsive queries
  const isMobile = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });

  const {
    steps,
    currentStepIndex,
    isLastStep,
    changeStep,
    goToNextStep,
    goToPrevStep
  } = useSteps();

  const { templateSectionItems } = useTemplateSectionItems(template);

  const sections = template.sections || {};
  // sort sections by index
  const sortedSections = Object.keys(sections)
    .map((id) => ({ id, ...sections[id] }))
    .sort(({ index: aIndex }, { index: bIndex }) => aIndex - bIndex);

  return (
    <>
      <Header
        isOnline={isOnline}
        isStaging={isStaging}
        isMobile={isMobile}
        goToNextStep={goToNextStep}
        goToPrevStep={goToPrevStep}
        currentStepIndex={currentStepIndex}
        isLastStep={isLastStep}
        templateName={template.name}
      />
      <StepsLayout
        currentStepIndex={currentStepIndex}
        isMobile={isMobile}
        steps={steps}
        changeStep={changeStep}
        goToNextStep={goToNextStep}
        goToPrevStep={goToPrevStep}
        isLastStep={isLastStep}
        template={template}
        templateCategories={templateCategories}
        templateSectionItems={templateSectionItems}
        sortedSections={sortedSections}
        forceVisible={forceVisible}
      />
    </>
  );
};

export default TemplateEdit;
