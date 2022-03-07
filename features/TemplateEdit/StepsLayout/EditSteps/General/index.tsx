import { FunctionComponent } from 'react';
import TemplateModel from '../../../../../common/models/template';
import TemplateCategoryModel from '../../../../../common/models/templateCategory';

import styles from './styles.module.scss';

interface Props {
  template: TemplateModel;
  templateCategories: TemplateCategoryModel[];
}

const General: FunctionComponent<Props> = ({
  template,
  templateCategories
}) => {
  // TODO update for local user updates
  const hasSelectedCategory = Boolean(template.category);

  return (
    <section className={styles.container}>
      <input
        type="text"
        className={styles.container__input}
        placeholder="Title"
        defaultValue={template.name}
      />
      <textarea
        className={styles.container__textarea}
        placeholder="Description"
        defaultValue={template.description}
      />
      <label className={styles.container__label}>Category</label>
      <select
        className={styles.container__select}
        defaultValue={template.category || ''}
      >
        <option selected={!hasSelectedCategory} value="">
          Uncategorized
        </option>

        {templateCategories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      <div className={styles.switch}>
        <div className={styles.switch__label}>Track Deficient Item</div>
        <label className={styles.switch__action}>
          <input type="checkbox" className={styles.switch__checkbox} />
          <span className={styles.switch__slider}></span>
        </label>
      </div>
      <div className={styles.switch}>
        <div className={styles.switch__label}>
          Require Note & Photo for Deficient Items
        </div>
        <label className={styles.switch__action}>
          <input type="checkbox" className={styles.switch__checkbox} />
          <span className={styles.switch__slider}></span>
        </label>
      </div>
    </section>
  );
};

export default General;
