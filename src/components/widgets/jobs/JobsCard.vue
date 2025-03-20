<template>
  <collapsable-card
    :title="$t('app.general.title.jobs')"
    icon="$files"
    :draggable="!fullscreen"
    :collapsable="!fullscreen"
    layout-path="dashboard.jobs-card"
    :help-tooltip="$t('app.general.tooltip.file_browser_help')"
  >
    <template #menu>
      <app-btn
        class="mr-2"
        :color="testButton ? 'primary' : 'default'"
        @click="test"
      >
        Test
      </app-btn>

      <app-btn
        class="mr-2"
        :color="!testButton ? 'primary' : 'default'"
        @click="handleGcodes"
      >
        gcodes
      </app-btn>
    </template>

    <file-system
      ref="fileSystem"
      :roots="['gcodes']"
      name="dashboard"
      dense
      :allow-parent-directory="!isInTestFolder"
      class="partial-screen"
    />
  </collapsable-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import FileSystem from '@/components/widgets/filesystem/FileSystem.vue'
import { nextTick } from 'vue'

@Component({
  components: {
    FileSystem
  }
})
export default class JobsCard extends Vue {
  testButton = false
  defaultButton = true
  isInTestFolder = false

  @Prop({ type: Boolean })
  readonly fullscreen?: boolean

  test () {
    this.testButton = true
    this.defaultButton = false
    this.isInTestFolder = true
    const fileSystem = this.$refs.fileSystem as FileSystem
    fileSystem.currentPath = 'gcodes/test_gcodes'
    nextTick(() => {
      if (fileSystem) {
        fileSystem.loadFiles(fileSystem.currentPath)
      }
    })
  }

  handleGcodes () {
    this.testButton = false
    this.defaultButton = true
    this.isInTestFolder = false
    const fileSystem = this.$refs.fileSystem as FileSystem
    if (fileSystem) {
      fileSystem.loadFiles('gcodes')
    }
  }
}
</script>

<style lang="scss" scoped>
  .full-screen {
    max-height: calc(100vh - 190px);
    max-height: calc(100svh - 190px);
  }

  .partial-screen {
    height: 400px;
  }
</style>
