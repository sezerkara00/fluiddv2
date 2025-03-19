<template>
  <v-card>
    <v-card-text>
      <v-container>
        <v-row align="center" justify="space-between">
          <v-col cols="12" sm="6" md="3" class="mb-4 mb-sm-0 pa-0">
            <v-list-item-content>
              <v-list-item-title>
                SELECT TOOL
              </v-list-item-title>
            </v-list-item-content>
          </v-col>

          <!-- Sol Combobox -->
          <v-col cols="12" sm="6" md="3" class="mb-4 mb-sm-0">
            <v-select
              v-model="selectedTool"
              :items="tools"
              item-text="text"
              item-value="value"
              label="Select Tool"
              color="lightgrey"
              outlined
              dark
              dense
              hide-details="auto"
            ></v-select>
          </v-col>

          <!-- Orta Butonlar (2x2 Grid) -->
          <!-- <v-col cols="12" sm="12" md="6" class="mb-4 mb-md-0">
            <v-row> -->
              <!-- İlk Satır (1-2) -->
              <!-- <v-col cols="6" class="mb-3">
                <v-btn
                  block
                  :color="selectedButton === 0 ? 'primary' : 'grey darken-1'"
                  class="white--text"
                  medium
                  @click="selectButton(0)"
                >
                  BUTON 1
                </v-btn>
              </v-col>
              <v-col cols="6" class="mb-3">
                <v-btn
                  block
                  :color="selectedButton === 1 ? 'primary' : 'grey darken-1'"
                  class="white--text"
                  medium
                  @click="selectButton(1)"
                >
                  BUTON 2
                </v-btn>
              </v-col>
              <-- İkinci Satır (3-4) -->
              <!-- <v-col cols="6">
                <v-btn
                  block
                  :color="selectedButton === 2 ? 'primary' : 'grey darken-1'"
                  class="white--text"
                  medium
                  @click="selectButton(2)"
                >
                  BUTON 3
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn
                  block
                  :color="selectedButton === 3 ? 'primary' : 'grey darken-1'"
                  class="white--text"
                  medium
                  @click="selectButton(3)"
                >
                  BUTON 4
                </v-btn>
              </v-col>
            </v-row>
          </v-col> -->

          <!-- Sağ Buton -->
          <v-col cols="12" sm="6" md="3" class="mb-4 mb-sm-0 pa-0 text-center mr-10">
            <v-btn
              block
              color="primary"
              class="white--text"
              x-large
              :disabled="!canExecuteCommand || !allHomed"
              @click="sendButton(selectedButton)"
            >
              <template v-if="!isLoading" class="mr-4">
                <v-icon>$cogs</v-icon>
              </template>
              <template v-if="isLoading">
                <v-progress-circular indeterminate color="white" size="24" class="mr-4" />
              </template>
              START CALIBRATION
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import StateMixin from '@/mixins/state'
import BrowserMixin from '@/mixins/browser'
import type { KlipperPrinterSettings } from '@/store/printer/types'

@Component({})
export default class Calibre extends Mixins(StateMixin, BrowserMixin) {
  isLoading: boolean = false
  selectedButton: number = -1 // -1 means no button selected
  selectedTool = { text: 'Select Tool', value: '' } // default selected tool
  isSendPressed: boolean = false // track send button press state
  // Tool options for the combobox
  tools = [
    { text: 'Probs', value: 'z' },
    { text: 'Tool 0', value: '0' },
    { text: 'Tool 1', value: '1' },
    { text: 'Tool 2', value: '2' },
    { text: 'Tool 3', value: '3' },

  ]

  get allHomed (): boolean {
    return this.$store.getters['printer/getHomedAxes']('xyz')
  }

  selectButton (index: number) {
    // If clicking the already selected button, deselect it
    if (this.selectedButton === index) {
      this.selectedButton = -1
    } else {
      this.selectedButton = index
    }
  }

  pressSend (pressed: boolean) {
    this.isSendPressed = pressed
  }

  sendButton (index: number) {
    this.isLoading = true
    this.sendGcode(`Z_SWITCH_CALIBRATION T=${this.selectedTool}`)
  }

  get canExecuteCommand (): boolean {
    if (this.printerState === 'ready' || this.printerState === 'paused') {
      this.isLoading = false
    }
    return ['ready', 'paused'].includes(this.printerState)

  }
}
</script>
