<template>
  <div v-if="propertyTypes.length">
    <div class="text-center">
      <button type="button" class="btn mr-1" v-for="propType in propertyTypes" :key="propType"
              @click="orderItemsBy(propType)" :class="{'btn-primary': orderBy === propType}">
        {{propertyTypeName(propType)}}
      </button>
    </div>

    <div class="text-center mt-3" v-if="typeValues().length > 1">
      <a v-for="prop in propertyTypeValues(orderBy)" :key="prop.value"
         :href="`#${prop.value}`"
         class="badge badge-pill mr-1">{{prop.value}} ({{prop.count}})</a>
    </div>
  </div>
</template>

<script>
import { propertyTypeName } from '@/services/hior'

export default {
  name: 'SearchSort',
  props: [
    'propertyTypes',
    'propertyTypeValues',
    'orderBy',
    'orderItemsBy'
  ],
  methods: {
    /**
     * Return the name for the propertyType, e.g. 'Stadsdeel' for property type 'Area'
     * @param propertyType
     * @returns {*}
     */
    propertyTypeName (propertyType) {
      return propertyTypeName([propertyType])
    },

    typeValues () {
      return this.propertyTypeValues(this.orderBy).filter(p => p.count)
    }
  }
}
</script>

<style scoped>

</style>
