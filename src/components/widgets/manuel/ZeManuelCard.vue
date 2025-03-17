<template>
  <collapsable-card
    :title="$t('app.general.title.z_manual')"
    icon="$fire"
    layout-path="dashboard.ze-manuel-card"
  >
    <v-row>
      <v-col>
        <ze-manuell />
      </v-col>
      <v-col>
        <ze-manuel />
      </v-col>
    </v-row>
  </collapsable-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ZeManuel from './ZeManuel.vue'
import ZeManuell from './ZeManuell.vue'

@Component({
  components: {
    ZeManuel,
    ZeManuell
  }
})
export default class ZeManuelCard extends Vue {}
</script>
