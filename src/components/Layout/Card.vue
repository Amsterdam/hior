<template>
  <div class="card mt-2">
    <div class="card-header">
      <div class="float-right" v-if="collapse">
        <button class="btn btn-secondary dropdown-toggle" type="button" @click="toggle"></button>
      </div>
      <h5 v-html="title"></h5>
    </div>

    <div class="card-body" v-if="!collapsed">
      <div >
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'card',
  props: [
    'title',
    'collapse'
  ],
  data () {
    return {
      collapsed: false
    }
  },
  methods: {
    toggle () {
      this.collapsed = !this.collapsed
    }
  },
  created () {
    if (this.collapse) {
      this.collapsed = true
    }
  }
}
</script>

<style scoped>
@media print {
  .card {
    page-break-after: always;
  }
}
</style>
