import { readPaginatedData } from './datareader'

const API = 'https://acc.api.data.amsterdam.nl/vsd'

/**
 * Get the HIOR items; text, description
 * @returns {Promise<Array>}
 */
export async function getItems () {
  return readPaginatedData(`${API}/hior_items`)
}

/**
 * Get the HIOR properties; item_id (reference to HIOR item), name (e.g. "Area"), value (e.g. "Centrum")
 * @returns {Promise<Array>}
 */
export async function getProperties () {
  return readPaginatedData(`${API}/hior_properties`)
}

/**
 * Get the HIOR attributes; item_id (reference to HIOR item), name (e.g. "Image"), value (e.g. "pic.jpg")
 * @returns {Promise<Array>}
 */
export async function getAttributes () {
  return readPaginatedData(`${API}/hior_attributes`)
}
