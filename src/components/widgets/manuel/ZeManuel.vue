<template>
  <v-card>
    <v-card-text>
      <v-container>
        <!-- Tool Selection and START button -->
        <v-row align="center" justify="center" class="mb-4">
          <!-- Tool Buttons -->
          <v-col cols="auto">
            <v-btn
              color="primary"
              class="mx-1"
              @click="selectTool('t0')"
            >
              T0
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn
              color="primary"
              class="mx-1"
              @click="selectTool('t1')"
            >
              T1
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn
              color="primary"
              class="mx-1"
              @click="selectTool('t2')"
            >
              T2
            </v-btn>
          </v-col>
          <v-col cols="auto">
            <v-btn
              color="primary"
              class="mx-1"
              @click="selectTool('t3')"
            >
              T3
            </v-btn>
          </v-col>
          
          <!-- START Button -->
          <v-col cols="auto">
            <v-btn
              color="grey"
              class="mx-1"
              @click="handleStart"
            >
              START
            </v-btn>
          </v-col>
        </v-row>

        <!-- Z Control Dialog -->
        <v-dialog
          v-model="toolSelected"
          max-width="400"
          persistent
        >
          <v-card>
            <v-card-text>
              <!-- Tool Selection Buttons -->
              <v-row justify="center" class="mb-4">
                <v-col cols="auto" v-for="tool in tools" :key="tool.value">
                  <v-btn
                    small
                    :color="selectedTool === tool.value ? 'primary' : 'grey darken-1'"
                    class="mx-1"
                    @click="switchTool(tool.value)"
                  >
                    {{ tool.text }}
                  </v-btn>
                </v-col>
              </v-row>

              <!-- Z Title with Value and Selected Tool -->
              <v-row justify="center" class="mb-4">
                <v-col cols="12" class="text-center">
                  <span class="text-h5">
                    {{ selectedToolText }} - Z [ {{ zValue.toFixed(3) }} ]
                  </span>
                </v-col>
              </v-row>

              <!-- Z Control Rows -->
              <template v-for="(row, index) in zControlRows">
                <v-row :key="index" align="center" justify="center" :class="index < 2 ? 'mb-2' : 'mb-6'">
                  <v-col cols="auto">
                    <v-btn  
                      :color="getButtonColor(row.row, 'minus')" 
                      x-small 
                      @click="decrease(row.row)"
                    >
                      -
                    </v-btn>
                  </v-col>
                  <v-col cols="auto" class="text-center">
                    <span class="mx-4">{{ row.row }}</span>
                  </v-col>
                  <v-col cols="auto">
                    <v-btn 
                      :color="getButtonColor(row.row, 'plus')" 
                      x-small 
                      @click="increase(row.row)"
                    >
                      +
                    </v-btn>
                  </v-col>
                </v-row>
              </template>

              <!-- Bottom Buttons -->
              <v-row justify="space-around" class="mt-4">
                <v-col cols="auto" v-for="(btn, index) in bottomButtons" :key="index">
                  <v-btn :color="btn.color" @click="handleButton(btn.action)">
                    {{ btn.text }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

interface ToolValues {
  [key: string]: number
}

interface Tool {
  text: string
  value: string
  defaultValue: number
}

interface Button {
  text: string
  color: string
  action: number
}

@Component({})
export default class ZeManuel extends Vue {
  toolSelected = false
  selectedTool = ''
  zValue = 10.000

  // Renk konfigürasyonu
  buttonColors = {
    minus: 'grey darken-1',
    plus: 'grey darken-1',
    default: 'primary',
    active: 'primary'  // Butona basıldığında primary renk olacak
  }

  // Aktif buton takibi için
  activeButton: { row: number; type: 'plus' | 'minus' } | null = null

  // Z kontrol satırları konfigürasyonu
  zControlRows = [
    { row: 1, increment: 0.100, color: { minus: this.buttonColors.minus, plus: this.buttonColors.plus } },
    { row: 2, increment: 0.010, color: { minus: this.buttonColors.minus, plus: this.buttonColors.plus } },
    { row: 3, increment: 0.001, color: { minus: this.buttonColors.minus, plus: this.buttonColors.plus } },
    { row: 4, increment: 1, color: { minus: this.buttonColors.minus, plus: this.buttonColors.plus } },
    { row: 5, increment: 10, color: { minus: this.buttonColors.minus, plus: this.buttonColors.plus } },
    { row: 6, increment: 100, color: { minus: this.buttonColors.minus, plus: this.buttonColors.plus } }
  ]

  // Alt butonlar için konfigürasyon
  bottomButtons: Button[] = [
    { text: 'Abort', color: this.buttonColors.default, action: 1 },
    { text: 'Offset', color: this.buttonColors.default, action: 2 },
    { text: 'Static', color: this.buttonColors.default, action: 3 }
  ]

  tools: Tool[] = [
    { text: 'T0', value: 't0', defaultValue: 10.000 },
    { text: 'T1', value: 't1', defaultValue: 11.000 },
    { text: 'T2', value: 't2', defaultValue: 12.000 },
    { text: 'T3', value: 't3', defaultValue: 13.000 }
  ]

  // Computed property to get selected tool text
  get selectedToolText(): string {
    const tool = this.tools.find(t => t.value === this.selectedTool)
    return tool ? tool.text : ''
  }

  // Load saved values from localStorage when component is created
  created() {
    const savedValues = localStorage.getItem('toolZValues')
    if (savedValues) {
      const values = JSON.parse(savedValues) as ToolValues
      this.tools = this.tools.map(tool => ({
        ...tool,
        defaultValue: values[tool.value] || tool.defaultValue
      }))
    }
  }

  handleStart() {
    for (const tool of this.tools) {
      console.log(tool.text, tool.defaultValue)
    }
  }

  selectTool(toolValue: string) {
    this.selectedTool = toolValue
    // Find the selected tool's default value
    const tool = this.tools.find(t => t.value === toolValue)
    if (tool) {
      this.zValue = tool.defaultValue
      this.toolSelected = true // Immediately show Z control panel
      console.log(`Selected ${tool.text} with Z value: ${tool.defaultValue}`)
    }
  }

  decrease(row: number) {
    const rowConfig = this.zControlRows.find(r => r.row === row)
    if (rowConfig) {
      // Butonu aktif yap
      this.activeButton = { row, type: 'minus' }
      
      // Değeri güncelle
      this.zValue -= rowConfig.increment
      this.zValue = Number(this.zValue.toFixed(3))

      // 100ms sonra butonu normale döndür
      setTimeout(() => {
        this.activeButton = null
      }, 100)
    }
  }

  increase(row: number) {
    const rowConfig = this.zControlRows.find(r => r.row === row)
    if (rowConfig) {
      // Butonu aktif yap
      this.activeButton = { row, type: 'plus' }
      
      // Değeri güncelle
      this.zValue += rowConfig.increment
      this.zValue = Number(this.zValue.toFixed(3))

      // 100ms sonra butonu normale döndür
      setTimeout(() => {
        this.activeButton = null
      }, 100)
    }
  }

  // Buton rengini hesaplamak için computed method
  getButtonColor(row: number, type: 'plus' | 'minus'): string {
    if (this.activeButton && this.activeButton.row === row && this.activeButton.type === type) {
      return this.buttonColors.active
    }
    return type === 'plus' ? this.buttonColors.plus : this.buttonColors.minus
  }

  handleButton(buttonNumber: number) {
    if (buttonNumber === 1) { // Abort
      this.toolSelected = false
      this.selectedTool = ''
      console.log('Aborted - returning to tool selection')
    } else if (buttonNumber === 3) { // Static
      // Save current Z value for the selected tool
      const toolIndex = this.tools.findIndex(t => t.value === this.selectedTool)
      if (toolIndex !== -1) {
        // Update the tool's default value
        this.tools[toolIndex].defaultValue = this.zValue

        // Save all tool values to localStorage
        const values = this.tools.reduce((acc, tool) => {
          acc[tool.value] = tool.defaultValue
          return acc
        }, {} as ToolValues)

        localStorage.setItem('toolZValues', JSON.stringify(values))

        // Log the saved values
        console.log('Static button pressed - Saved values:', {
          tool: this.tools[toolIndex].text,
          zValue: this.zValue.toFixed(3),
          allValues: values
        })

        // Show success message
        this.$emit('snackbar', {
          message: `Saved Z value ${this.zValue.toFixed(3)} for ${this.tools[toolIndex].text}`,
          type: 'success'
        })
      }
    }
  }

  switchTool(toolValue: string) {
    // Mevcut Z değerini kaydet
    const currentTool = this.tools.find(t => t.value === this.selectedTool)
    if (currentTool) {
      currentTool.defaultValue = this.zValue
    }

    // Yeni tool'a geç
    this.selectedTool = toolValue
    const newTool = this.tools.find(t => t.value === toolValue)
    if (newTool) {
      this.zValue = newTool.defaultValue
      console.log(`Switched to ${newTool.text} with Z value: ${newTool.defaultValue}`)
    }
  }
}
</script>

