const ordinal = (i) => {
    const j = i % 10;
    const k = i % 100;
  
    if (j === 1 && k !== 11) {
      return i + 'st';
    }
  
    if (j === 2 && k !== 12) {
      return i + 'nd';
    }
  
    if (j === 3 && k !== 13) {
      return i + 'rd';
    }
  
    return i + 'th';
  };
  
  const humanize = (str) => {
    return str
      .replace(/^[\s_]+|[\s_]+$/g, '')
      .replace(/[_\s]+/g, ' ')
      .replace(/^[a-z]/, function (m) {
        return m.toUpperCase();
      });
  };
  
  const isEmpty = (value) => value === '' || !value;
  
  const fuzzyMatchSimple = (pattern, text) => {
    // remove spaces, lower case the search so the search is case insensitive
    let search = text.replace(/\ /g, '').toLowerCase();
    let tokens = [];
    let search_position = 0;
  
    // Go through each character in the text
    for (let n = 0; n < pattern.length; n++) {
      let text_char = pattern[n];
      // if we match a character in the search, highlight it
      if (search_position < search.length && text_char.toLowerCase() == search[search_position]) {
        text_char = '<b>' + text_char + '</b>';
        search_position += 1;
      }
      tokens.push(text_char);
    }
    // If are characters remaining in the search text, return an empty string to indicate no match
    if (search_position != search.length) {
      return '';
    }
    return tokens.join('');
  };
  
  const appendColums = {
    'aggregate-all': 'aggregate_all_ever',
    'first-between': 'first_in_between',
    'last-between': 'last_in_between',
    'first-before': 'first_before',
    'last-before': 'last_before',
    'first-ever': 'first_ever',
    'last-ever': 'last_ever',
  }
  
  export { ordinal, humanize, isEmpty, fuzzyMatchSimple, appendColums };
  