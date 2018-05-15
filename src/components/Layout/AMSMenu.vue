<template>
  <div>

    <div class="sticky-top">
      <button class="btn btn-primary top-button" @click="scrollToTop()"
              v-if="canGoToTop"
              title="Terug naar begin van de pagina">
        Top
      </button>
    </div>

    <div class="menu mt-3">

    <div class="container">
      <nav class="nav nav-pills justify-content-end">
        <button v-for="link in menuLinks" :key="link.name"
                class="btn btn-link menu-link" @click="goTo(link.name)"
                :title="link.text"
                :class="{'activelink': $route.name === link.name}">
          {{link.text}}
        </button>
      </nav>
    </div>

  </div>
  </div>
</template>

<script>
const menuLinks = [
  { name: 'Home', text: 'Startpagina' },
  { name: 'Search', text: 'Zoek' },
  { name: 'FAQ', text: 'FAQ' }
]

export default {
  name: 'Menu',
  data () {
    return {
      menuLinks,
      canGoToTop: false
    }
  },
  methods: {
    scrollToTop () {
      document.body.scrollTop = 0 // For Safari
      document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
    },

    goTo (name) {
      if (this.$route.name === name) {
        this.scrollToTop()
      } else {
        this.$router.push({name})
      }
    }
  },
  mounted () {
    const minScroll = 400
    window.onscroll = () => {
      this.canGoToTop = document.body.scrollTop > minScroll ||
                        document.documentElement.scrollTop > minScroll
    }
  }
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

.menu-link {
  text-decoration: none !important;
}

.top-button {
  position: fixed;
  top: 12px;
  right: 15px;
}
</style>
