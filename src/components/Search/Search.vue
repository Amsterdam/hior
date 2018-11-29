<template>
  <div>
    <div class="form-group">
      <div class="row">
        <!--Show property filters-->
        <div v-for="propType in propertyTypes" :key="propType" class="col-6 mb-1">
          <label :for="propType" class="mb-1">
            {{propertyTypeDescription(propType)}}
          </label>
          <v-select multiple :id="propType"
                    v-model="selected[propType]"
                    :placeholder="`Kies een ${propertyTypeName(propType)}`"
                    label="value"
                    @input="propertyValueSelected(propType, selected[propType])"
                    :options="propertyTypeValues(propType)">
            <template slot="option" slot-scope="option">
              <div :title="propertyValueTooltipText(option.value)">
                {{ `${option.value} (${option.possibleCount})`}}
              </div>
            </template>
          </v-select>
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
import { propertyTypeName, propertyTypeDescription, itemOrder, propertyOrder, linkItems, filterItems } from '@/services/hior'
import SearchResult from './SearchResult'
import ResultsHeader from './ResultsHeader'
import SearchSort from './SearchSort'

import tooltipTexts from '../../../static/texts/tooltipTexts'

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
      this.storeSearchStateInQueryParams()
    }
  },
  methods: {
    /**
     * Get all property types that have not been selected
     * OrderBy is changed as a side effect to be set to a visible property type
     */
    unselectedPropertyTypes () {
      const result = this.propertyTypes.filter(propType => !this.selected[propType].length)
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
     * Return the description for the propertyType
     * @param propertyType
     * @returns {*}
     */
    propertyTypeDescription (propertyType) {
      return propertyTypeDescription([propertyType])
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
              { ...this.selected, [propertyType]: [] }, this.textFilter).length
            : count
          return {
            ...property,
            count,
            possibleCount
          }
        })
      return _.orderBy(values.filter(v => v.possibleCount), ['sortKey'], ['asc'])
    },

    /**
     * Return the tooltip text for the property value
     * @param propertyValue
     */
    propertyValueTooltipText (propertyValue) {
      return tooltipTexts[propertyValue]
    },

    /**
     * Filter the items if a specific property value is selected, e.g. Stadsdeel = 'Centrum'
     * @param propertyType
     * @param value
     */
    propertyValueSelected (propertyType, value) {
      this.storeSearchStateInQueryParams()
      this.filterItems()
    },

    /**
     * Store the current search filters, orderBy and textFilter in the URL as queryParams
     */
    storeSearchStateInQueryParams () {
      const queryParams = {
        Source: this.selected.Source.map((option) => option.value),
        Level: this.selected.Level.map((option) => option.value),
        Type: this.selected.Type.map((option) => option.value),
        Theme: this.selected.Theme.map((option) => option.value),
        Area: this.selected.Area.map((option) => option.value),
        orderBy: this.orderBy,
        textFilter: this.textFilter ? this.textFilter : undefined
      }

      this.$router.push({query: queryParams})
    },

    /**
     * Restore the filters, orderBy and textFilter from supplied query parameters
     * @param queryParams
     */
    restoreSearchStateFromQueryParams (queryParams) {
      // reset the 'Heel Amsterdam' Area filter default if queryparams are supplied
      if (Object.keys(queryParams).length > 0) {
        this.selected['Area'] = []
      }
      Object.keys(this.selected).forEach((propertyType) => {
        if (queryParams[propertyType] !== undefined) {
          this.selected[propertyType] = this.propertyTypeValues(propertyType).filter(props => queryParams[propertyType].includes(props.value))
        }
      })
      if (queryParams.orderBy) {
        this.orderItemsBy(queryParams.orderBy)
      }
      this.textFilter = queryParams.textFilter
    },

    /**
     * Clear all filters, including stopping any outstanding filter requests
     */
    clear () {
      abortFilter()
      this.textFilter = ''
      this.propertyTypes.forEach(p => { this.selected[p] = [] })
      this.selected['Area'] = [this.propertyTypeValues('Area')[0]] // Default stadsdeel is Heel Amsterdam
      this.filterItems()
    },

    /**
     * Filter the items on basis of the property filters and free text field
     * The free text field in interpreted as a regex. The try catch prevents
     * searching for non proper regex's, e.g. a[
     */
    filterItems () {
      const matchedItems = filterItems(this.items, this.selected, this.textFilter)
      this.matchedItems = _.orderBy(matchedItems, this.orderBy === 'Theme' ? ['themeSortKey'] : ['sortKey'], ['asc'])
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
      this.filterItems()
      this.storeSearchStateInQueryParams()
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
          item.themeSortKey = item.sortKey.substring(3)
        })
        this.clear()
      }
    }
  },
  mounted () {
    this.init()
    this.restoreSearchStateFromQueryParams(this.$route.query)
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
