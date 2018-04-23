<template>
  <div class="card mt-2">
    <div class="card-header" :class="{'clickHeader': collapse}" @click="toggle">
      <div class="float-right" v-if="collapse">
        <button class="btn btn-secondary dropdown-toggle" type="button"></button>
      </div>
      <h5 v-html="title" class="mb-1"></h5>
      <div v-if="subTitle" class="small font-weight-bold">{{subTitle}}</div>
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
    'subTitle',
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
.clickHeader {
  cursor: pointer;
}
</style>
