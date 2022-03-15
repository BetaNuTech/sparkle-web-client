import { FunctionComponent, MouseEvent, useState } from 'react';
import TemplateSectionModel from '../../../../../common/models/inspectionTemplateSection';
import TemplateItemModel from '../../../../../common/models/inspectionTemplateItem';
import stepsStyles from '../styles.module.scss';
import DiamondIcon from '../../../../../public/icons/sparkle/diamond.svg';
import DiamondLayersIcon from '../../../../../public/icons/sparkle/diamond-layers.svg';
import ItemInputs from '../../ItemInputs';

const itemValueKeys = [
  'mainInputZeroValue',
  'mainInputOneValue',
  'mainInputTwoValue',
  'mainInputThreeValue',
  'mainInputFourValue'
];

interface Props {
  sortedSections: TemplateSectionModel[];
  templateSectionItems: Map<string, TemplateItemModel[]>;
  forceVisible?: boolean;
}

const ItemValues: FunctionComponent<Props> = ({
  sortedSections,
  templateSectionItems,
  forceVisible
}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemSelection, setItemSelection] = useState(null);
  const [selectedItemInputValue, setSelectedItemInputValue] = useState(null);
  const [selectStyle, setSelectStyle] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0
  });

  const onMouseDownMainInput = (
    evt: MouseEvent<HTMLLIElement>,
    item: TemplateItemModel,
    value: number
  ) => {
    setSelectStyle({
      top: evt.currentTarget.offsetTop,
      left: evt.currentTarget.offsetLeft,
      width: evt.currentTarget.offsetWidth,
      height: evt.currentTarget.offsetHeight
    });
    setSelectedItem(item.id);
    setItemSelection(value);
    setSelectedItemInputValue(item[itemValueKeys[value]]);
  };

  return (
    <>
      <header className={stepsStyles.header}>
        <h3 className={stepsStyles.header__title}>Item Values</h3>
      </header>
      <select
        className={stepsStyles.valueSelectMenu}
        style={selectStyle}
        value={selectedItemInputValue || 0}
        onChange={() => {}} // eslint-disable-line @typescript-eslint/no-empty-function
      >
        {Array.from(new Array(101), (val, index) => index).map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>

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
                const selectedToScore =
                  item.id === selectedItem ? itemSelection : -1;

                return (
                  <ItemInputs
                    item={item}
                    key={item.id}
                    forceVisible={forceVisible}
                    selectedToScore={selectedToScore}
                    onMouseDownMainInput={(event, selectionIndex) =>
                      onMouseDownMainInput(event, item, selectionIndex)
                    }
                  />
                );
              })}
            </ul>
          </div>
        );
      })}
    </>
  );
};

export default ItemValues;
