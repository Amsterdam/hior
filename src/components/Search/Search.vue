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
            <option :value="prop.value"  v-for="prop in propertyTypeValues(propType)" :key="prop.value"
                    v-if="prop.possibleCount">
              {{prop.value}} ({{prop.possibleCount}})
            </option>
          </select>
        </div>

        <!--Show text filter-->
        <div class="col-6 mb-1">
          <label for="textFilter" class="mb-1">
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
      <h2>Resultaten ({{matchedItems.length}})</h2>

      <search-sort :propertyTypes="unselectedPropertyTypes()" :propertyTypeValues="propertyTypeValues"
                   :orderBy="orderBy" :orderItemsBy="orderItemsBy">
      </search-sort>

      <div v-for="prop in propertyTypeValues(orderBy)" :key="prop.value" v-if="prop.count > 0"
           :title="`${prop.value} (${prop.count})`" :collapse="true" class="mt-2">

        <a :id="prop.value"></a>
        <results-header :prop="prop"></results-header>

        <search-result v-for="(item, i) in itemValues(matchedItems, prop, prop.value)" :key="i"
                       :item="item" :textFilter="textFilter" :propertyTypes="propertyTypes">
        </search-result>
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
import Card from '../Layout/Card'
import { propertyTypeName, itemOrder, propertyOrder, linkItems, filterItems } from '@/services/hior'
import SearchResult from './SearchResult'
import ResultsHeader from './ResultsHeader'
import SearchSort from './SearchSort'

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
    SearchSort,
    ResultsHeader,
    SearchResult,
    Card
  },
  data () {
    return {
      propertyTypes: [],
      selected: {},
      matchedItems: [],
      textFilter: '',
      orderBy: 'Theme'
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
     * Get all property types that have not been selected
     * OrderBy is changed as a side effect to be set to a visible property type
     */
    unselectedPropertyTypes () {
      const result = this.propertyTypes.filter(propType => !this.selected[propType])
      const orderBy = result.indexOf(this.orderBy) === -1 ? result[0] : this.orderBy
      this.orderBy = orderBy || this.orderBy // If all has been selected; default to last valid orderBy
      return result
    },

    /**
     * Return the name for the propertyType, e.g. 'Stadsdeel' for property type 'Area'
     * @param propertyType
     * @returns {*}
     */
    propertyTypeName (propertyType) {
      return propertyTypeName([propertyType])
    },

    /**
     * Return the unique values for the property type in the current filtered collection of items
     * The properties are enriched with a count, specifying how often the value appears
     * @param propertyType
     * @returns {*}
     */
    propertyTypeValues (propertyType) {
      let values = _.uniqBy(this.properties.filter(p => p.name === propertyType), 'value')
        .map(property => {
          // For each property value compute the #items with the specific value
          const count = this.matchedItems.filter(i => i[property.name].includes(property.value)).length
          const possibleCount = this.selected[propertyType]
            // If a selection is already made on this propertyType, determine the count as if nothing has been selected
            ? filterItems(this.items.filter(i => i[property.name].includes(property.value)),
              { ...this.selected, [propertyType]: undefined }, this.textFilter).length
            : count
          return {
            ...property,
            count,
            possibleCount
          }
        })
      return _.orderBy(values, ['sortKey'], ['asc'])
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
      this.selected['Area'] = this.propertyTypeValues('Area')[0].value // Default stadsdeel is Heel Amsterdam
      this.filterItems()
    },

    /**
     * Filter the items on basis of the property filters and free text field
     * The free text field in interpreted as a regex. The try catch prevents
     * searching for non proper regex's, e.g. a[
     */
    filterItems () {
      const matchedItems = filterItems(this.items, this.selected, this.textFilter)
      this.matchedItems = _.orderBy(matchedItems, ['sortKey'], ['asc'])
    },

    /**
     * Expose filteredText to allow formatting item text and description
     */
    filteredText,

    /**
     * Specify the sort order of the items
     */
    orderItemsBy (property) {
      this.orderBy = property
    },

    /**
     * Get all items that have a property with the requested value
     * Note that properties are stored in the item as arrays of values
     */
    itemValues (items, property, value) {
      return items.filter(item => item[property.name].includes(value))
    },

    /**
     * Determine the property types and link items with properties
     */
    init () {
      if (this.items && this.properties && this.attributes) {
        // Provide for filter functionality for each property
        this.propertyTypes = _.uniq(this.properties.map(p => p.name))
        // Sort properties on their order (eg Randvoorwaarde comes before Advies
        this.properties.forEach(prop => { prop.sortKey = propertyOrder(prop) })
        // Link the items with the corresponding properties and attributes
        linkItems(this.items, this.properties, this.attributes)
        this.items.forEach(item => {
          item.htmlText = toHTML(item.text)
          item.htmlDescription = toHTML(item.description)
          item.sortKey = itemOrder(item)
        })
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
