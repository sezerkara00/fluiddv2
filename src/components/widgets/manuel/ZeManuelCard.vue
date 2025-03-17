<template>
  <collapsable-card
    :title="$t('app.general.title.z_manual')"
    draggable
    icon="$pidCalibrate"
    layout-path="dashboard.ze-manuel-card"

  >
    <!-- <ze-manuell /> -->
    <ze-manuel />
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
