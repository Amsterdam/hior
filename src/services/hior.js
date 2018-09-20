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

/**
 * Provide for the local (dutch) name of the propertyType, e.g. "Source" => "Bron"
 * @param propertyType
 * @returns {*}
 */
export function propertyTypeName (propertyType) {
  return {
    'Area': 'Stadsdeel',
    'Type': 'Type',
    'Source': 'Bron',
    'Level': 'Niveau',
    'Theme': 'Thema'
  }[propertyType]
}

/**
 * Provide for the local (dutch) description of the propertyType
 * Default behaviour is to return the name
 * @param propertyType
 * @returns {*}
 */
export function propertyTypeDescription (propertyType) {
  return {
    'Area': 'Algemeen beleid (Heel Amsterdam) of aanvullend beleid per stadsdeel?'
  }[propertyType] || propertyTypeName(propertyType)
}

/**
 * Utility method to convert a number to a leftpadded string of length n
 * @param n
 * @param length
 * @returns {string}
 */
const numToString = (n, length) => n.toString().padStart(length, '0')

/**
 * Properties can be ordered.
 * Property levels are ordered from 1 to 4, as are property types
 * Property themes are ordered on their own number, e.g "1. xyz" => "01"
 * Property areas are ordered on 1. heel Amsterdam and the other areas alphabetically
 * When ordering properties arrays, the minimum property of the values in the array are returned,
 * e.g. level = ['Proces', 'Tactisch Niveau'] will return 2
 * @param property
 * @returns {*}
 */
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

  /**
   * Returns the order of the nth value of the property
   * @param valueIndex
   * @returns {*}
   */
  const getOrder = value => {
    const ORDER = {
      'Level': () => LEVEL_ORDER[value] || 9,
      'Type': () => TYPE_ORDER[value] || 9,
      'Area': () => (value === 'Heel Amsterdam' ? '0' : '1') + value,
      'Theme': () => numToString(Number(value.match(/^(\d+)/)[0]), 2)
    }
    return ORDER[property.name] ? ORDER[property.name]() : value
  }

  /**
   * Returns the minimum order of the values for the given property
   */
  const values = property.values || [property.value]
  return values.reduce((minOrder, value) => {
    const propertyOrder = getOrder(value)
    return (minOrder === null || propertyOrder < minOrder) ? propertyOrder : minOrder
  }, null)
}

/**
 * Items are ordered on 1. Theme, 2. Level, 3. Type, 4. ordering in source
 * @param item
 * @returns {string}
 */
export function itemOrder (item) {
  const orderOf = (name) => propertyOrder({name, values: item[name]})
  return `${orderOf('Theme')}.${orderOf('Level')}.${orderOf('Type')}.${numToString(item.id, 6)}`
}

/**
 * Filter items on a number of selected properties (e.g. Type = 'Uitgangspunt') and an optional textfiler (e.g. 'Fiets')
 * The returning set of items contains all items that have the selected properties and that contain text that matches the textfilter
 * @param items
 * @param selectedProperties
 * @param textFilter
 * @returns {*}
 */
export function filterItems (items, selectedProperties, textFilter) {
  let reTextFilter
  try {
    // Not every text is a valid re, e.g. "a["
    reTextFilter = new RegExp(textFilter, 'i')
  } catch (e) {
    return items // Wait for better times...
  }
  const properties = Object.keys(selectedProperties).filter(key => (selectedProperties[key] || []).length)
  const values = properties.reduce((o, p) => ({...o, [p]: selectedProperties[p].map(p => p.value)}), {})
  const matchedItems = items.filter(item =>
    // If a text filter is specified it must match either text of description
    (!textFilter || (reTextFilter.test(item.text) || reTextFilter.test(item.description))) &&
    properties.reduce((totalResult, prop) =>
      // if a filter on a property is specified it must match the corresponding item property
      totalResult && _.intersection((item[prop] || []), values[prop]).length,
      // totalResult && ((item[prop] || []).includes(selectedProperties[prop][0])),
    true))
  return matchedItems
}
