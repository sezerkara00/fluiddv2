<template>
  <v-row
    :dense="$vuetify.breakpoint.smAndDown"
    justify="center"
    align="center"
  >
    <v-col>
      <center>
        <div class="text-h5">
          {{ $t('app.general.title.not_found') }}
        </div>
        <app-btn
          to="/"
          class="mt-5"
          @click="goToHome"
        >
          {{ $t('app.general.btn.return_dashboard') }}
        </app-btn>
      </center>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class NotFound extends Vue {
  mounted () {
    setTimeout(() => {
      this.$router.push('/home')
    }, 2000)
  }

  goToHome () {
    this.$router.push('/home')
  }
}
</script>
