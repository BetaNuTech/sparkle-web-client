import { ChangeEvent, FunctionComponent, RefObject } from 'react';
import CategorizedTemplates from '../../../common/models/templates/categorizedTemplates';
import SearchBar from '../../../common/SearchBar';
import TemplateItem from './Item';

import styles from './styles.module.scss';

interface Props {
  categorizedTemplate: CategorizedTemplates[];
  canEdit: boolean;
  canDelete: boolean;
  canCreate: boolean;
  forceVisible: boolean;
  scrollElementRef: RefObject<HTMLDivElement>;
  isMobile: boolean;
  searchQuery: string;
  onSearchKeyDown: (
    ev: React.KeyboardEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>
  ) => void;
  onClearSearch(): void;
}

const TemplatesGroup: FunctionComponent<Props> = ({
  categorizedTemplate,
  canEdit,
  canDelete,
  canCreate,
  forceVisible,
  scrollElementRef,
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
                template={template}
                key={template.id}
                canEdit={canEdit}
                canDelete={canDelete}
                canCreate={canCreate}
                forceVisible={forceVisible}
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
    {searchQuery && (
      <div className={styles.action}>
        <button className={styles.action__clear} onClick={onClearSearch}>
          Clear Search
        </button>
      </div>
    )}
  </div>
);

export default TemplatesGroup;
