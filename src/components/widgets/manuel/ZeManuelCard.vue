<template>
  <collapsable-card
    :title="$t('app.general.title.z_manual')"
    icon="$fire"
    layout-path="dashboard.ze-manuel-card"
  >
    <ze-manuel />
  </collapsable-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ZeManuel from './ZeManuel.vue'

@Component({
  components: {
    ZeManuel
  }
})
export default class ZeManuelCard extends Vue {}
</script>
