export default {
  /**
   * Creates a search index based on id and returns a string in lowercase on given attributes
   *
   * @param records Array of records to create index from
   * @param queryAttrs Array of proeprties from object
   * @returns string
   */
  createSearchIndex(
    records: Array<any>,
    queryAttrs: Array<string>
  ): Record<string, string> {
    return records.reduce((acc, record) => {
      acc[record.id] = Object.keys(record)
        .filter((rk) => queryAttrs.includes(rk))
        .map((k) => String(record[k]).toLowerCase())
        .join(' ');
      return acc;
    }, {});
  },

  /**
   * Looks up search string in given search index and returns array of possible ids of search indexes
   *
   * @param searchIdx Search index to query from
   * @param query Text which needs to be looked onto
   * @returns array
   */
  querySearchIndex(
    searchIdx: Record<string, string>,
    query: Array<string>
  ): Array<string> {
    return Object.entries(searchIdx)
      .filter(
        ([, index]) =>
          query.filter((q) => index.search(q.toLowerCase()) > -1).length > 0
      )
      .map(([id]) => id);
  }
};
