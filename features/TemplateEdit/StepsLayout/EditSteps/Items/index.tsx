import { FunctionComponent } from 'react';
import TemplateSectionModel from '../../../../../common/models/inspectionTemplateSection';
import TemplateItemModel from '../../../../../common/models/inspectionTemplateItem';
import stepsStyles from '../styles.module.scss';
import DiamondIcon from '../../../../../public/icons/sparkle/diamond.svg';
import DiamondLayersIcon from '../../../../../public/icons/sparkle/diamond-layers.svg';
import deepClone from '../../../../../__tests__/helpers/deepClone';
import ItemInputs from '../../ItemInputs';

interface Props {
  sortedSections: TemplateSectionModel[];
  templateSectionItems: Map<string, TemplateItemModel[]>;
  forceVisible?: boolean;
}

const Items: FunctionComponent<Props> = ({
  sortedSections,
  templateSectionItems,
  forceVisible
}) => (
  <>
    <header className={stepsStyles.header}>
      <h3 className={stepsStyles.header__title}>Item Elements</h3>
    </header>

    {sortedSections.map((section) => {
      const sectionItems = templateSectionItems.get(section.id) || [];
      return (
        <div key={section.id}>
          <header className={stepsStyles.sectionHeader}>
            <h3 className={stepsStyles.sectionHeader__title}>
              {section.title}
            </h3>
            <span>
              {section.section_type === 'multi' ? (
                <DiamondLayersIcon
                  className={stepsStyles.sectionHeader__icon}
                />
              ) : (
                <DiamondIcon className={stepsStyles.sectionHeader__icon} />
              )}
            </span>
          </header>
          <ul>
            {sectionItems.map((item) => {
              const templateItem = deepClone(item);
              templateItem.mainInputZeroValue = '?';
              templateItem.mainInputOneValue = '?';
              templateItem.mainInputTwoValue = '?';
              templateItem.mainInputThreeValue = '?';
              templateItem.mainInputFourValue = '?';

              return (
                <ItemInputs
                  item={templateItem}
                  key={templateItem.id}
                  forceVisible={forceVisible}
                  onMouseDownMainInput={() => {}} // eslint-disable-line @typescript-eslint/no-empty-function
                />
              );
            })}
          </ul>
        </div>
      );
    })}
  </>
);

export default Items;
