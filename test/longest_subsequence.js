/* eslint-disable */
const { expect } = require('chai');

const Subsequence = require('../longest_subsequence');

describe('Sequence', function() {
  const { string, bitgroup, number } = Subsequence.sequences;
  describe('#string', function() {
    it('anything being successor of null', function() {
      expect(string(null, '')).to.be.ok;
      expect(string(null, null)).to.be.ok;
      expect(string(null, 'a')).to.be.ok;
      expect(string(null, 'b')).to.be.ok;
    });
    it('nothing is predecessor of null', function() {
      expect(string('', null)).to.be.not.ok;
      expect(string('a', null)).to.be.not.ok;
      expect(string('b', null)).to.be.not.ok;
    });
    it('is correct for alphabeta order', function() {
      expect(string('a', 'b')).to.be.ok;
      expect(string('b', 'a')).to.be.not.ok;
    });
    it('is correct for capital letter as well', function() {
      expect(string('A', 'b')).to.be.ok;
      expect(string('B', 'a')).to.be.not.ok;
    })
  });
  describe('#number', function() {
    it('anything being successor of null', function() {
      expect(number(null, 0)).to.be.ok;
      expect(number(null, null)).to.be.ok;
      expect(number(null, 1)).to.be.ok;
      expect(number(null, -1)).to.be.ok;
    });
    it('nothing is predecessor of null', function() {
      expect(number(0, null)).to.be.not.ok;
      expect(number(1, null)).to.be.not.ok;
      expect(number(-1, null)).to.be.not.ok;
    });
    it('is correct for natural order', function() {
      expect(number(1, 2)).to.be.ok;
      expect(number(1, 0)).to.be.not.ok;
    });
    it('is correct for string as well', function() {
      expect(number('1', '2')).to.be.ok;
      expect(number(1, '0')).to.be.not.ok;
    });
  });
  describe('#bitgroup', function() {
    it('anything being successor of null', function() {
      expect(bitgroup(null, 0)).to.be.ok;
      expect(bitgroup(null, null)).to.be.ok;
      expect(bitgroup(null, 1)).to.be.ok;
    });
    it('nothing is predecessor of null', function() {
      expect(bitgroup(0, null)).to.be.not.ok;
      expect(bitgroup(1, null)).to.be.not.ok;
    });
    it('is correct for bitgroup order', function() {
      expect(bitgroup(1, 1)).to.be.ok;
      expect(bitgroup(0, 0)).to.be.ok;
      expect(bitgroup(1, 0)).to.be.not.ok;
      expect(bitgroup(0, 1)).to.be.not.ok;
    });
    it('is correct for string as well', function() {
      expect(bitgroup('1', '1')).to.be.ok;
      expect(bitgroup(1, '0')).to.be.not.ok;
    });
  });
});

describe("LongestSubSequence", function() {
  const { longestSubsequence } = Subsequence;
  it('should throw when param is invalid', function() {
    expect(longestSubsequence).to.throw();
    expect(longestSubsequence.bind(longestSubsequence, '')).to.throw();
    expect(longestSubsequence.bind(longestSubsequence, [], '')).to.throw();
    expect(longestSubsequence.bind(longestSubsequence, [], 123)).to.throw();
  });
})

describe("LongestSubSequenceString", function() {
  const { longestSubsequenceString } = Subsequence;
  it('should return empty when with empty string', function() {
    expect(longestSubsequenceString('')).to.deep.equal({ length: 0, index: 0, value: '' });
  });
  it('should return one letter with 1 letter string', function() {
    expect(longestSubsequenceString('a')).to.deep.equal({ length: 1, index: 0, value: 'a' });
  });
  it('should return the whole string with alphabeta order', function() {
    expect(longestSubsequenceString('abcdef')).to.deep.equal({ length: 6, index: 0, value: 'abcdef' });
  });
  it('should return the first sequence if there are two sequence at same length', function() {
    expect(longestSubsequenceString('mopabc')).to.deep.equal({ length: 3, index: 0, value: 'mop' });
  });
  it('should return the longest sequence', function() {
    expect(longestSubsequenceString('nbwxzqdnrevkdn')).to.deep.equal({ length: 4, index: 1, value: 'bwxz' });
  });
  it('should return the longest sequence at the end of the sequence', function() {
    expect(longestSubsequenceString('nbwxzkdnopq')).to.deep.equal({ length: 5, index: 6, value: 'dnopq' });
  });
});

describe("LongestSubsequenceBitgroup", function() {
  const { longestSubsequenceBitgroup } = Subsequence;
  it('should return empty when with empty string', function() {
    expect(longestSubsequenceBitgroup('')).to.deep.equal({ length: 0, index: 0, value: '' });
  });
  it('should return one letter with 1 letter string', function() {
    expect(longestSubsequenceBitgroup('1')).to.deep.equal({ length: 1, index: 0, value: '1' });
  });
  it('should return the whole 1 bit string', function() {
    expect(longestSubsequenceBitgroup('000000')).to.deep.equal({ length: 6, index: 0, value: '000000' });
  });
  it('should return the first sequence if there are two sequence at same length', function() {
    expect(longestSubsequenceBitgroup('1111100000')).to.deep.equal({ length: 5, index: 0, value: '11111' });
  });
  it('should return the longest sequence', function() {
    expect(longestSubsequenceBitgroup('01100100001001')).to.deep.equal({ length: 4, index: 6, value: '0000' });
  });
  it('should return the longest sequence at the end of the sequence', function() {
    expect(longestSubsequenceBitgroup('011001010111')).to.deep.equal({ length: 3, index: 9, value: '111' });
  });
});

describe("LongestSubsequenceNumber", function() {
  const { longestSubsequenceNumber } = Subsequence;
  it('should return empty when with empty string', function() {
    expect(longestSubsequenceNumber('')).to.deep.equal({ length: 0, index: 0, value: '' });
  });
  it('should return one letter with 1 letter string', function() {
    expect(longestSubsequenceNumber('1')).to.deep.equal({ length: 1, index: 0, value: '1' });
  });
  it('should return the whole natural order', function() {
    expect(longestSubsequenceNumber('12345')).to.deep.equal({ length: 5, index: 0, value: '12345' });
  });
  it('should return the first sequence if there are two sequence at same length', function() {
    expect(longestSubsequenceNumber('789123')).to.deep.equal({ length: 3, index: 0, value: '789' });
  });
  it('should return the longest sequence', function() {
    expect(longestSubsequenceNumber('41342358198646')).to.deep.equal({ length: 4, index: 4, value: '2358' });
  });
  it('should return the longest sequence at the end of the sequence', function() {
    expect(longestSubsequenceNumber('41342358198646789')).to.deep.equal({ length: 5, index: 12, value: '46789' });
  });
  it('should return the longest sequence with numerical order (great or equal)', function() {
    expect(longestSubsequenceNumber('9112231123')).to.deep.equal({ length: 5, index: 1, value: '11223' });
  });
  it('should return the longest sequence with numerical order with leading zero', function() {
    expect(longestSubsequenceNumber('90112231123')).to.deep.equal({ length: 6, index: 1, value: '011223' });
  });
});