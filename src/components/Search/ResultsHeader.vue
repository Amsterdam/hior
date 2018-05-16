<template>
  <div class="alert alert-primary mt-3 pb-0" role="alert">
    <div class="font-weight-bold mt-1">
      <div :class="{'mb-3': prop.name !== 'Theme'}">
        <span>
          <img v-if="prop.name === 'Theme'" :src="`../../../static/icons/${prop.value.replace(/^\d+\.\s/, '')}.png`" class="prop-image">
        </span>
        <span class="prop-text">{{propertyTypeName(prop.name)}}: {{prop.value}} ({{prop.count}})</span>
      </div>
    </div>
  </div>
</template>

<script>
import { propertyTypeName } from '@/services/hior'

export default {
  name: 'ResultsHeader',
  props: [
    'prop'
  ],
  methods: {
    /**
     * Return the name for the propertyType, e.g. 'Stadsdeel' for property type 'Area'
     * @param propertyType
     * @returns {*}
     */
    propertyTypeName (propertyType) {
      return propertyTypeName([propertyType])
    }
  }
}
</script>

<style scoped>
.top-link {
  text-decoration: none;
}
.prop-image {
  height: 55px;
  margin-top: -16px;
  margin-left: -10px;
  margin-right: 20px;
}
.prop-text {
  vertical-align: top;
}
</style>
