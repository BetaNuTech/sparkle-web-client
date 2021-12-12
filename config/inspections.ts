export default {
  deficiencies: {
    twoactions_checkmarkx: [false, true],
    twoactions_thumbs: [false, true],
    threeactions_checkmarkexclamationx: [false, false, true],
    threeactions_abc: [false, false, true],
    fiveactions_onetofive: [true, true, false, false, false],
    oneaction_notes: [false]
  },

  sufficiencies: {
    twoactions_checkmarkx: [true, false],
    twoactions_thumbs: [true, false],
    threeactions_checkmarkexclamationx: [true, false, false],
    threeactions_abc: [true, false, false],
    fiveactions_onetofive: [false, false, false, true, true],
    oneaction_notes: []
  },

  inspectionValueNames: {
    twoactions_checkmarkx: ['checkmark', 'X'],
    twoactions_thumbs: ['thumbsup', 'thumbsdown'],
    threeactions_checkmarkexclamationx: ['checkmark', 'exclamation', 'X'],
    threeactions_abc: ['A', 'B', 'C'],
    fiveactions_onetofive: ['1', '2', '3', '4', '5']
  }
};
