import { FunctionComponent } from 'react';
import TemplateModel from '../../common/models/template';
import TemplateCategoryModel from '../../common/models/templateCategory';

interface Props {
  templates: TemplateModel[];
  templateCategories: TemplateCategoryModel[];
}

const Templates: FunctionComponent<Props> = () => <div>Templates page</div>;

export default Templates;
