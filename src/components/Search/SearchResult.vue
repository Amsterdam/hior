<template>
  <!--Show matched result in a Card, default collapsed only showing the item text-->
  <card :title="filteredText(item.htmlText, textFilter)"
        :subTitle="subTitle(item)"
        :collapse="true">

    <!--The item description-->
    <div v-html="filteredText(item.htmlDescription, textFilter)"></div>

    <!--Images-->
    <div v-viewer.static="{'rotatable': false, 'scalable': false, 'transition': false}" class="mt-2">
      <img v-for="img in item.Image" :key="img" :title="img" :alt="img" :src="`${OBJECTSTORE_URL}Afbeeldingen/${img}`" class="item-image mr-3">
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
</template>

<script>
import Card from '../Layout/Card'

import { OBJECTSTORE_URL } from '@/services/objectstore'
import { filteredText } from '@/services/util'
import { propertyTypeName } from '@/services/hior'

export default {
  name: 'SearchResult',
  components: {
    Card
  },
  props: [
    'item',
    'textFilter',
    'propertyTypes'
  ],
  data () {
    return {
      OBJECTSTORE_URL
    }
  },
  methods: {
    /**
     * Provides for a subtitle, to show below the item text
     */
    subTitle (item) {
      // Themes, levels and types are each joined by a ',' and then joined with a '-'
      // e.g. Theme: [a, b], Level: [c] and Type: [d, f] => "a, b - c - d, f"
      return ['Theme', 'Level', 'Type'].map(propType => item[propType].join(', ')).join(' - ')
    },

    /**
     * Return the name for the propertyType, e.g. 'Stadsdeel' for property type 'Area'
     * @param propertyType
     * @returns {*}
     */
    propertyTypeName (propertyType) {
      return propertyTypeName([propertyType])
    },

    filteredText
  }
}
</script>

<style scoped>
.item-image {
  max-width: 250px;
  max-height: 250px;
}
</style>
