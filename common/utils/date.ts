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

  // Create a date string in "MMMM D, YYYY" format
  toUserFullDateDisplay(unixtimestamp?: number): string {
    return unixtimestamp
      ? moment.unix(unixtimestamp).format(formats.userDateFullDisplay)
      : moment().format(formats.userDateFullDisplay);
  },

  // Convert a UNIX timestamp to app's
  // User Time Date Display format
  toUserTimeDisplay(unixtimestamp?: number): string {
    return unixtimestamp
      ? moment.unix(unixtimestamp).format(formats.userTimeDisplay)
      : moment().format(formats.userTimeDisplay);
  },

  // Convert an ISO date string to
  // a UNIX timestamp
  isoToTimestamp(dateString?: string): number {
    if (dateString) {
      return moment(dateString).unix();
    }

    return 0;
  }
};
