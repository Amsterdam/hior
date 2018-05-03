<template>
  <div>
    <h2>Veelgestelde vragen</h2>
    <card v-for="item in items" :key="item.id"
          :title="item.htmlQuestion" :collapse="true">
      <div v-html="item.htmlAnswer"></div>
    </card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { toHTML } from '@/services/util'
import Card from '../Layout/Card'

export default {
  name: 'FAQ',
  computed: {
    ...mapGetters([
      'faq'
    ])
  },
  components: {
    Card
  },
  data () {
    return {
      items: []
    }
  },
  watch: {
    'faq' (to, from) {
      this.init()
    }
  },
  methods: {
    /**
     * Extend the FAQ items with the questions and answers in HTML format
     */
    init () {
      this.items = this.faq.map(item => ({
        ...item,
        htmlQuestion: toHTML(item.question),
        htmlAnswer: toHTML(item.answer)
      }))
    }
  },
  mounted () {
    this.init()
  }
}
</script>
