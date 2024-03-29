import { ChangeEvent, FunctionComponent, RefObject } from 'react';
import CategorizedTemplates from '../../../common/models/templates/categorizedTemplates';
import SearchBar, { ClearSearchAction } from '../../../common/SearchBar';
import TemplateItem from './Item';

import styles from './styles.module.scss';

interface Props {
  isOnline: boolean;
  categorizedTemplate: CategorizedTemplates[];
  canEdit: boolean;
  canDelete: boolean;
  canCreate: boolean;
  forceVisible: boolean;
  scrollElementRef: RefObject<HTMLDivElement>;
  onCreateTemplate(templateId?: string): void;
  onDeleteTemplate(templateId?: string): void;
  isMobile: boolean;
  searchQuery: string;
  onSearchKeyDown: (
    ev: React.KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>
  ) => void;
  onClearSearch(): void;
}

const TemplatesGroup: FunctionComponent<Props> = ({
  isOnline,
  categorizedTemplate,
  canEdit,
  canDelete,
  canCreate,
  forceVisible,
  scrollElementRef,
  onCreateTemplate,
  onDeleteTemplate,
  isMobile,
  searchQuery,
  onSearchKeyDown,
  onClearSearch
}) => (
  <div className={styles.container} ref={scrollElementRef}>
    {!isMobile && (
      <SearchBar
        searchQuery={searchQuery}
        onSearchKeyDown={onSearchKeyDown}
        onClearSearch={onClearSearch}
      />
    )}
    {categorizedTemplate.map((group) => {
      const templates = group.templates || [];

      return (
        <div className={styles.group} key={group.id}>
          <h3 className={styles.heading}>{group.name}</h3>
          <ul>
            {templates.map((template) => (
              <TemplateItem
                isOnline={isOnline}
                template={template}
                key={template.id}
                canEdit={canEdit}
                canDelete={canDelete}
                canCreate={canCreate}
                forceVisible={forceVisible}
                onCreateTemplate={onCreateTemplate}
                onDeleteTemplate={onDeleteTemplate}
              />
            ))}
          </ul>
        </div>
      );
    })}

    {categorizedTemplate.length === 0 && (
      <h3 className="-c-gray-light -pt-sm -pl-sm -pb-sm -ta-center">
        {searchQuery ? 'No Templates Match Search' : 'No Templates Found'}
      </h3>
    )}
    <ClearSearchAction
      searchQuery={searchQuery}
      onClearSearch={onClearSearch}
    />
  </div>
);

export default TemplatesGroup;
