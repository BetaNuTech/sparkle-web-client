import moment from 'moment';
import formats from '../../config/formats';

export default {
  // Convert a UNIX timestamp to app's
  // User Date Time Display format
  toUserDateTimeDisplay(unixtimestamp?: number): string {
    return unixtimestamp
      ? moment.unix(unixtimestamp).format(formats.userDateTimeDisplay)
      : moment().format(formats.userDateTimeDisplay);
  },

  // Convert a UNIX timestamp to app's
  // User Date Display format
  toUserDateDisplay(unixtimestamp?: number): string {
    return unixtimestamp
      ? moment.unix(unixtimestamp).format(formats.userDateDisplay)
      : moment().format(formats.userDateDisplay);
  },

  // Convert a UNIX timestamp to app's
  // User Time Date Display format
  toUserTimeDisplay(unixtimestamp?: number): string {
    return unixtimestamp
      ? moment.unix(unixtimestamp).format(formats.userTimeDisplay)
      : moment().format(formats.userTimeDisplay);
  }
};
