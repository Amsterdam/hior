import _ from 'lodash'

import { readPaginatedData } from './datareader'
import { getAPIBaseUrl } from './environment'

const API = getAPIBaseUrl() + '/vsd'

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

/**
 * Get the FAQ; question, answer
 * @returns {Promise<Array>}
 */
export async function getFAQ () {
  return readPaginatedData(`${API}/hior_faq`)
}

/**
 * Link HIOR items with its properties and attributes
 * Each of these gets an property of the HIOR item
 * @param items
 */
export function linkItems (items, properties, attributes) {
  const collection = _.concat(properties, attributes)
  items.forEach(item => {
    // Get the properties for this item
    const itemProperties = collection.filter(el => el.item_id === item.id)
    // Create empty arrays for each distinct property
    _.uniq(itemProperties.map(prop => prop.name)).forEach(propName => { item[propName] = [] })
    // Add each property value as a value to the array
    itemProperties.forEach(prop => item[prop.name].push(prop.value))
  })
  return items
}

export function propertyTypeName (propertyType) {
  return {
    'Area': 'Stadsdeel',
    'Type': 'Type',
    'Source': 'Bron',
    'Level': 'Niveau',
    'Theme': 'Thema'
  }[propertyType]
}

export function propertyOrder (property) {
  const LEVEL_ORDER = {
    'Strategisch Niveau': 1,
    'Tactisch Niveau': 2,
    'Operationeel Niveau': 3,
    'Proces': 4
  }

  const TYPE_ORDER = {
    'Randvoorwaarde': 1,
    'Uitgangspunt': 2,
    'Ambitie': 3,
    'Advies': 4
  }

  const getOrder = {
    'Level': () => LEVEL_ORDER[property.value] || 9,
    'Type': () => TYPE_ORDER[property.value] || 9,
    'Area': () => (property.value === 'Heel Amsterdam' ? '0' : '1') + property.value
  }

  return getOrder[property.name] ? getOrder[property.name]() : property.value
}

export function itemOrder (item) {
  const orderOf = (name) => propertyOrder({name, value: item[name][0]})
  return `${item.Theme[0]}.${orderOf('Level')}.${orderOf('Type')}`
}

export function filterItems (items, selectedProperties, textFilter) {
  let reTextFilter
  try {
    // Not every text is a valid re, e.g. "a["
    reTextFilter = new RegExp(textFilter, 'i')
  } catch (e) {
    return items // Wait for better times...
  }
  const properties = Object.keys(selectedProperties).filter(key => selectedProperties[key])
  const matchedItems = items.filter(item =>
    // If a text filter is specified it must match either text of description
    (!textFilter || (reTextFilter.test(item.text) || reTextFilter.test(item.description))) &&
    properties.reduce((totalResult, prop) =>
      // if a filter on a property is specified it must match the corresponding item property
      totalResult && ((item[prop] || []).includes(selectedProperties[prop])),
    true))
  return matchedItems
}
