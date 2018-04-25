<template>
  <div class="menu mt-3">

    <div class="container">
      <nav class="nav nav-pills justify-content-end">
        <router-link to="/" class="nav-link" :class="{'activelink': $route.name === 'Home'}">
          <span class="linklabel">
            Startpagina
          </span>
        </router-link>
        <router-link to="/search" class="nav-link" :class="{'activelink': $route.name === 'Search'}">
          <span class="linklabel">
            Zoek
          </span>
        </router-link>
        <router-link to="/faq" class="nav-link" :class="{'activelink': $route.name === 'FAQ'}">
          <span class="linklabel">
            FAQ
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

.activelink {
  font-weight: bold;
  color: $ams-rood;
}
</style>
