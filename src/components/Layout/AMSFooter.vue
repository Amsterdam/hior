<template>
  <footer class="container-fluid mt-2 pt-2 pb-1">
    <div class="container">
      <h2>Disclaimer</h2>
      <p>
        Het Handboek Inrichting Openbare Ruimte is samengesteld door de directie Verkeer & Openbare Ruimte.
        De website is ontwikkeld door Datapunt.
      </p>
      <p>
        De informatie op deze website wordt regelmatig aangevuld op basis van nieuwe bestuurlijke besluiten.
        <span v-if="lastUpdated">De laatste aanpassing vond plaats op {{ lastUpdated }}.</span>
        Het HIOR Amsterdam heeft op zichzelf géén bestuurlijke status. De achterliggende beleidsdocumenten zijn leidend.
      </p>
      <p>
        V&OR en Datapunt kunnen niet aansprakelijk worden gesteld voor de juistheid, volledigheid en actualiteit van de website.
        Datapunt kan in het bijzonder niet aansprakelijk worden gesteld voor eventuele schade of consequenties ontstaan door direct of indirect gebruik van de inhoud van de website.
      </p>
      <p>
        Vragen over het HIOR Amsterdam kun je mailen naar <a href="mailto:hior@amsterdam.nl">hior@amsterdam.nl</a>.
      </p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AMSFooter',
  props: [
    'title'
  ],
  data () {
    return {
      author: 'Datapunt',
      lastUpdated: null
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
