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
    expect(propertyOrder({name: 'Level', value: 'Proces'})).toEqual(4)
    expect(propertyOrder({name: 'Level', value: 'other'})).toEqual(9)

    expect(propertyOrder({name: 'Type', value: 'Randvoorwaarde'})).toEqual(1)
    expect(propertyOrder({name: 'Type', value: 'Advies'})).toEqual(4)
    expect(propertyOrder({name: 'Type', value: 'other'})).toEqual(9)

    expect(propertyOrder({name: 'Area', value: 'Heel Amsterdam'})).toEqual('0Heel Amsterdam')
    expect(propertyOrder({name: 'Area', value: 'A'})).toEqual('1A')
  })

  it('can rank items', () => {
    const items = [
      {Theme: ['A'], Level: ['Proces'], Type: ['Ambitie']},
      {Theme: ['B'], Level: ['Strategisch Niveau'], Type: ['Randvoorwaarde']},
      {Theme: ['A'], Level: ['other'], Type: ['other']}
    ]
    expect(itemOrder(items[0])).toEqual('A.4.3')
    expect(itemOrder(items[1])).toEqual('B.1.1')
    expect(itemOrder(items[2])).toEqual('A.9.9')
    expect(itemOrder(items[0]) < itemOrder(items[1])).toEqual(true)
    expect(itemOrder(items[0]) < itemOrder(items[2])).toEqual(true)
    expect(itemOrder(items[1]) > itemOrder(items[2])).toEqual(true)
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
