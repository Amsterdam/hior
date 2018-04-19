<template>
  <footer class="container-fluid mt-2 pt-2 pb-1">
    <div>
      <h2>Disclaimer</h2>
      <p>
        {{title}} is gemaakt door {{author}}.
      </p>
      <p>
        De informatie in deze database wordt dagelijks aangepast, aangevuld en aangescherpt.
        De inhoud is dus nog volop in ontwikkeling en niet definitief.
        Dit is ook niet de definitieve vorm.
        We gebruiken deze testversie om wensen en behoeften van de uiteindelijke gebruikers te verzamelen, zodat we een goed bruikbaar platform kunnen ontwikkelen om de informatie uit de database te onsluiten.
      </p>
      <p>
        {{author}} kan  niet aansprakelijk worden gesteld voor de juistheid, volledigheid en actualiteit van de website.
        {{author}} kan in het bijzonder niet aansprakelijk worden gesteld voor eventuele schade of consequenties ontstaan door direct of indirect gebruik van de inhoud van de website.
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
      author: 'Datapunt'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
