const _ = require('underscore');

/**
 * Return the longest subsequence with a logical determination sequence function
 * If there is same length of multpile logest subsequence, take the first one found.
 *
 * @param  {[Array]}  arr        Array of elements
 * @param  {function} isSequence (pref, succ) => Boolean
 * @return {[Hash]}              Length of sequence, index, and the value string
 */
const longestSubsequence = (arr, isSequence) => {
  if (!_.isArray(arr) || typeof isSequence !== 'function') throw new Error('Invalid parameter');
  // Starting of the array is null, therefore init length will be 0
  const res = _(arr).reduce((memo, particle) => {
    if (isSequence(memo.pref, particle)) {
      memo.current.value += particle;
      memo.current.length += 1;
    } else {
      if (!memo.longest || memo.longest.length < memo.current.length) {
        memo.longest = memo.current;
      }
      memo.current = {
        length: 1,
        index: memo.index,
        value: particle,
      };
    }
    memo.pref = particle;
    memo.index += 1;
    return memo;
  }, {
    pref: null,
    current: { length: 0, index: 0, value: '' },
    index: 0,
  });
  // Check for the whole array
  if (!res.longest || res.longest.length < res.current.length) {
    res.longest = res.current;
  }
  return res.longest;
};

const sequences = {
  string(pref, succ) {
    if (succ === null && pref !== null) return false;
    return !pref || pref.toLowerCase() <= succ.toLowerCase();
  },
  // Bitgroup sequence, only if it found a group
  bitgroup(pref, succ) {
    if (succ === null && pref !== null) return false;
    return pref === null || parseInt(pref, 10) === parseInt(succ, 10);
  },
  // Numerical sequence, consider an order of two same number a numerical order
  number(pref, succ) {
    if (succ === null && pref !== null) return false;
    return !pref || parseInt(pref, 10) <= parseInt(succ, 10);
  },
};

module.exports = {
  longestSubsequence,
  sequences,
  longestSubsequenceString(string = '') {
    return longestSubsequence(string.split(''), sequences.string);
  },
  longestSubsequenceBitgroup(string = '') {
    return longestSubsequence(string.split(''), sequences.bitgroup);
  },
  longestSubsequenceNumber(string = '') {
    return longestSubsequence(string.split(''), sequences.number);
  },
};
