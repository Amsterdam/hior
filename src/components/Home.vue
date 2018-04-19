<template>
  <div>
    <h1>Home</h1>
    Items {{items}}
    Properties {{properties}}
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  computed: {
    ...mapGetters([
      'items',
      'properties'
    ])
  }
}
</script>

<style scoped>
</style>
