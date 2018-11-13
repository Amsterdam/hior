/**
 * Replaces each occurrence of filterText (case-insensitive) in text by a span with class "filterText".
 * Class filterText specifies how the filtered text should be formatted (e.g. color: "red") and is defined elsewhere
 * @param text
 * @param filterText
 * @returns {*}
 */
export const filteredText = (text, filterText) => {
  // $& Inserts the matched substring
  return filterText ? text.replace(RegExp(filterText, 'ig'), `<span class="filterText">$&</span>`) : text
}

export const toHTML = text => {
  return text
    .replace(/(http[s]?:\/\/[^\s]+)/gi, '<a href="$1" target="_blank">$1</a>') // Convert hyperlinks
    .replace(/\n/g, '<br>') // simply translate line breaks
}
