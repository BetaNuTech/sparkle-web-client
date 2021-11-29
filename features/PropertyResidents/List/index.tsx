import { FunctionComponent } from 'react';
import residentModel from '../../../common/models/yardi/resident';
import Item from './Item';

interface Props {
  residents: residentModel[];
}

const ResidentList: FunctionComponent<Props> = ({ residents }) => (
  <ul>
    {residents.map((resident) => (
      <Item key={resident.id} resident={resident} />
    ))}
  </ul>
);

export default ResidentList;
