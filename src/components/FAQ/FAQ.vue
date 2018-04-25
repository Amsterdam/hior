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
    init () {
      const toHtml = text => text.replace(/\n/g, '<br>') // simply translate line breaks
      this.items = this.faq.map(item => ({
        ...item,
        htmlQuestion: toHtml(item.question),
        htmlAnswer: toHtml(item.answer)
      }))
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style scoped>

</style>
