<template>
  <app-dialog
    v-model="open"
    :title="$t('app.general.title.rollover_logsezers')"
    :save-button-text="$t('app.general.btn.accept')"
    max-width="400"
  >
    <v-card-text>
      <v-radio-group
        v-model="application"
        hide-details
        mandatory
        class="mt-0"
      >
        <!-- <v-radio
          :label="$t('app.general.label.all')"
          :disabled="printerPrinting || printerPaused"
          value=""
        />
        <v-radio
          :disabled="printerPrinting || printerPaused"
          value="klipper"
        >
          <template #label>
            <div>Klipper <span class="secondary--text">(klippy.log)</span></div>
          </template>
        </v-radio>
        <v-radio value="moonraker">
          <template #label>
            <div>Moonraker <span class="secondary--text">(moonraker.log)</span></div>
          </template>
        </v-radio> -->
      </v-radio-group>
    </v-card-text>
  </app-dialog>
</template>

<script lang="ts">
import StateMixin from '@/mixins/state'
import { Component, Mixins, VModel } from 'vue-property-decorator'
// import { SocketActions } from '@/api/socketActions'

@Component({})
export default class RolloverLogsDialog extends Mixins(StateMixin) {
  @VModel({ type: Boolean })
  open?: boolean

  application = ''

  mounted () {
    if (
      this.printerPrinting ||
      this.printerPaused
    ) {
      this.application = 'moonraker'
    }
  }

  // sendAccept () {
  //   SocketActions.serverLogsRollover(this.application || undefined)

  //   this.open = false
  // }
}
</script>
