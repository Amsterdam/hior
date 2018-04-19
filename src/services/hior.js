import { readPaginatedData } from './datareader'

const API = 'https://acc.api.data.amsterdam.nl/vsd'

export async function getItems () {
  return readPaginatedData(`${API}/hior_items`)
}

export async function getProperties () {
  return readPaginatedData(`${API}/hior_properties`)
}
