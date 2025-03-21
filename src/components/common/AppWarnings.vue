<template>
  <v-alert
    text
    dense
    icon="$warning"
    type="warning"
    class="ma-0"
  >
    <template v-if="printerWarnings.length > 0">
      <div class="mb-2">
        {{ $t('app.general.error.app_warnings_found', { appName }) }}
      </div>
      <ul class="mb-4">
        <li
          v-for="(warning, index) in printerWarnings"
          :key="index"
          v-html="linkExternalUrls(warning)"
        />
      </ul>
    </template>

    <template v-if="klipperWarnings.length > 0">
      <div class="mb-2">
        {{ $t('app.general.error.app_warnings_found', { appName: 'Klipper' }) }}
      </div>
      <ul class="mb-4">
        <li
          v-for="(warning, index) in klipperWarnings"
          :key="index"
          v-html="linkExternalUrls(warning.message)"
        />
      </ul>
    </template>

    <template v-if="moonrakerFailedComponents.length > 0">
      <div class="mb-2">
        {{ $t('app.general.error.failed_components') }}
      </div>
      <ul class="mb-4">
        <li
          v-for="(failedComponent, index) in moonrakerFailedComponents"
          :key="index"
          v-html="linkExternalUrls(failedComponent)"
        />
      </ul>
    </template>

    <template v-if="moonrakerWarnings.length > 0">
      <div class="mb-2">
        {{ $t('app.general.error.app_warnings_found', { appName: 'Moonraker' }) }}
      </div>
      <ul class="mb-4">
        <li
          v-for="(warning, index) in moonrakerWarnings"
          :key="index"
          v-html="linkExternalUrls(warning)"
        />
      </ul>
    </template>

    <div v-if="printerWarnings.length > 0">
      <span v-html="printerWarningsTxt" />
    </div>
    <div v-if="moonrakerFailedComponents.length > 0">
      <span v-html="moonrakerFailedComponentsTxt" />
    </div>
  </v-alert>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import StateMixin from '@/mixins/state'
import { Globals } from '@/globals'
import linkExternalUrls from '@/util/link-external-urls'
import type { KlipperPrinterConfigFileWarningState } from '@/store/printer/types'

@Component({
  components: {}
})
export default class AppWarnings extends Mixins(StateMixin) {
  get docsUrl () {
    return Globals.DOCS_REQUIRED_CONFIGURATION
  }

  get moonrakerDocsUrl () {
    return Globals.DOCS_MOONRAKER_COMPONENTS
  }

  get printerWarningsTxt () {
    return this.$t('app.general.error.app_setup_link', {
      url: this.docsUrl
    })
  }

  get moonrakerFailedComponentsTxt () {
    return this.$t('app.general.error.components_config', {
      url: this.moonrakerDocsUrl
    })
  }

  get appName () {
    return 'Layerstec/M1pro'
  }

  get printerWarnings (): string[] {
    return this.$store.getters['printer/getPrinterWarnings']
  }

  get klipperWarnings (): KlipperPrinterConfigFileWarningState[] {
    return this.$store.getters['printer/getKlipperWarnings']
  }

  get moonrakerFailedComponents (): string[] {
    return this.$store.getters['printer/getMoonrakerFailedComponents']
  }

  get moonrakerWarnings (): string[] {
    return this.$store.getters['printer/getMoonrakerWarnings']
  }

  linkExternalUrls = linkExternalUrls
}
</script>
