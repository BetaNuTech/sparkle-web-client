import { FunctionComponent, useRef } from 'react';
import TemplateModel from '../../../../common/models/template';
import stringUtils from '../../../../common/utils/string';
import styles from './styles.module.scss';
import Dropdown from './Dropdown';
import useVisibility from '../../../../common/hooks/useVisibility';
import LinkFeature from '../../../../common/LinkFeature';
import features from '../../../../config/features';

interface Props {
  template: TemplateModel;
  canEdit: boolean;
  forceVisible: boolean;
}

const TemplateItem: FunctionComponent<Props> = ({
  template,
  canEdit,
  forceVisible
}) => {
  const placeholderRef = useRef(null);
  const { isVisible } = useVisibility(placeholderRef, {}, forceVisible);
  return (
    <li className={styles.item} ref={placeholderRef}>
      {isVisible && (
        <>
          <div className={styles.column}>
            <LinkFeature
              href={`/templates/edit/${template.id}`}
              legacyHref={`/templates/update/${template.id}`}
              featureEnabled={features.supportBetaTemplateEdit}
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
            {/* TODO Check if user has create & delete permissions as well
                if user has no permissions do not render dropdown */}
            {canEdit && <Dropdown canEdit={canEdit} templateId={template.id} />}
          </div>
        </>
      )}
    </li>
  );
};

export default TemplateItem;
