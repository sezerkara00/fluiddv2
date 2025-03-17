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
              START Z MANUAL
            </v-btn>
          </v-col>
        </v-row>
          <!-- <v-col cols="auto" v-for="tool in tools" :key="tool.value">
            <v-btn
              color="primary"
              class="mx-1"
              @click="selectTool(tool.value)"
            >
              {{ tool.text }}
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn
              color="success"
              class="mx-1"
              @click="handleStart"
            >
              START
            </v-btn>
          </v-col> -->


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
                  <div class="z-values mt-2">
                    <div class="z-value-item">
                      <span class="z-label">Target Z:</span>
                      <v-text-field
                        v-model.number="zValue"
                        type="number"
                        step="0.001"
                        class="z-number"
                        hide-details
                        dense
                      ></v-text-field>
                    </div>
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
                        @click="handleButton(2)"
                        :disabled="!canExecuteCommand">
                    Offset
                  </v-btn>
                </v-col>
                <v-col cols="auto">
                  <v-btn color="primary"
                        @click="handleButton(3)"
                        :disabled="!canExecuteCommand"
                        >

                    Static
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
import ToolheadMixin from '@/mixins/toolhead'


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
  private toolSelected = false
  private selectedTool = ''
  private zValue = 10.000

  private tools: Tool[] = [
    { text: 'T0', value: 't0', defaultValue: 10.000 },
    { text: 'T1', value: 't1', defaultValue: 11.000 },
    { text: 'T2', value: 't2', defaultValue: 12.000 },
    { text: 'T3', value: 't3', defaultValue: 13.000 }
  ]

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
  get printerState (): 'printing' | 'paused' | 'cancelled' | 'ready' | 'busy' | 'idle' | 'loading' {
    return this.$store.getters['printer/getPrinterState']
  }

  get canExecuteCommand(): boolean {
    return ['ready', 'idle', 'paused'].includes(this.printerState)
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

  afterRoute(): string[] {
    return ['G90\nG1 Y100 F7800', 'G90\nG1 X100 F7800', 'G90\nG1 Z5 F600']
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

  async handleStart(): Promise<void> {
    const selectedToolInfo = this.tools.find(t => t.value === this.selectedTool)

    if (selectedToolInfo) {
      if (!this.canExecuteCommand) {
        this.$emit('snackbar', {
          message: 'Printer is not ready to execute commands',
          type: 'error'
        })
        return
      }

      const message = selectedToolInfo.text
      try {
        await this.sendGcodeAndWait(message)
        await this.executeRouteCommands()
        this.toolSelected = true
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
      console.log(`Selected ${tool.text} with Z value: ${tool.defaultValue}`)
    }
  }

  decrease (value: number): void {
    this.zValue -= value
    this.zValue = Number(this.zValue.toFixed(3))
  }

  increase (value: number): void {
    this.zValue += value
    this.zValue = Number(this.zValue.toFixed(3))
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

        const values = this.tools.reduce((acc: ToolValues, tool) => {
          acc[tool.value] = tool.defaultValue
          return acc
        }, {} as ToolValues)

        localStorage.setItem('toolZValues', JSON.stringify(values))

        console.log('Static button pressed - Saved values:', {
          tool: this.tools[toolIndex].text,
          zValue: this.zValue.toFixed(3),
          allValues: values
        })

        this.$emit('snackbar', {
          message: `Saved Z value ${this.zValue.toFixed(3)} for ${this.tools[toolIndex].text}`,
          type: 'success'
        })
      }
    }
  }

  async routeY(): Promise<void> {
    if (this.canExecuteCommand) {
      this.sendGcode('G90\nG1 Y100 F7800')
    } else {
      this.$emit('snackbar', {
        message: 'Printer is not ready to execute commands',
        type: 'warning'
      })
    }
  }

  async routeX(): Promise<void> {
    if (this.canExecuteCommand) {
      this.sendGcode('G90\nG1 X100 F7800')
    } else {
      this.$emit('snackbar', {
        message: 'Printer is not ready to execute commands',
        type: 'warning'
      })
    }
  }

  async routeZ(): Promise<void> {
    if (this.canExecuteCommand) {
      this.sendGcode('G90\nG1 Z5 F600')
    } else {
      this.$emit('snackbar', {
        message: 'Printer is not ready to execute commands',
        type: 'warning'
      })
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
