<template>
  <div class="menu mt-3">

    <div class="container">
      <nav class="nav nav-pills justify-content-end">
        <router-link to="/" class="nav-link">
          <span class="linklabel">
            Home
          </span>
        </router-link>
        <router-link to="/search" class="nav-link">
          <span class="linklabel">
            Search
          </span>
        </router-link>
      </nav>
    </div>
  </div>

</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
@import "~stijl/dist/scss/ams-colorpalette";

.menu {
  background-color: $ams-lichtgrijs;
}
</style>
