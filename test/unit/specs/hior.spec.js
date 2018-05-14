import _ from 'lodash'
import { linkItems, propertyOrder, itemOrder, filterItems } from '@/services/hior'

describe('hior', () => {
  it('links items with attributes and properties', () => {
    const items = [
      { id: 1 },
      { id: 2 },
      { id: 3 }
    ]
    expect(linkItems(_.cloneDeep(items), [], [])).toEqual(items)
    expect(linkItems(_.cloneDeep(items), [ { item_id: 1, name: 'x', value: 1 } ], [])).toEqual([
      { id: 1,
        x: [1]
      },
      { id: 2 },
      { id: 3 }
    ])
    expect(linkItems(_.cloneDeep(items), [ { item_id: 0, name: 'x', value: 1 } ], [])).toEqual(items)
    expect(linkItems(_.cloneDeep(items), [], [ { item_id: 1, name: 'x', value: 1 } ])).toEqual([
      { id: 1,
        x: [1]
      },
      { id: 2 },
      { id: 3 }
    ])
    expect(linkItems(_.cloneDeep(items), [ { item_id: 2, name: 'y', value: 'aap' } ], [ { item_id: 1, name: 'x', value: 1 } ])).toEqual([
      { id: 1,
        x: [1]
      },
      { id: 2,
        y: ['aap']
      },
      { id: 3 }
    ])
    expect(linkItems(_.cloneDeep(items),
      [ { item_id: 2, name: 'y', value: 'aap' } ],
      [ { item_id: 1, name: 'x', value: 1 }, { item_id: 3, name: 'z', value: 'noot' } ])).toEqual([
      { id: 1,
        x: [1]
      },
      { id: 2,
        y: ['aap']
      },
      { id: 3,
        z: ['noot']
      }
    ])
    expect(linkItems(_.cloneDeep(items),
      [ { item_id: 1, name: 'x', value: 1 } ],
      [ { item_id: 1, name: 'x', value: 2 } ])).toEqual([
      { id: 1,
        x: [1, 2]
      },
      { id: 2 },
      { id: 3 }
    ])
  })

  it('can rank properties', () => {
    expect(propertyOrder({name: 'Level', value: 'Strategisch Niveau'})).toEqual(1)

    expect(propertyOrder({name: 'Level', values: ['Strategisch Niveau']})).toEqual(1)
    expect(propertyOrder({name: 'Level', values: ['Proces']})).toEqual(4)
    expect(propertyOrder({name: 'Level', values: ['Proces', 'Strategisch Niveau']})).toEqual(1)
    expect(propertyOrder({name: 'Level', values: ['Strategisch Niveau', 'Proces']})).toEqual(1)
    expect(propertyOrder({name: 'Level', values: ['other']})).toEqual(9)

    expect(propertyOrder({name: 'Type', values: ['Randvoorwaarde']})).toEqual(1)
    expect(propertyOrder({name: 'Type', values: ['Advies']})).toEqual(4)
    expect(propertyOrder({name: 'Type', values: ['other']})).toEqual(9)

    expect(propertyOrder({name: 'Area', values: ['Heel Amsterdam']})).toEqual('0Heel Amsterdam')
    expect(propertyOrder({name: 'Area', values: ['A']})).toEqual('1A')
    expect(propertyOrder({name: 'Area', values: ['Heel Amsterdam', 'A']})).toEqual('0Heel Amsterdam')
    expect(propertyOrder({name: 'Area', values: ['A', 'Heel Amsterdam', 'B']})).toEqual('0Heel Amsterdam')
  })

  it('can rank items', () => {
    const items = [
      {id: 1, Theme: ['1. A'], Level: ['Proces'], Type: ['Ambitie']},
      {id: 2, Theme: ['2. B'], Level: ['Strategisch Niveau'], Type: ['Randvoorwaarde']},
      {id: 33, Theme: ['1. A'], Level: ['other'], Type: ['other']},
      {id: 34, Theme: ['1. A'], Level: ['other'], Type: ['other']}
    ]
    expect(itemOrder(items[0])).toEqual('01.4.3.000001')
    expect(itemOrder(items[1])).toEqual('02.1.1.000002')
    expect(itemOrder(items[2])).toEqual('01.9.9.000033')
    expect(itemOrder(items[3])).toEqual('01.9.9.000034')
    expect(itemOrder(items[0]) < itemOrder(items[1])).toEqual(true)
    expect(itemOrder(items[0]) < itemOrder(items[2])).toEqual(true)
    expect(itemOrder(items[1]) > itemOrder(items[2])).toEqual(true)
    expect(itemOrder(items[2]) < itemOrder(items[3])).toEqual(true)
  })

  it('can filter items on properties and free text', () => {
    const items = [
      {text: 'some text', description: 'anything else', Theme: ['A'], Level: ['Proces'], Type: ['Ambitie']},
      {text: 'some text', description: 'anything else', Theme: ['B'], Level: ['Strategisch Niveau'], Type: ['Randvoorwaarde']},
      {text: 'some text', description: 'anything else.', Theme: ['A'], Level: ['other'], Type: ['other']}
    ]
    expect(filterItems(items, {}, '')).toEqual(items)
    expect(filterItems(items, {Level: 'Proces'}, '')).toEqual([items[0]])
    expect(filterItems(items, {Level: 'Proces'}, 'some')).toEqual([items[0]])
    expect(filterItems(items, {Level: 'Proces'}, 'anything else')).toEqual([items[0]])
    expect(filterItems(items, {}, 'anything else.')).toEqual([items[2]])
    expect(filterItems(items, {}, 'anything else')).toEqual(items)
    expect(filterItems(items, {}, 'anything else$')).toEqual([items[0], items[1]])
    expect(filterItems(items, {Type: 'Ambitie', Level: 'Proces', Theme: 'A'}, 'some text')).toEqual([items[0]])
    expect(filterItems(items, {XYZ: 'abc'}, '')).toEqual([])
  })
})
