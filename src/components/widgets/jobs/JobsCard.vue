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
        :color="activeButton === 'custom' ? 'primary' : 'default'"
        @click="navigateToCustomFolder"
      >
        Özel Klasör
      </app-btn>

      <app-btn
        class="mr-2"
        :color="activeButton === 'gcodes' ? 'primary' : 'default'"
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
  activeButton = 'gcodes'
  customFolderPath = 'gcodes/fluiddv2' // Burada istediğiniz özel klasör yolunu belirtin

  @Prop({ type: Boolean })
  readonly fullscreen?: boolean

  navigateToCustomFolder() {
    this.activeButton = 'custom'
    const fileSystem = this.$refs.fileSystem as FileSystem

    // Önce ana gcodes dizinine git, sonra alt klasöre geçmeyi dene
    fileSystem.loadFiles('gcodes')

    // Bir sonraki çerçevede alt klasöre gitmeyi dene
    nextTick(() => {
      try {
        // Alt klasöre gitmeyi dene
        if (fileSystem && this.customFolderPath) {
          fileSystem.currentPath = this.customFolderPath
          fileSystem.loadFiles(this.customFolderPath)
        }
      } catch (error) {
        console.error('Özel klasöre erişim hatası:', error)
        // Hata durumunda ana gcodes klasöründe kal
      }
    })
  }

  handleGcodes() {
    this.activeButton = 'gcodes'
    const fileSystem = this.$refs.fileSystem as FileSystem
    if (fileSystem) {
      fileSystem.currentPath = 'gcodes'
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
