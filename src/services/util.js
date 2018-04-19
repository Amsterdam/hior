export const filteredText = (text, filterText) => {
  // $& Inserts the matched substring
  return filterText ? text.replace(RegExp(filterText, 'ig'), `<span class="filterText">$&</span>`) : text
}
