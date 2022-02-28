import { FunctionComponent } from 'react';
import { useMediaQuery } from 'react-responsive';
import TemplateModel from '../../common/models/template';
import TemplateCategoryModel from '../../common/models/templateCategory';
import breakpoints from '../../config/breakpoints';
import Header from './Header';

interface Props {
  isOnline?: boolean;
  isStaging?: boolean;
  toggleNavOpen?(): void;
  templates: TemplateModel[];
  templateCategories: TemplateCategoryModel[];
}

const Templates: FunctionComponent<Props> = ({
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
  return (
    <>
      <Header
        isOnline={isOnline}
        isStaging={isStaging}
        isMobile={isMobile}
        isDesktop={isDesktop}
        toggleNavOpen={toggleNavOpen}
      />
    </>
  );
};

export default Templates;
