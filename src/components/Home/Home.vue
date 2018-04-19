<template>
  <div>
    <div class="row">
      <div class="col-2">
        <sidebar></sidebar>
      </div>
      <div class="col-10">
        <div>
          <card title="Inleiding">
            <inleiding></inleiding>
          </card>

          <card title="Niveau" :collapse="true">
            <niveau></niveau>
          </card>

          <card title="Type" :collapse="true">
            <type></type>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Card from '../Layout/Card'
import Inleiding from './Inleiding'
import Niveau from './Niveau'
import Type from './Type'
import Sidebar from './Sidebar'

export default {
  name: 'Home',
  components: {
    Card,
    Sidebar,
    Type,
    Niveau,
    Inleiding
  }
}
</script>
