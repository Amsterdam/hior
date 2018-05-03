<template>
  <div>
    <div class="form-group">
      <div class="row">
        <!--Show property filters-->
        <div v-for="propType in propertyTypes" :key="propType" class="col-6 mb-1">
          <label :for="propType" class="mb-1">
            {{propertyTypeName(propType)}}
          </label>
          <select class="form-control" :id="propType"
                  v-model="selected[propType]"
                  @change="propertyValueSelected(propType, selected[propType])">
            <option value="">Kies een {{propertyTypeName(propType)}}</option>
            <option :value="prop.value"  v-for="prop in propertyTypeValues(propType)" :key="prop.value" v-if="prop.count">
              {{prop.value}} ({{prop.count}})
            </option>
          </select>
        </div>

        <!--Show text filter-->
        <div class="col-6 mb-1">
          <label for="textFilter">
          Filter op tekst
        </label>
          <input v-model="textFilter"
               type="text"
               id="textFilter"
               class="form-control"
               placeholder="Filtertekst">
        </div>

        <!--Show a button to clear all filters-->
        <div class="col-12 text-center">
          <button type="button"
                  class="btn btn-primary mt-1"
                  @click="clear()">
            Wis filters
          </button>
        </div>
      </div>
    </div>

    <div v-if="matchedItems.length">
      <h2 id="top">Resultaten ({{matchedItems.length}})</h2>

      <div class="text-center">
        <button type="button" class="btn mr-1" v-for="propType in propertyTypes" :key="propType"
                @click="orderItemsBy(propType)" :class="{'btn-primary': orderBy === propType}">
          {{propertyTypeName(propType)}}
        </button>
      </div>

      <div class="text-center mt-3">
        <a v-for="prop in propertyTypeValues(orderBy)" :key="prop.value"
           v-if="prop.count > 0"
           :href="`#${prop.value}`"
           class="badge badge-pill mr-1">{{prop.value}} ({{prop.count}})</a>
      </div>

      <div v-for="prop in propertyTypeValues(orderBy)" :key="prop.value" v-if="prop.count > 0"
           :title="`${prop.value} (${prop.count})`" :collapse="true" class="mt-2">

        <a :id="prop.value"></a>
        <div class="alert alert-primary mt-3" role="alert">
          <div class="text-right">
            <div class="float-left">
              <div class="font-weight-bold mt-1">
                {{propertyTypeName(prop.name)}}: {{prop.value}} ({{prop.count}})
              </div>
            </div>
            <a class="btn btn-sm btn-primary top-link" href="#top">&#x25B2;</a>
          </div>
        </div>

        <!--Show each matched result in a Card, default collapsed only showing the item text-->
        <card v-for="item in itemValues(matchedItems, prop, prop.value)"
              :title="filteredText(item.htmlText, textFilter)" :subTitle="subTitle(item)" :key="item.text"
              :collapse="true">

          <!--The item description-->
          <div v-html="filteredText(item.htmlDescription, textFilter)"></div>

          <!--Images-->
          <div class="mt-2">
            <a v-for="img in item.Image" :key="img" :href="`${OBJECTSTORE_URL}Afbeeldingen/${img}`" target="_blank" :title="img">
              <img class="item-image mr-3" :src="`${OBJECTSTORE_URL}Afbeeldingen/${img}`"/>
            </a>
          </div>

          <!--The item properties-->
          <div class="mt-1 font-weight-bold">
            <table class="">
              <tbody>
              <tr v-for="propType in propertyTypes" :key="propType">
                <th scope="row">{{propertyTypeName(propType)}}</th>
                <td>
                  <div class="ml-2">
                    <a v-if="propType === 'Source' && !item.SourceLink[0].includes('(voormalig)')"
                       :href="`${OBJECTSTORE_URL}Documenten/${item.SourceLink[0]}.pdf`" target="_blank" :title="item[propType][0]">
                      {{item[propType][0]}}
                    </a>
                    <span v-else>{{item[propType].join(', ')}}</span>
                  </div>
                </td>
              </tr>
              <tr v-if="item.Link">
                <th scope="row" colspan="2">Zie ook:</th>
              </tr>
              <tr v-if="item.Link">
                <th colspan="2">
                  <div v-for="attr in item.Link" :key="attr">
                    <a :href="`${OBJECTSTORE_URL}Documenten/${attr}`" target="_blank" :title="attr">
                      {{attr}}
                    </a>
                  </div>
                </th>
              </tr>
              </tbody>
            </table>
          </div>
        </card>

      </div>
    </div>
    <div v-else>
      <h5>Geen resultaten gevonden</h5>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'

import { filteredText, toHTML } from '@/services/util'
import { OBJECTSTORE_URL } from '@/services/objectstore'
import Card from '../Layout/Card'

const PROPERTY_TYPE_NAMES = {
  'Area': 'Stadsdeel',
  'Type': 'Type',
  'Source': 'Bron',
  'Level': 'Niveau',
  'Theme': 'Thema'
}

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

function itemOrder (item) {
  return `${item.Theme[0]}.${LEVEL_ORDER[item.Level[0]]}.${TYPE_ORDER[item.Type[0]]}`
}

function propertyOrder (property) {
  const X = {
    'Level': () => LEVEL_ORDER[property.value],
    'Type': () => TYPE_ORDER[property.value],
    'Area': () => (property.value === 'Heel Amsterdam' ? 'A' : 'B') + property.value
  }
  return X[property.name] ? X[property.name]() : property.value
}

/**
 * autofilter timeout
 */
let autoFilter

/**
 * Abort any running timeout on filterItems()
 */
function abortFilter () {
  if (autoFilter) {
    clearTimeout(autoFilter)
  }
}

export default {
  name: 'Search',
  computed: {
    ...mapGetters([
      'items',
      'properties',
      'attributes'
    ])
  },
  components: {
    Card
  },
  data () {
    return {
      propertyTypes: [],
      selected: {},
      matchedItems: [],
      textFilter: '',
      orderBy: 'Theme',
      OBJECTSTORE_URL
    }
  },
  watch: {
    'items' (to, from) {
      this.init()
    },
    'attributes' (to, from) {
      this.init()
    },
    'properties' (to, from) {
      this.init()
    },
    'textFilter' () {
      abortFilter()
      autoFilter = setTimeout(() => this.filterItems(), 250)
    }
  },
  methods: {
    /**
     * Return the name for the propertyType, e.g. 'Stadsdeel' for property type 'Area'
     * @param propertyType
     * @returns {*}
     */
    propertyTypeName (propertyType) {
      return PROPERTY_TYPE_NAMES[propertyType]
    },

    /**
     * Return the unique values for the property type in the current filtered collection of items
     * The properties are enriched with a count, specifying how often the value appears
     * @param propertyType
     * @returns {*}
     */
    propertyTypeValues (propertyType) {
      let values = _.uniqBy(this.properties.filter(p => p.name === propertyType), 'value')
        .map(p => ({
          ...p,
          count: this.matchedItems.filter(i => i[p.name].includes(p.value)).length
        }))
      return _.orderBy(values, ['sortKey'], ['asc'])
    },

    subTitle (item) {
      return ['Theme', 'Level', 'Type'].map(propType => item[propType].join(', ')).join(' - ')
    },

    /**
     * Filter the items if a specific property value is selected, e.g. Stadsdeel = 'Centrum'
     * @param propertyType
     * @param value
     */
    propertyValueSelected (propertyType, value) {
      this.filterItems()
    },

    /**
     * Clear all filters, including stopping any outstanding filter requests
     */
    clear () {
      abortFilter()
      this.textFilter = ''
      this.propertyTypes.forEach(p => { this.selected[p] = '' })
      // Default stadsdeel is Heel Amsterdam
      this.selected['Area'] = this.propertyTypeValues('Area')[0].value
      this.filterItems()
    },

    /**
     * Filter the items on basis of the property filters and free text field
     * The free text field in interpreted as a regex. The try catch prevents
     * searching for non proper regex's, e.g. a[
     */
    filterItems () {
      let reTextFilter
      try {
        // Not every text is a valid re, e.g. "a["
        reTextFilter = new RegExp(this.textFilter, 'i')
      } catch (e) {
        return // Wait for better times...
      }
      this.matchedItems = this.items.filter(item =>
        // If a text filter is specified it must match either text of description
        (!this.textFilter || (reTextFilter.test(item.text) || reTextFilter.test(item.description))) &&
        this.propertyTypes.reduce((totalResult, prop) =>
          // if a filter on a property is specified it must match the corresponding item property
          totalResult && (!this.selected[prop] || item[prop].includes(this.selected[prop])),
        true))
      this.matchedItems = _.orderBy(this.matchedItems, ['sortKey'], ['asc'])
    },

    /**
     * Expose filteredText to allow formatting item text and description
     */
    filteredText,

    orderItemsBy (property) {
      this.orderBy = property
    },

    itemValues (items, property, value) {
      return items.filter(item => item[property.name].includes(value))
    },

    /**
     * Determine the property types and link items with properties
     */
    init () {
      if (this.items && this.properties && this.attributes) {
        this.propertyTypes = _.uniq(this.properties.map(p => p.name))
        this.items.forEach(item => {
          ['properties', 'attributes'].forEach(coll => {
            this[coll].filter(el => el.item_id === item.id)
              .forEach(el => { item[el.name] = [] })
            this[coll].filter(el => el.item_id === item.id)
              .forEach(el => { item[el.name].push(el.value) })
          })

          item.htmlText = toHTML(item.text)
          item.htmlDescription = toHTML(item.description)
          item.sortKey = itemOrder(item)
        })
        this.properties.forEach(prop => { prop.sortKey = propertyOrder(prop) })
        this.clear()
      }
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style scoped>
.top-link {
  text-decoration: none;
}
.item-image {
  max-width: 250px;
}
/*Firefox hacks for select*/
select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: url(dropdown.png) right / 20px no-repeat #fff;
  padding-right: 20px;
}
select:-moz-focusring {
  color: transparent;
  text-shadow: 0 0 0 #000;
}
option:not(:checked) {
  color: black; /* prevent <option>s from becoming transparent as well */
}
</style>
