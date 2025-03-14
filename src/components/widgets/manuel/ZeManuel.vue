<template>
  <v-card>
    <v-card-text>
      <v-container>
        <!-- Tool Selection and START button -->
        <v-row align="center" justify="center" class="mb-4">
          <v-col cols="auto" v-for="tool in tools" :key="tool.value">
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
              <!-- Z Title with Value and Selected Tool -->
              <v-row justify="center" class="mb-4">
                <v-col cols="12" class="text-center">
                  <span class="text-h5">
                    {{ selectedToolText }} - Z [ {{ zValue.toFixed(3) }} ]
                  </span>
                </v-col>
              </v-row>

              <!-- First Row of +/- Controls -->
              <v-row align="center" justify="center" class="mb-2">
                <v-col cols="auto">
                  <v-btn  color="error" x-small @click="decrease(1)">
                    -
                  </v-btn>
                </v-col>
                <v-col cols="auto" class="text-center">
                  <span class="mx-4">1</span>
                </v-col>
                <v-col cols="auto">
                  <v-btn color="success" x-small @click="increase(1)">
                    +
                  </v-btn>
                </v-col>
              </v-row>

              <!-- Second Row of +/- Controls -->
              <v-row align="center" justify="center" class="mb-6">
                <v-col cols="auto">
                  <v-btn color="error" x-small @click="decrease(2)">
                    -
                  </v-btn>
                </v-col>
                <v-col cols="auto" class="text-center">
                  <span class="mx-4">2</span>
                </v-col>
                <v-col cols="auto">
                  <v-btn color="success" x-small @click="increase(2)">
                    +
                  </v-btn>
                </v-col>
              </v-row>
              <v-row align="center" justify="center" class="mb-6">
                <v-col cols="auto">
                  <v-btn color="error" x-small @click="decrease(3)">
                    -
                  </v-btn>
                </v-col>
                <v-col cols="auto" class="text-center">
                  <span class="mx-4">3</span>
                </v-col>
                <v-col cols="auto">
                  <v-btn color="success" x-small @click="increase(3)">
                    +
                  </v-btn>
                </v-col>
              </v-row>

              <!-- Bottom Buttons -->
              <v-row justify="space-around" class="mt-4">
                <v-col cols="auto">
                  <v-btn color="primary" @click="handleButton(1)">
                    Abort
                  </v-btn>
                </v-col>
                <v-col cols="auto">
                  <v-btn color="primary" @click="handleButton(2)">
                    Offset
                  </v-btn>
                </v-col>
                <v-col cols="auto">
                  <v-btn color="primary" @click="handleButton(3)">
                    Static
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

@Component({})
export default class ZeManuel extends Vue {
  toolSelected = false
  selectedTool = ''
  zValue = 10.000

  // Computed property to get selected tool text
  get selectedToolText(): string {
    const tool = this.tools.find(t => t.value === this.selectedTool)
    return tool ? tool.text : ''
  }

  tools: Tool[] = [
    { text: 'T0', value: 't0', defaultValue: 10.000 },
    { text: 'T1', value: 't1', defaultValue: 11.000 },
    { text: 'T2', value: 't2', defaultValue: 12.000 },
    { text: 'T3', value: 't3', defaultValue: 13.000 }
  ]

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
    if (row === 1) {
      this.zValue -= 0.100
    } else if (row === 2) {
      this.zValue -= 0.010
    } else if (row === 3) {
      this.zValue -= 0.001
    }
    this.zValue = Number(this.zValue.toFixed(3))
  }

  increase(row: number) {
    if (row === 1) {
      this.zValue += 0.100
    } else if (row === 2) {
      this.zValue += 0.010
    } else if (row === 3) {
      this.zValue += 0.001
    }
    this.zValue = Number(this.zValue.toFixed(3))
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
}
</script>

<style scoped>
.v-btn {
  min-width: 36px !important;
}

.mx-1 {
  margin-left: 4px !important;
  margin-right: 4px !important;
}

/* Dialog stilini özelleştirme */
.v-dialog {
  border-radius: 8px;
  box-shadow: 0 4px 25px 0 rgba(0, 0, 0, 0.1);
}

.v-dialog > .v-card {
  background-color: rgba(var(--v-theme-surface-rgb), 0.85) !important; /* Saydamlık eklendi */
  backdrop-filter: blur(10px); /* Bulanık arka plan efekti */
  -webkit-backdrop-filter: blur(10px); /* Safari için destek */
  border: 1px solid rgba(255, 255, 255, 0.1); /* İnce kenarlık */
}

.v-card-text {
  backdrop-filter: blur(10px);
}

/* Butonları daha belirgin yapmak için */
.v-btn {
  background-color: rgba(var(--v-theme-surface-rgb), 0.9) !important;
}

/* Dialog açıldığında arka planı karartma */
.v-overlay__scrim {
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.3) !important;
}
</style>
