<template>
  <app-dialog
    v-model="open"
    scrollable
    :max-width="isMobileViewport ? '90vw' : '75vw'"
    :title="$tc('app.spoolman.title.spool_selection', targetMacro ? 2 : 1, { macro: targetMacro })"
    title-shadow
  >
    <template #menu>
      <v-menu
        v-if="availableCameras.length > 1"
        left
        offset-y
        transition="slide-y-transition"
      >
        <template #activator="{ on, attrs, value }">
          <app-btn
            v-bind="attrs"
            small
            class="me-1 my-1"
            v-on="on"
          >
            <v-icon
              class="mr-1"
              small
            >
              $camera
            </v-icon>
            {{ $t('app.spoolman.btn.scan_code') }}
            <v-icon
              small
              class="ml-1"
              :class="{ 'rotate-180': value }"
            >
              $chevronDown
            </v-icon>
          </app-btn>
        </template>
        <v-list dense>
          <v-list-item
            v-for="camera in availableCameras"
            :key="camera.uid"
            @click="cameraScanSource = camera.uid"
          >
            <v-list-item-icon>
              <v-icon>
                $camera
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ camera.name }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>

      <app-btn
        v-else-if="availableCameras.length"
        small
        class="me-1 my-1"
        @click="cameraScanSource = availableCameras[0].uid"
      >
        <v-icon
          class="mr-1"
          small
        >
          $camera
        </v-icon>
        {{ $t('app.spoolman.btn.scan_code') }}
      </app-btn>
    </template>

    <v-toolbar dense>
      <v-spacer />

      <app-column-picker
        key-name="spoolman"
        :headers="configurableHeaders"
      />

      <v-text-field
        v-model="search"
        outlined
        dense
        single-line
        hide-details
        spellcheck="false"
        append-icon="$magnify"
        style="max-width: 360px"
        class="ml-1"
        @focus="$event.target.select()"
      />
    </v-toolbar>

    <v-card-text class="pa-0">
      <v-data-table
        :items="availableSpools"
        :headers="headers"
        :search="search"
        :custom-filter="filterResults"
        :no-data-text="$t('app.file_system.msg.not_found')"
        :no-results-text="$t('app.file_system.msg.not_found')"
        :sort-by="sortOrder.key ?? undefined"
        :sort-desc="sortOrder.desc ?? undefined"
        mobile-breakpoint="0"
        class="spool-table"
        hide-default-footer
        disable-pagination
        @update:sort-by="handleSortOrderKeyChange"
        @update:sort-desc="handleSortOrderDescChange"
      >
        <template #item="{ headers, item }">
          <app-data-table-row
            :headers="headers"
            :item="item"
            :is-selected="item.id === selectedSpoolId"
            @click.prevent="selectedSpoolId = selectedSpoolId === item.id ? null : item.id"
          >
            <template #[`item.filament_name`]>
              <div class="d-flex my-1">
                <v-icon
                  :color="`#${item.filament.color_hex ?? ($vuetify.theme.dark ? 'fff' : '000')}`"
                  size="42px"
                  class="mr-4 flex-column spool-icon"
                >
                  {{ item.id === selectedSpoolId ? '$markedCircle' : '$filament' }}
                </v-icon>
                <div class="flex-column">
                  <div class="flex-row">
                    {{ item.filament_name }}
                  </div>
                  <div class="flex-row">
                    <small v-if="remainingFilamentUnit === 'weight'">
                      <b>{{ $filters.getReadableWeightString(item.remaining_weight) }}</b>
                      / {{ $filters.getReadableWeightString(item.filament.weight) }}
                    </small>
                    <small v-else-if="remainingFilamentUnit === 'length'">
                      <b>{{ $filters.getReadableLengthString(item.remaining_length) }}</b>
                      / {{ $filters.getReadableLengthString($filters.convertFilamentWeightToLength(item.filament.weight ?? 0, item.filament.density, item.filament.diameter)) }}
                    </small>
                  </div>
                </div>
              </div>
            </template>

            <template #[`item.last_used`]="{ value }">
              {{
                value
                  ? $filters.formatRelativeTimeToNow(value)
                  : $tc('app.setting.label.never')
              }}
            </template>
          </app-data-table-row>
        </template>
      </v-data-table>
    </v-card-text>

    <template #actions>
      <v-spacer v-if="isMobileViewport" />

      <app-btn
        v-if="spoolmanURL"
        :href="spoolmanURL"
        target="_blank"
        color="primary"
        text
        type="button"
      >
        {{ $t('app.spoolman.btn.manage_spools') }}
      </app-btn>

      <v-spacer v-if="!isMobileViewport" />

      <app-btn
        text
        color="warning"
        @click="open = false"
      >
        {{ $t('app.general.btn.cancel') }}
      </app-btn>
      <app-btn
        color="primary"
        @click="handleSelectSpool"
      >
        {{
          filename
            ? $t('app.general.btn.print')
            : $tc('app.spoolman.btn.select', targetMacro ? 2 : 1, { macro: targetMacro })
        }}
      </app-btn>
    </template>

    <QRReader
      v-if="cameraScanSource"
      v-model="cameraScanSource"
      @detected="handleQRCodeDetected"
    />
  </app-dialog>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import StateMixin from '@/mixins/state'
import { SocketActions } from '@/api/socketActions'
import type { MacroWithSpoolId, Spool } from '@/store/spoolman/types'
import BrowserMixin from '@/mixins/browser'
import QRReader from '@/components/widgets/spoolman/QRReader.vue'
import type { WebcamConfig } from '@/store/webcams/types'
import QrScanner from 'qr-scanner'
import type { AppDataTableHeader } from '@/types'
import getFilePaths from '@/util/get-file-paths'
import type { DataTableHeader } from 'vuetify'
import type { KlipperPrinterConfig } from '@/store/printer/types'
import type { AppFileWithMeta } from '@/store/files/types'
import type { SpoolmanRemainingFilamentUnit } from '@/store/config/types'

@Component({
  components: {
    QRReader
  }
})
export default class SpoolSelectionDialog extends Mixins(StateMixin, BrowserMixin) {
  search = ''
  selectedSpoolId: number | null = null

  cameraScanSource: null | string = null

  hasDeviceCamera = false

  async mounted () {
    this.hasDeviceCamera = await QrScanner.hasCamera()
  }

  @Watch('open')
  onOpen () {
    if (this.open) {
      this.selectedSpoolId = this.$store.state.spoolman.activeSpool ?? null
      if (this.targetMacro) {
        const macro: MacroWithSpoolId | undefined = this.$store.getters['macros/getMacroByName'](this.targetMacro)
        this.selectedSpoolId = macro?.variables.spool_id ?? null
      }

      if (this.currentFileName) {
        const { rootPath } = getFilePaths(this.currentFileName, 'gcodes')

        const directoryLoaded = rootPath in this.$store.state.files.pathFiles

        // Load the containing the currently printing file if we haven't done that already
        if (!directoryLoaded) {
          SocketActions.serverFilesGetDirectory(rootPath)
        }
      }

      if (this.hasDeviceCamera && this.preferDeviceCamera) {
        this.$nextTick(() => (this.cameraScanSource = 'device'))
      } else {
        const autoOpenCameraId = this.autoOpenQRDetectionCamera
        if (this.$store.getters['webcams/getWebcamById'](autoOpenCameraId)) {
          this.$nextTick(() => (this.cameraScanSource = autoOpenCameraId))
        }
      }
    }
  }

  get open (): boolean {
    return this.$store.state.spoolman.dialog.show
  }

  set open (val: boolean) {
    this.$store.commit('spoolman/setDialogState', {
      ...this.$store.state.spoolman.dialog,
      show: val
    })
  }

  get availableSpools () {
    const spools = []
    const availableSpools: Spool[] = this.$store.state.spoolman.availableSpools

    for (const spool of availableSpools) {
      if (spool.archived) {
        continue
      }

      const filamentName = spool.filament.vendor
        ? `${spool.filament.vendor.name} - ${spool.filament.name}`
        : spool.filament.name

      spools.push({
        ...spool,
        filament_name: filamentName,
        material: spool.filament.material
      })
    }

    return spools
  }

  get configurableHeaders (): AppDataTableHeader[] {
    const headers: AppDataTableHeader[] = [
      {
        text: this.$tc('app.spoolman.label.id'),
        value: 'id'
      },
      {
        text: this.$tc('app.spoolman.label.material'),
        value: 'material'
      },
      {
        text: this.$tc('app.spoolman.label.location'),
        value: 'location'
      },
      {
        text: this.$tc('app.spoolman.label.comment'),
        value: 'comment'
      },
      {
        text: this.$tc('app.spoolman.label.last_used'),
        value: 'last_used'
      },
    ]

    const mergedTableHeaders: AppDataTableHeader[] = this.$store.getters['config/getMergedTableHeaders'](headers, 'spoolman')

    return mergedTableHeaders
  }

  get headers (): DataTableHeader[] {
    return [
      {
        text: this.$tc('app.spoolman.label.filament_name'),
        value: 'filament_name'
      },
      ...this.configurableHeaders
        .filter(header => header.visible !== false)
    ]
  }

  get filename (): string | undefined {
    const filename: string | undefined = this.$store.state.spoolman.dialog.filename

    if (filename && filename.startsWith('/')) {
      return filename.slice(1)
    }

    return filename
  }

  get currentFileName (): string {
    return this.filename || this.$store.state.printer.printer.print_stats?.filename || ''
  }

  get currentFile (): AppFileWithMeta | undefined {
    const { filename, rootPath } = getFilePaths(this.currentFileName, 'gcodes')

    return this.$store.getters['files/getFile'](rootPath, filename)
  }

  get targetMacro (): string | undefined {
    return this.$store.state.spoolman.dialog.targetMacro
  }

  get enabledWebcams (): WebcamConfig[] {
    return this.$store.getters['webcams/getEnabledWebcams']
  }

  get availableCameras (): Pick<WebcamConfig, 'uid' | 'name'>[] {
    const cameras: Pick<WebcamConfig, 'uid' | 'name'>[] = this.enabledWebcams
      .filter(camera => camera.service !== 'iframe')

    if (this.hasDeviceCamera) {
      // always show device camera first
      cameras.unshift({
        name: this.$t('app.spoolman.label.device_camera').toString(),
        uid: 'device'
      })
    }

    return cameras
  }

  get remainingFilamentUnit (): SpoolmanRemainingFilamentUnit {
    return this.$store.state.config.uiSettings.spoolman.remainingFilamentUnit
  }

  handleQRCodeDetected (id: number) {
    this.cameraScanSource = null
    this.selectedSpoolId = id
    if (
      !this.availableSpools
        .filter(spool => this.filterResults('', this.search, spool))
        .some(spool => spool.id === id)
    ) {
      // clear filter if selected spool isn't in filter results
      this.search = ''
    }

    if (this.autoSelectSpoolOnMatch) {
      this.handleSelectSpool()
    }
  }

  async handleSelectSpool () {
    if (!this.selectedSpoolId) {
      // no spool selected

      const confirmation = await this.$confirm(
        this.$tc('app.spoolman.msg.no_spool'),
        { title: this.$tc('app.general.label.confirm'), color: 'card-heading', icon: '$warning' }
      )

      if (!confirmation) {
        return
      }
    }

    if (this.targetMacro) {
      // no need to run sanity checks or start a print when we target a macro, so we return early

      // set spool_id via SET_GCODE_VARIABLE
      const commands = [
        `SET_GCODE_VARIABLE MACRO=${this.targetMacro} VARIABLE=spool_id VALUE=${this.selectedSpoolId ?? 'None'}`
      ]

      const printerConfig: KlipperPrinterConfig = this.$store.getters['printer/getPrinterConfig']
      const supportsSaveVariables = printerConfig.save_variables
      if (supportsSaveVariables) {
        // persist selected spool across restarts
        commands.push(`SAVE_VARIABLE VARIABLE=${this.targetMacro.toLowerCase()}__spool_id VALUE=${this.selectedSpoolId ?? 'None'}`)
      }

      await SocketActions.printerGcodeScript(commands.join('\n'))

      const macro: MacroWithSpoolId | undefined = this.$store.getters['macros/getMacroByName'](this.targetMacro)
      if (macro?.variables.active) {
        // selected tool is active, update active spool
        await SocketActions.serverSpoolmanPostSpoolId(this.selectedSpoolId ?? undefined)
      }

      this.open = false
      return
    }

    const spool = this.availableSpools.find(spool => spool.id === this.selectedSpoolId)
    if (spool && this.currentFileName && (this.warnOnFilamentTypeMismatch || this.warnOnNotEnoughFilament)) {
      // trigger sanity checks when we have an active file
      // (current print or new print) and sanity checks are enabled.

      if (this.currentFile && (this.filename || !['complete', 'cancelled'].includes(this.printerState))) {
        // if we're tracking a file and starting a new print or the current one hasn't ended yet

        if (this.warnOnFilamentTypeMismatch) {
          const fileMaterials = this.currentFile.filament_type?.map(x => x.toLowerCase())
          const spoolMaterial = spool.filament.material?.toLowerCase()

          if (spoolMaterial && fileMaterials && !fileMaterials.includes(spoolMaterial)) {
            // filament materials don't match

            const confirmation = await this.$confirm(
              this.$tc('app.spoolman.msg.mismatched_filament'),
              { title: this.$tc('app.general.label.confirm'), color: 'card-heading', icon: '$warning' }
            )

            if (!confirmation) {
              return
            }
          }
        }

        let requiredLength = this.currentFile?.filament_total
        if (requiredLength && ['printing', 'paused'].includes(this.printerState)) {
          // if we're currently running a print job, subtract the already printed amount from the required length
          requiredLength -= this.$store.state.printer.printer.print_stats?.filament_used ?? 0
          requiredLength = Math.max(requiredLength, 0)
        }

        if (!requiredLength) {
          // missing file metadata

          const confirmation = await this.$confirm(
            this.$tc('app.spoolman.msg.no_required_length'),
            { title: this.$tc('app.general.label.confirm'), color: 'card-heading', icon: '$warning' }
          )

          if (!confirmation) {
            return
          }
        } else if (this.warnOnNotEnoughFilament) {
          let remainingLength = spool.remaining_length
          if (!remainingLength && spool.remaining_weight) {
            remainingLength = this.$filters.convertFilamentWeightToLength(spool.remaining_weight, spool.filament.density, spool.filament.diameter)
          }

          if (typeof remainingLength === 'number' && requiredLength >= remainingLength) {
            // not enough filament

            const confirmation = await this.$confirm(
              this.$tc('app.spoolman.msg.no_filament'),
              { title: this.$tc('app.general.label.confirm'), color: 'card-heading', icon: '$warning' }
            )

            if (!confirmation) {
              return
            }
          }
        }
      }
    }

    await SocketActions.serverSpoolmanPostSpoolId(this.selectedSpoolId ?? undefined)
    if (this.filename) {
      await SocketActions.printerPrintStart(this.filename)

      if (this.$route.name !== 'home') {
        this.$router.push({ name: 'home' })
      }
    }

    this.open = false
  }

  filterResults (value: string, query: string, item: Spool): boolean {
    query = query.toLowerCase()
    return [item.id, item.comment, item.filament.name, item.filament.material, item.filament.vendor?.name]
      .some(val => val?.toString().toLowerCase().includes(query))
  }

  get spoolmanURL (): string | undefined {
    return this.$store.state.server.config.spoolman?.server
  }

  get preferDeviceCamera () {
    return this.$store.state.config.uiSettings.spoolman.preferDeviceCamera
  }

  get autoOpenQRDetectionCamera (): string | null {
    return this.$store.state.config.uiSettings.spoolman.autoOpenQRDetectionCamera
  }

  get autoSelectSpoolOnMatch (): boolean {
    return this.$store.state.config.uiSettings.spoolman.autoSelectSpoolOnMatch
  }

  get warnOnNotEnoughFilament (): boolean {
    return this.$store.state.config.uiSettings.spoolman.warnOnNotEnoughFilament
  }

  get warnOnFilamentTypeMismatch (): boolean {
    return this.$store.state.config.uiSettings.spoolman.warnOnFilamentTypeMismatch
  }

  get sortOrder () {
    return this.$store.state.config.uiSettings.spoolman.selectionDialogSortOrder
  }

  handleSortOrderKeyChange (value?: string) {
    this.$store.dispatch('config/saveByPath', {
      path: 'uiSettings.spoolman.selectionDialogSortOrder.key',
      value: value ?? null,
      server: true
    })
  }

  handleSortOrderDescChange (value?: boolean) {
    this.$store.dispatch('config/saveByPath', {
      path: 'uiSettings.spoolman.selectionDialogSortOrder.desc',
      value: value ?? null,
      server: true
    })
  }
}
</script>
