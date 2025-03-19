<template>
  <v-card>
    <v-card-text>
      <v-container>
        <!-- Tool Selection and START button -->
        <v-row align="center" justify="space-between">
          <v-col cols="12" sm="6" md="3" class="mb-4 mb-sm-0 pa-0">
            <v-list-item-content>
              <v-list-item-title>
                SELECT TOOL
              </v-list-item-title>
            </v-list-item-content>
          </v-col>
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
          <v-col cols="12" sm="6" md="3" class="mb-4 mb-sm-0 pa-0 text-center mr-4">
            <v-btn
              block
              color="primary"
              class="white--text"
              x-large
              @click="handleStart"
              :disabled="!canExecuteCommand"
            >
              <template v-if="!isLoading" class="mr-4">
                <v-icon>$cogs</v-icon>
              </template>
              <template v-if="isLoading">
                <v-progress-circular indeterminate color="white" size="24" class="mr-4" />
              </template>
              START Z MANUAL
            </v-btn>
          </v-col>
        </v-row>

        <!-- Z Control Dialog -->
        <v-dialog
          v-model="toolSelected"
          max-width="400"
          persistent
        >
        <collapsable-card
          :title="selectedToolText"
        >
          <v-card>
            <v-card-text>
              <!-- Z Title with Value and Selected Tool -->
              <v-row justify="center" class="mb-4">
                <v-col cols="12" class="text-center">
                  <span class="text-h5">
                    {{ selectedToolText }}
                  </span>
                  <!-- <div class="z-values mt-2"> -->
                    <!-- <div class="z-value-item">
                      <span class="z-label">Target Z:</span>
                      <v-text-field
                        v-model.number="zValue"
                        type="number"
                        step="0.001"
                        class="z-number"
                        hide-details
                        dense

                      ></v-text-field>
                    </div> -->
                    <div class="z-value-item">
                      <span class="z-label">Current Z:</span>
                      <span class="z-number">{{ livePosition[2].toFixed(3) }}</span>
                    </div>
                  </div>
                </v-col>
              </v-row>

              <!-- First Row of +/- Controls -->
              <v-row v-for="(value, index) in changeZvalueList"
                    :key="index"
                    align="center"
                    justify="center"
                    :class="index !== changeZvalueList.length - 1 ? 'mb-2' : 'mb-6'">
                <v-col cols="auto">
                  <v-btn color="primary"
                        @click="decrease(value)"
                        :disabled="!canExecuteCommand">
                    -
                  </v-btn>
                </v-col>
                <v-col cols="auto" class="text-center bg-grey-lighten-1">
                  <span class="mx-4 grey--text" color="grey">{{ value.toFixed(3) }}</span>
                </v-col>
                <v-col cols="auto">
                  <v-btn color="primary"
                        @click="increase(value)"
                        :disabled="!canExecuteCommand">
                    +
                  </v-btn>
                </v-col>
              </v-row>
              <!-- Bottom Buttons -->
              <v-row justify="space-around" class="mt-4">
                <v-col cols="auto">
                  <v-btn color="primary"
                        @click="handleButton(1)"
                        :disabled="!canExecuteCommand">
                    Abort
                  </v-btn>
                </v-col>
                <v-col cols="auto">
                  <v-btn color="primary"
                        @click="OffsetDialog = true"
                        :disabled="!canExecuteCommand">
                    Offset
                  </v-btn>
                </v-col>
                <v-col cols="auto">
                  <v-btn color="primary"
                        @click="StaticSaveDialog = true"
                        :disabled="!canExecuteCommand">

                    Static
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </collapsable-card>
        </v-dialog>

        <v-dialog v-model="StaticSaveDialog" max-width="400" persistent>
          <collapsable-card>
            <template #title>
              <div class="d-flex align-center">
                <v-icon>$error</v-icon>
                <span>Confirmation</span>
              </div>
            </template>
            <v-card>
              <v-card-text>
                <v-row justify="center" class="mb-4">
                  <v-col cols="12" class="text-center">
                    <span class="text-h5">
                      Are you sure {{ toolName }} SAVE STATIC ?
                    </span>
                  </v-col>
                </v-row>
                <v-row justify="center" class="mt-4">
                  <v-col cols="auto" class="mx-2">
                    <v-btn
                      @click="StaticSaveDialog = false"
                    >
                      No
                    </v-btn>
                  </v-col>
                  <v-col cols="auto" class="mx-2">
                    <v-btn
                      color="primary"
                      @click="StaticSaveDialogPage"
                    >
                      Yes
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </collapsable-card>
        </v-dialog>

        <v-dialog v-model="OffsetDialog" max-width="400" persistent>
          <collapsable-card>
            <template #title>
              <div class="d-flex align-center">
                <v-icon>$error</v-icon>
                <span>Confirmation</span>
              </div>
            </template>
            <v-card>
              <v-card-text>
                <v-row justify="center" class="mb-4">
                  <v-col cols="12" class="text-center">
                    <span class="text-h5">
                      Are you sure {{ toolName }} SAVE OFFSET ?
                    </span>
                  </v-col>
                </v-row>
                <v-row justify="center" class="mt-4">
                  <v-col cols="auto" class="mx-2">
                    <v-btn
                      @click="OffsetDialog = false"
                    >
                      No
                    </v-btn>
                  </v-col>
                  <v-col cols="auto" class="mx-2">
                    <v-btn
                      color="primary"
                      @click="OffsetDialogPage"
                    >
                      Yes
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </collapsable-card>
        </v-dialog>
        <div class="position-display">
          <span class="axis-position">
            X: {{ livePosition[0].toFixed(2) }}
          </span>
          <span class="axis-position">
            Y: {{ livePosition[1].toFixed(2) }}
          </span>
          <span class="axis-position">
            Z: {{ livePosition[2].toFixed(2) }}
          </span>
        </div>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import StateMixin from '@/mixins/state'
import BrowserMixin from '@/mixins/browser'
import type { KlipperPrinterSettings } from '@/store/printer/types'


interface ToolValues {
  [key: string]: number
}

interface Tool {
  text: string
  value: string
  defaultValue: number
}

@Component({})
export default class ZeManuel extends Mixins(StateMixin, BrowserMixin) {
  isLoading: boolean = false
  private toolSelected = false
  private selectedTool = ''
  private zValue = 10.000
  private StaticSaveDialog = false
  private OffsetDialog = false
  private tools: Tool[] = [
    { text: 'T0', value: '0', defaultValue: 10.000 },
    { text: 'T1', value: '1', defaultValue: 11.000 },
    { text: 'T2', value: '2', defaultValue: 12.000 },
    { text: 'T3', value: '3', defaultValue: 13.000 }
  ]

  get toolHaveValue (): boolean {
    return this.tools.some(tool => tool.value === this.selectedTool)
  }

  get toolName (): string {
    return this.tools.find(t => t.value === this.selectedTool)?.text ?? ''
  }

  StaticSaveDialogPage (): void {
    this.StaticSaveDialog = false
    const selectedToolInfo = this.tools.find(t => t.value === this.selectedTool)
    if (selectedToolInfo) {
      this.sendGcode(`SAVE_Z_NOZZLE_TEST T=${selectedToolInfo.value} TYPE=STATIC`)
    }
  }

  OffsetDialogPage (): void {
    this.OffsetDialog = false
    const selectedToolInfo = this.tools.find(t => t.value === this.selectedTool)
    if (selectedToolInfo) {
      this.sendGcode(`SAVE_Z_NOZZLE_TEST T=${selectedToolInfo.value} TYPE=OFFSET`)
    }
  }

  changeZvalueList: number[] = [
    1.000,
    0.500,
    0.100,
    0.050,
    0.025,
    0.010
  ]

  get selectedToolText (): string {
    const tool = this.tools.find(t => t.value === this.selectedTool)
    return tool ? tool.text : ''
  }
  // get printerState (): 'printing' | 'paused' | 'cancelled' | 'ready' | 'busy' | 'idle' | 'loading' {
  //   return this.$store.getters['printer/getPrinterState']
  // }

  get canExecuteCommand (): boolean {
    if (this.printerState === 'ready' || this.printerState === 'paused') {
      this.isLoading = false
    }
    return ['ready', 'paused'].includes(this.printerState)
  }

  get allHomed (): boolean {
    return this.$store.getters['printer/getHomedAxes']('xyz')
  }

  emitSend (val: string): void {
    this.$emit('send', val)
    console.log(`komut gonderildi ${val}`)
  }

  created (): void {
    const savedValues = localStorage.getItem('toolZValues')
    if (savedValues) {
      const values = JSON.parse(savedValues) as ToolValues
      this.tools = this.tools.map(tool => ({
        ...tool,
        defaultValue: values[tool.value] || tool.defaultValue
      }))
    }
  }

  // setConsoleEntry(message: string): void {
  //   const entry: ConsoleEntry = {
  //     message,
  //     time: Date.now(),
  //     type: 'request'
  //   }
  //   this.$store.commit('console/setConsoleEntry', entry)
  // }

  get consoleEntries (): KlipperPrinterSettings {
    return this.$store.getters['console/getConsoleEntries']
  }

  afterRoute (): string[] {
    return ['G90\nG1 Z25 F600', 'G90\nG1 X100 F7800', 'G90\nG1 Y100 F7800']
    // return ['G90\nG1 Y100 F7800', 'G90\nG1 X100 F7800', 'G90\nG1 Z5 F600']
  }

  private async sendGcodeAndWait(gcode: string): Promise<void> {
    this.sendGcode(gcode)

    return new Promise<void>((resolve) => {
      const checkState = setInterval(() => {
        if (this.canExecuteCommand) {
          clearInterval(checkState)
          resolve()
        }
      }, 100)
    })
  }

  get livePosition (): [number, number, number, number] {
    return this.$store.state.printer.printer.motion_report?.live_position ?? [0, 0, 0, 0]
  }

  async executeRouteCommands(): Promise<void> {
    if (!this.canExecuteCommand) {
      this.$emit('snackbar', {
        message: 'Printer is not ready to execute commands',
        type: 'warning'
      })
      return
    }

    const commands = this.afterRoute()

    for (const command of commands) {
      try {
        await this.sendGcodeAndWait(command)
      } catch (error) {
        console.error('Error executing route command:', error)
        this.$emit('snackbar', {
          message: 'Error executing route commands',
          type: 'error'
        })
        return
      }
    }
  }

  async handleStart (): Promise<void> {
    this.isLoading = true
    const selectedToolInfo = this.tools.find(t => t.value === this.selectedTool)
    if (selectedToolInfo) {
      if (!this.canExecuteCommand) {
        this.$emit('snackbar', {
          message: 'Printer is not ready to execute commands',
          type: 'error'
        })
        return
      }
      const message = `Z_NOZZLE_TEST T=${selectedToolInfo.value}`
      try {
        await this.sendGcodeAndWait(message)
        console.log('message gonderildi: ', message)
        if (this.printerState === 'ready') {
          await this.executeRouteCommands()
          this.toolSelected = true
        }
      } catch (error) {
        console.error('Error in handleStart:', error)
        this.$emit('snackbar', {
          message: 'Error executing commands',
          type: 'error'
        })
      }
    } else {
      console.warn('No tool selected')
      this.$emit('snackbar', {
        message: 'Please select a tool first',
        type: 'warning'
      })
    }
  }

  selectTool (toolValue: string): void {
    this.selectedTool = toolValue
    const tool = this.tools.find(t => t.value === toolValue)
    if (tool) {
      this.zValue = tool.defaultValue
      this.toolSelected = true
    }
  }

  decrease (value: number): void {
    this.zValue -= value
    this.zValue = Number(this.zValue.toFixed(3))
    this.sendGcode(`G90\nG1 Z${this.zValue} F600`)
  }

  increase (value: number): void {
    this.zValue += value
    this.zValue = Number(this.zValue.toFixed(3))
    this.sendGcode(`G90\nG1 Z${this.zValue} F600`)
  }

  handleButton (buttonNumber: number): void {
    if (buttonNumber === 1) {
      this.toolSelected = false
      this.selectedTool = ''
      console.log('Aborted - returning to tool selection')
    } else if (buttonNumber === 3) {
      const toolIndex = this.tools.findIndex(t => t.value === this.selectedTool)
      if (toolIndex !== -1) {
        this.tools[toolIndex].defaultValue = this.zValue

        this.sendGcode(`SAVE_Z_NOZZLE_TEST T=${this.selectedTool} TYPE=STATIC`)

      //   localStorage.setItem('toolZValues', JSON.stringify(values))

      //   console.log('Static button pressed - Saved values:', {
      //     tool: this.tools[toolIndex].text,
      //     zValue: this.zValue.toFixed(3),
      //     allValues: values
      //   })

        this.$emit('snackbar', {
          message: `Saved Z value ${this.zValue.toFixed(3)} for ${this.tools[toolIndex].text}`,
          type: 'success'
        })
      }
    }
  }
}
</script>

<style scoped>
.position-display {
  display: flex;
  gap: 1rem;
  padding: 8px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.axis-position {
  font-family: monospace;
  font-weight: bold;
}

.z-values {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

.z-value-item {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.z-label {
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
}

.z-number {
  font-family: monospace;
  font-size: 1.2em;
  font-weight: bold;
}
</style>
