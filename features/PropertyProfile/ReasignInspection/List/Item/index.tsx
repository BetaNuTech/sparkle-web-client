import { FunctionComponent } from 'react';
import propertyModel from '../../../../../common/models/property';
import styles from '../styles.module.scss';

interface Props {
  properties: Array<propertyModel>;
  selectedProperty: string;
  changePropertySelection: (string) => void;
}

const Item: FunctionComponent<Props> = ({
  properties,
  selectedProperty,
  changePropertySelection
}) => {
  const checkItem = (id) => {
    if (selectedProperty === id) {
      changePropertySelection('');
    } else {
      changePropertySelection(id);
    }
  };

  return (
    <ul className={styles.reasignInspection__list}>
      {properties.length &&
        properties.map((property) => (
          <li className={styles.reasignInspection__items} key={property.id}>
            <input
              type="checkbox"
              id={property.id}
              data-testid={`checkbox-item-${property.id}`}
              className={styles.reasignInspection__items__input}
              checked={selectedProperty === property.id}
              onChange={() => checkItem(property.id)}
              value={property.id}
            />
            <label
              htmlFor={property.id}
              className={styles.reasignInspection__items__label}
            >
              <div className={styles.reasignInspection__items__label__text}>
                {property.name}
              </div>
            </label>
          </li>
        ))}
    </ul>
  );
};

export default Item;
