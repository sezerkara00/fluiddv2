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
              color="green"
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
          <v-col cols="12" sm="6" md="3" class="mb-4 mb-sm-0 pa-0 text-center mr-4">
            <v-btn
              block
              :color="isSendPressed ? 'primary' : 'dark'"
              class="white--text"
              x-large
              @mousedown="pressSend(true)"
              @mouseup="pressSend(false)"
              @mouseleave="pressSend(false)"
              @click="sendButton(selectedButton)"
            >
              START CALIBRATION
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import StateMixin from '@/mixins/state';
import BrowserMixin from '@/mixins/browser';
import type { KlipperPrinterSettings } from '@/store/printer/types';

@Component({})
export default class Calibre extends Mixins(StateMixin, BrowserMixin) {
  selectedButton: number = -1 // -1 means no button selected
  selectedTool: string = 'select tool' // default selected tool
  isSendPressed: boolean = false // track send button press state
  // Tool options for the combobox
  tools = [
    { text: 'Tool 1', value: 'tool1' },
    { text: 'Tool 2', value: 'tool2' },
    { text: 'Tool 3', value: 'tool3' },
    { text: 'Tool 4', value: 'tool4' },
  ]

  selectButton(index: number) {
    // If clicking the already selected button, deselect it
    if (this.selectedButton === index) {
      this.selectedButton = -1
    } else {
      this.selectedButton = index
    }
  }

  pressSend(pressed: boolean) {
    this.isSendPressed = pressed
  }


  sendButton(index: number) {
    console.log('Selected Tool:', this.selectedTool)
  }

  get consoleEntries (): KlipperPrinterSettings {
    return this.$store.getters['console/getConsoleEntries'];
  }

  get latestConsoleMessage () {
    const lastEntry = this.consoleEntries[this.consoleEntries.length - 1];
    return lastEntry ? `Son Mesaj: ${lastEntry.message}` : 'Mesaj yok';
  }

  get heaters () {
    return this.$store.getters['printer/getHeaters'];
  }
}
</script>

<style scoped>
.tool-select {
  background-color: transparent !important;
}

.box {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
}
</style>