import moment from 'moment';
import formats from '../../config/formats';

export default {
  getFormattedDate(unixtimestamp: number): string {
    return unixtimestamp
      ? moment.unix(unixtimestamp).format(formats.userDateDisplayFormat)
      : moment().format(formats.userDateDisplayFormat);
  }
};
