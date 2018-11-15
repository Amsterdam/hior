/**
 * Replaces each occurrence of filterText (case-insensitive) in text by a span with class "filterText",
 * except when the matched word starts with 'href=' to prevent broken hyperlinks.
 * Class filterText specifies how the filtered text should be formatted (e.g. color: "red") and is defined elsewhere
 * @param text
 * @param filterText
 * @returns {*}
 */
export const filteredText = (text, filterText) => {
  const addSpan = (match, p1) => {
    if (p1 && p1.startsWith('href=')) {
      return match
    }
    return `<span class="filterText">${match}</span>`
  }
  return filterText ? text.replace(RegExp(`(href=[\\S]*)|(${filterText})`, 'ig'), addSpan) : text
}

export const toHTML = text => {
  return text
    .replace(/(http[s]?:\/\/[^\s]+)/gi, '<a href="$1" target="_blank">$1</a>') // Convert hyperlinks
    .replace(/\n/g, '<br>') // simply translate line breaks
}
