<template>
  <div>

    <h2>Bronnen</h2>
    <div v-for="source in sources" :key="source">
      <a :href="BASE_URL + 'Documenten/' + source.link" target="_blank">{{source.source}}</a>
    </div>

    <h2>Plaatjes</h2>
    <div v-for="image in images" :key="image">
      <a :href="BASE_URL + image.link" target="_blank">{{image.image}}</a>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'

const BASE_URL = 'https://131f4363709c46b89a6ba5bc764b38b9.objectstore.eu/hior/'

function sourceLink (source) {
  const linkData = source.match(/^(.*) \((\d+)\)$/)
  try {
    const [, title, year] = linkData
    return `${year} ${title}.pdf`
  } catch (e) {
    return source
  }
}

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
      BASE_URL
    }
  },
  methods: {
    async init () {
      if (this.attributes) {
        this.sources = _.uniq(this.attributes
          .filter(attr => attr.name === 'SourceLink')
          .map(attr => attr.value))
          .sort()
          .map(source => ({
            source,
            link: sourceLink(source)
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
      console.log('init', this.sources, this.images)
    }
  },
  mounted () {
    console.log('mounted')
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
