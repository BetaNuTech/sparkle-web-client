import { ChangeEvent, FunctionComponent, MouseEvent, useState } from 'react';
import TemplateSectionModel from '../../../../../common/models/inspectionTemplateSection';
import TemplateItemModel from '../../../../../common/models/inspectionTemplateItem';
import stepsStyles from '../styles.module.scss';
import DiamondIcon from '../../../../../public/icons/sparkle/diamond.svg';
import DiamondLayersIcon from '../../../../../public/icons/sparkle/diamond-layers.svg';
import ItemInputs from '../../ItemInputs';
import utilArray from '../../../../../common/utils/array';

const itemValueKeys = [
  'mainInputZeroValue',
  'mainInputOneValue',
  'mainInputTwoValue',
  'mainInputThreeValue',
  'mainInputFourValue'
];

interface Props {
  sections: TemplateSectionModel[];
  templateSectionItems: Map<string, TemplateItemModel[]>;
  forceVisible?: boolean;
  onUpdateScore(itemId: string, selectedInput: number, score: number): void;
}

const ItemValues: FunctionComponent<Props> = ({
  sections,
  templateSectionItems,
  forceVisible,
  onUpdateScore
}) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedInput, setSelectedInput] = useState(null);
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
    setSelectedInput(value);
    setSelectedItemInputValue(item[itemValueKeys[value]]);
  };

  const onChangeValue = (evt: ChangeEvent<HTMLSelectElement>) => {
    onUpdateScore(selectedItem, selectedInput, Number(evt.target.value));
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
        onChange={onChangeValue}
        data-testid="template-edit-item-value-select"
      >
        {utilArray.range(0, 100).map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>

      {sections.map((section) => {
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
                  item.id === selectedItem ? selectedInput : -1;

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
