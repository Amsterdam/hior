<template>
  <div>
    <ams-header :title="title">Header</ams-header>

    <ams-menu>Menu</ams-menu>

    <ams-content class="content">
      <router-view></router-view>
    </ams-content>

    <ams-footer :title="title" class="footer">Footer</ams-footer>

    <loading-component></loading-component>
  </div>
</template>

<script>
import amsHeader from '@/components/Layout/AMSHeader'
import amsMenu from '@/components/Layout/AMSMenu'
import amsContent from '@/components/Layout/AMSContent'
import amsFooter from '@/components/Layout/AMSFooter'
import loadingComponent from '@/components/Layout/LoadingComponent'

export default {
  name: 'App',
  components: {
    'ams-header': amsHeader,
    'ams-menu': amsMenu,
    'ams-content': amsContent,
    'ams-footer': amsFooter,
    'loading-component': loadingComponent
  },
  data () {
    return {
      title: 'Handboek Inrichting Openbare Ruimte'
    }
  }
}
</script>

<!-- Global styling -->
<style>
  .content {
    min-height: calc(100vh - 348px);
  }

  .footer {
    min-height: 226px;
  }
</style>
