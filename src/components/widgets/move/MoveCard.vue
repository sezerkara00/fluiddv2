<template>
  <collapsable-card
    :title="$t('app.general.title.move')"
    draggable
    icon="$fire"
    layout-path="dashboard.move-card"
  >
    <!-- <ze-manuell /> -->
    <Move />
  </collapsable-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Move from './Move.vue';
// import ZeManuell from './ZeManuell.vue'

@Component({
  components: {
    Move
    // ZeManuell
  }
})
export default class MoveCard extends Vue {}
</script>