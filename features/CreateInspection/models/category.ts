import templateModel from '../../../common/models/template';

interface category {
  id: string;
  name: string;
  templates: Array<templateModel>;
}

export default category;
