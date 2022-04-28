import { FunctionComponent, useRef } from 'react';
import TemplateModel from '../../../../common/models/template';
import stringUtils from '../../../../common/utils/string';
import styles from './styles.module.scss';
import Dropdown from './Dropdown';
import useVisibility from '../../../../common/hooks/useVisibility';
import LinkFeature from '../../../../common/LinkFeature';
import features from '../../../../config/features';

interface Props {
  isOnline: boolean;
  template: TemplateModel;
  canEdit: boolean;
  canDelete: boolean;
  canCreate: boolean;
  forceVisible: boolean;
  onCreateTemplate(templateId?: string): void;
  onDeleteTemplate(templateId?: string): void;
}

const TemplateItem: FunctionComponent<Props> = ({
  isOnline,
  template,
  canEdit,
  canDelete,
  canCreate,
  forceVisible,
  onCreateTemplate,
  onDeleteTemplate
}) => {
  const placeholderRef = useRef(null);
  const { isVisible } = useVisibility(placeholderRef, {}, forceVisible);
  const showActions = canEdit || canCreate || canDelete;

  return (
    <li className={styles.item} ref={placeholderRef}>
      {isVisible && (
        <>
          <div className={styles.column}>
            <LinkFeature
              href={`/templates/edit/${template.id}`}
              legacyHref={`/templates/update/${template.id}`}
              featureEnabled={features.supportTemplateEdit}
            >
              <h6 className={styles.heading}>
                {stringUtils.titleize(template.name)}
              </h6>
              <p className={styles.description}>
                {template.description || 'No Description'}
              </p>
            </LinkFeature>
          </div>
          <div className={styles.column}>
            {showActions && (
              <Dropdown
                isOnline={isOnline}
                canEdit={canEdit}
                canCreate={canCreate}
                canDelete={canDelete}
                templateId={template.id}
                onCopy={() => onCreateTemplate(template.id)}
                onDelete={() => onDeleteTemplate(template.id)}
              />
            )}
          </div>
        </>
      )}
    </li>
  );
};

export default TemplateItem;
