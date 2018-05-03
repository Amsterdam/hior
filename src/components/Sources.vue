<template>
  <div>

    <h2>Bronnen</h2>
    <div v-for="source in sources" :key="source.link">
      <a :href="`${OBJECTSTORE_URL}Documenten/${source.link}.pdf`" target="_blank">{{source.source}}</a>
    </div>

    <h2>Links</h2>
    <div v-for="source in links" :key="source.link">
      <a :href="`${OBJECTSTORE_URL}Documenten/${source.link}`" target="_blank">{{source.link}}</a>
    </div>

    <h2>Plaatjes</h2>
    <div v-for="image in images" :key="image.link">
      <a :href="`${OBJECTSTORE_URL}Afbeeldingen/${image.link}`" target="_blank">{{image.image}}</a>

    </div>
  </div>
</template>

<script>
/**
 * This is a simple component used for development only
 * No tests or comments are included for this component
 * The component is used to display or external references that are being used on one page
 * A broken link checker can be used to verify that all links are valid
 */
import { mapGetters } from 'vuex'
import _ from 'lodash'
import { OBJECTSTORE_URL } from '@/services/objectstore'

export default {
  name: 'Errors',
  computed: {
    ...mapGetters([
      'attributes'
    ])
  },
  watch: {
    'attributes' (to, from) {
      this.init()
    }
  },
  data () {
    return {
      sources: [],
      images: [],
      links: [],
      OBJECTSTORE_URL
    }
  },
  methods: {
    async init () {
      if (this.attributes) {
        this.sources = _.uniq(this.attributes
          .filter(attr => attr.name === 'SourceLink')
          .map(attr => attr.value))
          .filter(source => !source.includes('(voormalig)'))
          .sort()
          .map(source => ({
            source,
            link: source
          }))

        this.links = _.uniq(this.attributes
          .filter(attr => attr.name === 'Link')
          .map(attr => attr.value))
          .sort()
          .map(value => ({
            value,
            link: value
          }))

        this.images = _.uniq(this.attributes
          .filter(attr => attr.name === 'Image')
          .map(attr => attr.value))
          .sort()
          .map(image => ({
            image,
            link: image
          }))
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
</style>
