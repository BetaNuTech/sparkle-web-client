import { FunctionComponent, RefObject } from 'react';
import CategorizedTemplates from '../../../common/models/templates/categorizedTemplates';
import TemplateItem from './Item';
import styles from './styles.module.scss';

interface Props {
  categorizedTemplate: CategorizedTemplates[];
  canEdit: boolean;
  forceVisible: boolean;
  scrollElementRef: RefObject<HTMLDivElement>;
}

const TemplatesGroup: FunctionComponent<Props> = ({
  categorizedTemplate,
  canEdit,
  forceVisible,
  scrollElementRef
}) => (
  <div className={styles.container} ref={scrollElementRef}>
    {categorizedTemplate.map((group) => {
      const templates = group.templates || [];

      return (
        <div className={styles.group} key={group.id}>
          <h3 className={styles.heading}>{group.name}</h3>
          <ul>
            {templates.map((template) => (
              <TemplateItem
                template={template}
                key={template.id}
                canEdit={canEdit}
                forceVisible={forceVisible}
              />
            ))}
          </ul>
        </div>
      );
    })}

    {categorizedTemplate.length === 0 && (
      <h3 className="-c-gray-light -pt-sm -pl-sm -pb-sm -ta-center">
        No Templates Found
      </h3>
    )}
  </div>
);

export default TemplatesGroup;
