<template>
  <collapsable-card
    :title="$t('app.general.title.z_calibration')"
    icon="$fire"
    :lazy="false"
    draggable
    layout-path="dashboard.calibre-card"
  >
    <calibre />
  </collapsable-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Calibre from '@/components/widgets/calibrasyon/Calibre.vue'

@Component({
  components: {
    Calibre
  }
})
export default class CalibreCard extends Vue {
}
</script>
