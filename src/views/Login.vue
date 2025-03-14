<template>
  <v-row
    :dense="$vuetify.breakpoint.smAndDown"
    justify="center"
    align="center"
  >
    <v-col
      cols="12"
      md="4"
      lg="3"
      xl="2"
    >
      <div v-if="userCount > 0">
        <v-card>
          <v-card-title>Forgot your password?</v-card-title>
          <v-card-text>
            <v-btn
              block
              large
              color="primary"
              @click="switchToAdmin"
            >
              Login as admin
            </v-btn>
          </v-card-text>
          <!-- <v-btn
            block
            large
            color="primary"
            @click="admin_add_user"
          >
            Admin Ekle
          </v-btn> -->
        </v-card>
      </div>

      <!-- Kullanıcı Sayısı 1'den Fazlaysa Standart Giriş Ekranı -->
      <div>
        <v-divider v-if="users.length > 0" class="my-4" />

        <v-form @submit.prevent="handleLogin">
          <div class="text-center">
            <p v-html="$t('app.general.msg.welcome_back')" />

            <v-text-field
              v-model="username"
              :label="$t('app.general.label.username')"
              autocomplete="username"
              spellcheck="false"
              filled
              dense
              hide-details="auto"
              :disabled="loading"
              class="mb-4"
            />

            <v-text-field
              v-model="password"
              :label="$t('app.general.label.password')"
              autocomplete="current-password"
              filled
              dense
              type="password"
              hide-details="auto"
              :disabled="loading"
              class="mb-4"
            />

            <!-- <v-select
              v-if="userCount > 1"
              v-model="source"
              :label="$t('app.general.label.auth_source')"
              filled
              dense
              hide-details="auto"
              :disabled="loading"
              :items="availableSources.map(value => ({ text: $t(`app.general.label.${value}`), value }))"
              class="mb-4"
            /> -->

            <app-btn
              type="submit"
              :disabled="loading"
              large
              block
              class="mb-6"
            >
              <v-icon v-if="loading" class="spin mr-2">
                $loading
              </v-icon>
              {{ $t('app.general.btn.login') }}
            </app-btn>
          </div>
        </v-form>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { appInit } from '@/init'
import { consola } from 'consola'
import type { InstanceConfig } from '@/store/config/types'
import type { AppUser } from '@/store/auth/types'

@Component({})
export default class Login extends Vue {
  username = ''
  password = ''
  error = false
  loading = false
  source = 'moonraker'
  availableSources = [this.source]
  selectedUser = ''

  get users (): AppUser[] {
    return this.$store.state.auth.users.filter((user: AppUser) =>
      user.username !== '_API__API_KEY_USER_USER_' &&
      user.username !== '_TRUSTED_USER_' &&
      user.username !== this.$store.state.auth.currentUser?.username
    )
  }

  get userCount () {
    return this.users.length
  }

  async switchToAdmin () {
    this.username = 'admin'
    this.password = ''
    await this.handleLogin()
  }

  async switchToUser () {
    if (this.selectedUser) {
      this.username = this.selectedUser
      const passwordField = this.$el.querySelector('input[type="password"]') as HTMLInputElement
      if (passwordField) {
        passwordField.focus()
      }
    }
  }

  async mounted () {
    const authInfo = await this.$store.dispatch('auth/getAuthInfo')
    this.source = authInfo.defaultSource ?? this.source
    this.availableSources = authInfo.availableSources ?? this.availableSources
  }

  get isTrustedUser (): boolean {
    return this.$store.state.auth.currentUser?.username === '_TRUSTED_USER_'
  }

  async handleLogin () {
    this.error = false
    this.loading = true
    try {
      await this.$store.dispatch('auth/login', { username: this.username, password: this.password, source: this.source })
    } catch {
      this.error = true
    }
    this.loading = false

    if (!this.error) {
      const instance: InstanceConfig = this.$store.getters['config/getCurrentInstance']
      const config = await appInit(instance, this.$store.state.config.hostConfig)

      if (config.apiConnected && config.apiAuthenticated) {
        consola.debug('Activating socket with config', config)
        this.$socket.connect(config.apiConfig.socketUrl)
      }
    }
  }
}
</script>
