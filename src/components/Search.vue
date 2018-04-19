<template>
  <div v-if="items && properties">
    <div class="form-group">
      <div class="row">
        <div v-for="propType in allPropertyTypes" :key="propType" class="col-6 mb-1">
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
          <input v-model="filterText"
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

    <h2>Resultaten ({{matchedItems.length}})</h2>

    <card v-for="item in matchedItems" :title="item.reText || item.text" :key="item.text" :collapse="true">
      <div v-html="item.reDescription || item.description"></div>
      <!--<p>{{toHex(item.description)}}</p>-->
      <div class="mt-1 font-weight-bold">
        <table class="">
          <tbody>
          <tr v-for="propType in allPropertyTypes" :key="propType">
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
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'

import card from './Layout/Card'
import { filteredText } from '../services/util'

// function toHex (str) {
//   var arr1 = []
//   for (let n = 0, l = str.length; n < l; n++) {
//     let i = Number(str.charCodeAt(n))
//     if (i < 32 || i > 128) {
//       var hex = str.charAt(n) + '=' + i.toString() + '\n'
//       arr1.push(hex)
//     }
//   }
//   return arr1.join('-')
// }

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

export default {
  name: 'Search',
  computed: {
    ...mapGetters([
      'items',
      'properties'
    ])
  },
  components: {
    'card': card
  },
  data () {
    return {
      allPropertyTypes: [],
      selected: {},
      matchedItems: [],
      filterText: null
    }
  },
  watch: {
    'items' (to, from) {
      this.init()
    },
    'properties' (to, from) {
      this.init()
    },
    'filterText' () {
      if (autoFilter) {
        clearTimeout(autoFilter)
      }
      autoFilter = setTimeout(() => this.filterItems(), 250)
    }
  },
  methods: {
    propertyTypeName (propertyType) {
      return PROPERTY_TYPE_NAMES[propertyType]
    },
    propertyTypeValues (propertyType) {
      const props = _.uniqBy(this.properties.filter(p => p.name === propertyType), 'value')
      props.forEach(p => { p.count = this.propertyValues(p) })
      return props
    },
    propertyValues (property) {
      return this.matchedItems.filter(i => i[property.name] === property.value).length
    },
    propertyValueSelected (propertyType, value) {
      console.log('Selected', propertyType, value)
      this.filterItems()
    },
    clear () {
      this.filterText = null
      Object.keys(this.selected).forEach(key => { this.selected[key] = '' })
    },
    filterItems () {
      const reTextFilter = new RegExp(this.filterText, 'i')
      this.matchedItems = this.items.filter(item => {
        if (this.filterText) {
          if (!(reTextFilter.test(item.text) || reTextFilter.test(item.description))) {
            return false
          }
          item.reText = filteredText(item.text, this.filterText)
          item.reDescription = filteredText(item.description, this.filterText)
        } else {
          item.reText = null
          item.reDescription = null
        }
        const properties = item.properties
        return properties.reduce((match, prop) => match && (!this.selected[prop.name] || this.selected[prop.name] === prop.value), true)
      })
    },
    init () {
      if (this.items && this.properties) {
        this.allPropertyTypes = _.uniq(this.properties.map(p => p.name))
        this.allPropertyTypes.forEach(p => { this.selected[p] = '' })
        this.items.forEach(item => {
          item.properties = this.properties
            .filter(prop => prop.item_id === item.id)
          item.properties.forEach(prop => { item[prop.name] = prop.value })
          item.text = item.text.replace(/\n/g, '<br>')
          item.description = item.description.replace(/\n/g, '<br>')
        })
        this.filterItems()
      }
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style scoped>
</style>
