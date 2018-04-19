<template>
  <div>
    <div class="row">
      <div class="col-2">
        <div class="images">
          <img src="../../static/images/intro1.jpg">
          <img src="../../static/images/intro2.jpg">
          <img src="../../static/images/intro3.jpg">
          <img src="../../static/images/intro4.jpg">
          <img src="../../static/images/intro5.jpg">
        </div>
      </div>
      <div class="col-10">
        <div>
          <card title="Inleiding">
            <p>
              Dit is de eerste testversie van het "HIOR Amsterdam". Het HIOR is een integrale verzameling van het
              vigerend
              beleid voor de inrichting van de openbare ruimte in Amsterdam. Het HIOR helpt opdrachtgevers,
              projectleiders, ontwerpers, adviseurs en beheerders om invuilling te geven aan het Amsterdamse beleid.
            </p>
            <div>
              In deze applicatie kun je beleid terugvinden:
              <ul>
                <li>
                  Per thema, bijvoorbeeld 'fiets', 'voetganger', 'groen', 'water & oevers' en 'straatmeubilair'
                </li>
                <li>
                  Per beleidsproduct, bijvoorbeeld alle hoofdlijnen van de 'visie openbare ruimte' of de 'nota
                  parkeernormen'
                </li>
              </ul>
            </div>
            <p>
              Daarnaast zijn aan de beleidsinformatie kenmerken toegevoegd, die hieronder worden toegelicht.
            </p>
          </card>

          <card title="Niveau" :collapse="true">
            <p>Hiermee wordt aangegeven op welk niveau het beleid richting geeft aan projecten. We maken onderscheid in
              ‘top’ (strategisch beleid), ‘sub’ (tactisch beleid), ‘uitwerking’ (operationeel beleid) en ‘proces’
              (procesafspraken).</p>
            <table class="table">
              <tbody>
              <tr>
                <th scope="row">Strategisch</th>
                <td>
                  Dit beleid is strategisch, gericht op het bereiken van een overkoepelend doel.
                  Ze geven richting aan de ontwikkeling van de stad en komen vaak voort uit visies, programma’s en
                  agenda’s.
                </td>
              </tr>
              <tr>
                <th scope="row">Tactisch</th>
                <td>
                  Dit beleid geeft op tactisch niveau aan wat we concreet doen, aanleggen of realiseren in de openbare
                  ruimte, om invulling te geven aan bovenliggend strategisch beleid.
                </td>
              </tr>
              <tr>
                <th scope="row">Operationeel</th>
                <td>
                  Dit beleid geeft op operationeel niveau aan hoe aspecten van de openbare ruimte moeten worden
                  ontworpen,
                  uitgewerkt of aangelegd.
                </td>
              </tr>
              <tr>
                <th scope="row">Proces</th>
                <td>
                  Dit zijn procesafspraken die bijdragen aan een betere samenwerking en uiteindelijk een beter resultaat
                  in de openbare ruimte.
                </td>
              </tr>
              </tbody>
            </table>
          </card>

          <card title="Type" :collapse="true">
            <p>Hiermee wordt aangegeven hoe beleid getypeerd wordt. We maken onderscheid ‘randvoorwaarden’,
              ‘uitgangspunten’ en ‘ambities’.</p>
            <table class="table">
              <tbody>
              <tr>
                <th scope="row">Randvoorwaarde</th>
                <td>
                  De openbare ruimte wordt conform deze bestuurlijk vastgestelde randvoorwaarden ingericht.
                  Afwijken is alleen mogelijk als daar door het bestuur expliciet toe bestloten wordt.
                </td>
              </tr>
              <tr>
                <th scope="row">Uitgangspunt</th>
                <td>
                  Deze uitgangspunten komen voort uit vastgesteld beleid en vormen de basis voor het ontwerp van de
                  Amsterdamse openbare ruimte.
                  Uitgangspunten bieden veelal ruimte voor diverse invullingen op projectniveau.
                  Er kan onderbouwd van de uitgangspunten worden afgeweken, afstemming met de opstellers of handhavers
                  van
                  het beleid en het bestuur.
                </td>
              </tr>
              <tr>
                <th scope="row">Ambitie</th>
                <td>
                  De door de gemeenteraad, het college of het stadsdeelbestuur vastgestelde ambities voor de openbare
                  ruimte dienen terug te komen bij herprofileringen en gebiedsontwikkelingen.
                  Niet alle ambities zijn binnen één projectgebied te vatten, op projectniveau worden hierin keuzes
                  gemaakt.
                </td>
              </tr>
              <tr>
                <th scope="row">Advies</th>
                <td>
                  Dit zijn zwaarwegende adviezen die volgen uit richtlijnen, handleidingen, handboeken etc. die geen
                  bestuurlijke status (meer) hebben, maar wel van belang zijn voor een goede inrichting van de openbare
                  ruimte.
                  Als er geen invulling aan het advies gegeven kan worden, wordt dit afgestemd met de betrokken
                  ambtenaren
                  of voorgelegd aan de daarvoor bestemde adviesorganen, zoals de Centrale Verkeerscommissie.
                </td>
              </tr>
              </tbody>
            </table>
          </card>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import card from './Layout/Card'

export default {
  name: 'Home',
  components: {
    'card': card
  }
}
</script>

<style scoped>
  img {
    width: 100%;
    margin-bottom: 25px;
  }

  .images {
    margin-top: 8px;
  }
</style>
