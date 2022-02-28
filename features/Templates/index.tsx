import { FunctionComponent, useRef } from 'react';
import { useMediaQuery } from 'react-responsive';
import usePreserveScrollPosition from '../../common/hooks/usePreserveScrollPosition';
import TemplateModel from '../../common/models/template';
import TemplateCategoryModel from '../../common/models/templateCategory';
import UserModel from '../../common/models/user';
import { canUpdateTemplate } from '../../common/utils/userPermissions';
import breakpoints from '../../config/breakpoints';
import Header from './Header';
import TemplatesGroup from './Group';
import useCategorizedTemplates from '../../common/hooks/useCategorizedTemplates';

interface Props {
  user: UserModel;
  templates: TemplateModel[];
  templateCategories: TemplateCategoryModel[];
  forceVisible?: boolean;
  isOnline?: boolean;
  isStaging?: boolean;
  toggleNavOpen?(): void;
}

const Templates: FunctionComponent<Props> = ({
  user,
  templates,
  templateCategories,
  forceVisible,
  isOnline,
  isStaging,
  toggleNavOpen
}) => {
  // Responsive queries
  const isMobile = useMediaQuery({
    maxWidth: breakpoints.tablet.maxWidth
  });

  const isDesktop = useMediaQuery({
    minWidth: breakpoints.desktop.minWidth
  });

  const scrollElementRef = useRef();

  usePreserveScrollPosition('TemplatesScroll', scrollElementRef, isMobile);

  const { categories: categorizedTemplate } = useCategorizedTemplates(
    templateCategories,
    templates
  );

  const canEdit = canUpdateTemplate(user);

  return (
    <>
      <Header
        isOnline={isOnline}
        isStaging={isStaging}
        isMobile={isMobile}
        isDesktop={isDesktop}
        toggleNavOpen={toggleNavOpen}
      />
      <TemplatesGroup
        categorizedTemplate={categorizedTemplate}
        canEdit={canEdit}
        forceVisible={forceVisible}
        scrollElementRef={scrollElementRef}
      />
    </>
  );
};

export default Templates;
