<template>
  <div>
    <div class="form-group">
      <div class="row">
        <div v-for="propType in propertyTypes" :key="propType" class="col-6 mb-1">
          <label :for="propType">
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

      <card v-for="item in matchedItems" :title="filteredText(item.text, textFilter)" :key="item.text" :collapse="true">
        <div v-html="filteredText(item.description, textFilter)"></div>
        <div class="mt-1 font-weight-bold">
          <table class="">
            <tbody>
            <tr v-for="propType in propertyTypes" :key="propType">
              <th scope="row">{{propertyTypeName(propType)}}</th>
              <td>
                <span class="ml-2">{{item[propType]}}</span>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </card>
    </div>
    <div v-else>
      <h5>Geen resultaten gevonden</h5>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'

import Card from '../Layout/Card'
import { filteredText } from '../../services/util'

const PROPERTY_TYPE_NAMES = {
  'Area': 'Stadsdeel',
  'Type': 'Type',
  'Source': 'Bron',
  'Level': 'Niveau',
  'Theme': 'Thema'
}

/**
 * autofilter timeout
 */
let autoFilter

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
      'properties'
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
      textFilter: ''
    }
  },
  watch: {
    'items' (to, from) {
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
    propertyTypeName (propertyType) {
      return PROPERTY_TYPE_NAMES[propertyType]
    },

    propertyTypeValues (propertyType) {
      return _.uniqBy(this.properties.filter(p => p.name === propertyType), 'value')
        .map(p => ({
          ...p,
          count: this.matchedItems.filter(i => i[p.name] === p.value).length
        }))
    },

    propertyValueSelected (propertyType, value) {
      this.filterItems()
    },

    clear () {
      abortFilter()
      this.textFilter = ''
      this.propertyTypes.forEach(p => { this.selected[p] = '' })
      this.filterItems()
    },

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
          totalResult && (!this.selected[prop] || this.selected[prop] === item[prop]),
        true))
    },

    filteredText,

    init () {
      if (this.items && this.properties) {
        this.propertyTypes = _.uniq(this.properties.map(p => p.name))
        this.items.forEach(item => {
          this.properties.filter(prop => prop.item_id === item.id)
            .forEach(prop => { item[prop.name] = prop.value }) // add property attributes to item
          const toHtml = text => text.replace(/\n/g, '<br>') // simply translate line breaks
          item.text = toHtml(item.text)
          item.description = toHtml(item.description)
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
