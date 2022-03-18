import { FunctionComponent } from 'react';
import TemplateModel from '../../../../../common/models/template';
import TemplateCategoryModel from '../../../../../common/models/templateCategory';

import styles from './styles.module.scss';

interface Props {
  template: TemplateModel;
  templateCategories: TemplateCategoryModel[];
  updateName(name: string): void;
  updateDescription(description: string): void;
  updateCategory(category: string): void;
  updateTrackDeficientItems(trackDeficientItems: boolean): void;
  updateRequireDeficientItemNoteAndPhoto(
    requireDeficientItemNoteAndPhoto: boolean
  ): void;
}

const General: FunctionComponent<Props> = ({
  template,
  templateCategories,
  updateName,
  updateDescription,
  updateCategory,
  updateTrackDeficientItems,
  updateRequireDeficientItemNoteAndPhoto
}) => (
  <section className={styles.container}>
    <input
      type="text"
      className={styles.container__input}
      placeholder="Title"
      defaultValue={template.name}
      onChange={(e) => updateName(e.target.value)}
    />
    <textarea
      className={styles.container__textarea}
      placeholder="Description"
      defaultValue={template.description}
      onChange={(e) => updateDescription(e.target.value)}
    />
    <label className={styles.container__label}>Category</label>
    <select
      className={styles.container__select}
      value={template.category || ''}
      onChange={(e) => updateCategory(e.target.value)}
    >
      <option value="">Uncategorized</option>

      {templateCategories.map((cat) => (
        <option key={cat.id} value={cat.id}>
          {cat.name}
        </option>
      ))}
    </select>
    <div className={styles.switch}>
      <div className={styles.switch__label}>Track Deficient Item</div>
      <label className={styles.switch__action}>
        <input
          type="checkbox"
          className={styles.switch__checkbox}
          checked={template.trackDeficientItems}
          onChange={(e) => updateTrackDeficientItems(e.target.checked)}
        />
        <span className={styles.switch__slider}></span>
      </label>
    </div>
    <div className={styles.switch}>
      <div className={styles.switch__label}>
        Require Note & Photo for Deficient Items
      </div>
      <label className={styles.switch__action}>
        <input
          type="checkbox"
          className={styles.switch__checkbox}
          checked={template.requireDeficientItemNoteAndPhoto}
          onChange={(e) =>
            updateRequireDeficientItemNoteAndPhoto(e.target.checked)
          }
        />
        <span className={styles.switch__slider}></span>
      </label>
    </div>
  </section>
);

export default General;
