import TemplateCategoryModel from '../templateCategory';
import TemplateModel from '../template';

interface CategorizedTemplates extends TemplateCategoryModel {
  templates: TemplateModel[];
}

export default CategorizedTemplates;
