const API = {
  LOC: 'localhost:8000',
  ACC: 'https://acc.api.data.amsterdam.nl',
  PRD: 'https://api.data.amsterdam.nl'
}

export const getAPIBaseUrl = () => {
  const host = window.location.host
  if (/^acc\./.test(host)) {
    return API.ACC
  } else if (/^localhost/.test(host)) {
    return API.ACC
  } else {
    return API.PRD
  }
}
