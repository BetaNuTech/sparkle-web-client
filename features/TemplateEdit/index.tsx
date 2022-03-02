import { FunctionComponent } from 'react';
import TemplateModel from '../../common/models/template';
import TemplateCategoryModel from '../../common/models/templateCategory';
import UserModel from '../../common/models/user';

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

const TemplateEdit: FunctionComponent<Props> = () => <div>Template Edit</div>;

export default TemplateEdit;
