/**
 * The API base addresses to use in the application
 * @type {{LOC: string, ACC: string, PRD: string}}
 */
export const API = {
  LOC: 'localhost:8000',
  ACC: 'https://acc.api.data.amsterdam.nl',
  PRD: 'https://api.data.amsterdam.nl'
}

/**
 * Takes the current location (window.location) and returns the appropriate API base address
 * Can be used like `${getAPIBaseUrl()}/vsd/hior_items`
 * @returns {string}
 */
export const getAPIBaseUrl = () => {
  const host = window.location.host
  if (/^acc\./.test(host)) {
    return API.ACC
  } else if (/^localhost/.test(host)) {
    // API.LOC can be used here to allow using a locally server API
    return API.ACC
  } else {
    return API.PRD
  }
}
