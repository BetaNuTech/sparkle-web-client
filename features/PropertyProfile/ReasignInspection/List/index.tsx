import { FunctionComponent } from 'react';
import propertyModel from '../../../../common/models/property';
import Item from './Item';
import styles from './styles.module.scss';

interface Props {
  teamProperties: Array<propertyModel>;
  noTeamProperties: Array<propertyModel>;
  teamsIds: Array<string>;
  teams: Array<any>;
  selectedProperty: string;
  changePropertySelection: (string) => void;
}

const List: FunctionComponent<Props> = ({
  teamProperties,
  noTeamProperties,
  teams,
  teamsIds,
  selectedProperty,
  changePropertySelection
}) => {
  const header = (text) => (
    <header
      className={styles.reasignInspection__box__header}
      data-testid="template-category-name"
    >
      {text}
    </header>
  );

  return (
    <>
      {teamProperties.length
        ? teamsIds.map((team) => (
            <div key={team}>
              {header(
                teams
                  .filter((item) => item.id === team)
                  .map((item) => item.name)
              )}

              <Item
                properties={teamProperties.filter(
                  (property) => property.team === team
                )}
                selectedProperty={selectedProperty}
                changePropertySelection={changePropertySelection}
              />
            </div>
          ))
        : null}
      {noTeamProperties.length ? (
        <>
          {' '}
          {header('NO TEAM')}
          <Item
            properties={noTeamProperties}
            selectedProperty={selectedProperty}
            changePropertySelection={changePropertySelection}
          />
        </>
      ) : null}
    </>
  );
};

export default List;
