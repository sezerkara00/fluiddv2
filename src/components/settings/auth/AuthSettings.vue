<template>
  <div>
    <v-subheader id="auth">
      {{ $t('app.setting.title.authentication') }}
    </v-subheader>
    <v-card :elevation="5" dense class="mb-4">
      <app-setting>
        <app-btn
          outlined
          small
          color="primary"
          class="mr-2"
          @click="handleApiKeyDialog"
        >
          <v-icon small left> $edit </v-icon>
          {{ $t('app.general.label.api_key') }}
        </app-btn>

        <app-btn
          outlined
          small
          color="primary"
          class="mr-2"
          @click="handleAddUserDialog"
        >
          <v-icon small left> $plus </v-icon>
          {{ $t('app.setting.btn.add_user') }}
        </app-btn>

        <!-- <app-btn outlined small color="primary" @click="logAllUsers">
          <v-icon small left> $console </v-icon>
          Kullanıcıları Yazdır
        </app-btn> -->
      </app-setting>

      <v-divider v-if="users.length > 0" />

      <template v-for="(user, i) in users">
        <app-setting
          :key="`user-${user.username}`"
          :sub-title="
            user.username === currentUser
              ? $t('app.general.label.current_user')
              : user.source !== 'moonraker'
              ? $t('app.general.label.user_managed_source', {
                  source: $t(`app.general.label.${user.source}`),
                })
              : undefined
          "
          :r-cols="3"
        >
          <template #title> {{ user.username }} </template>

          <app-btn
            v-if="user.username !== 'admin'"
            :disabled="user.username === currentUser || user.source !== 'moonraker'"
            icon
            @click.stop="handleRemoveUser(user)"
          >
            <v-icon dense> $delete </v-icon>
          </app-btn>

          <app-btn
            v-if="user.username !== currentUser"
            icon
            color="success"
            @click.stop="switchToUser(user)"
          >
            <v-icon dense> $check </v-icon>
          </app-btn>
        </app-setting>

        <v-divider v-if="i < users.length - 1" :key="`divider-${user.username}`" />
      </template>

      <user-config-dialog
        v-if="userDialogState.open"
        v-model="userDialogState.open"
        :user="userDialogState.user"
        @save="userDialogState.handler"
      />

      <api-key-dialog v-if="apiKeyDialogState.open" v-model="apiKeyDialogState.open" />

      <user-login-dialog
        v-if="loginDialogState.open"
        v-model="loginDialogState.open"
        :username="loginDialogState.username"
        @success="onLoginSuccess"
      />
    </v-card>
  </div>
</template>
<script lang="ts">
import type { AppUser } from '@/store/auth/types'
import { Component, Vue } from 'vue-property-decorator'
import UserConfigDialog from './UserConfigDialog.vue'
import ApiKeyDialog from './ApiKeyDialog.vue'
import UserLoginDialog from './UserLoginDialog.vue'

@Component({
  components: {
    UserConfigDialog,
    ApiKeyDialog,
    UserLoginDialog
  }
})
export default class AuthSettings extends Vue {
  userDialogState: any = {
    open: false,
    user: null,
    handler: null
  }

  apiKeyDialogState: any = {
    open: false
  }

  loginDialogState = {
    open: false,
    username: ''
  }

  get users (): AppUser[] {
    return this.$store.state.auth.users
  }

  get currentUser () {
    const currentUser: AppUser | null = this.$store.state.auth.currentUser
    return currentUser?.username ?? ''
  }

  async mounted () {

  }

  handleApiKeyDialog () {
    this.apiKeyDialogState.open = true
  }

  handleAddUserDialog () {
    this.userDialogState = {
      open: true,
      user: { username: '', password: '' },
      handler: this.handleSaveUser
    }
  }

  async handleRemoveUser (user: AppUser) {
    const result = await this.$confirm(
      this.$t('app.general.simple_form.msg.confirm_remove_user', { username: user.username }).toString(),
      { title: this.$tc('app.general.label.confirm'), color: 'card-heading', icon: '$error' }
    )

    if (result) {
      await this.$store.dispatch('auth/removeUser', user)
    }
  }

  async handleSaveUser (user: AppUser) {
    if (user.username === 'admin') {
      this.$store.dispatch('notifications/pushNotification', {
        title: 'Hata',
        text: 'Admin kullanıcısı eklenemez!',
        type: 'error'
      })
      return
    }

    await this.$store.dispatch('auth/addUser', user)
    if (this.users.length === 0) this.$store.dispatch('auth/checkTrust')
  }

  // logAllUsers () {
  //   console.log('All users:', this.users)
  // }

  async switchToUser (user: AppUser) {
    this.loginDialogState = {
      open: true,
      username: user.username
    }
  }

  async onLoginSuccess () {
    this.$store.dispatch('notifications/pushNotification', {
      title: this.$tc('app.general.label.success'),
      text: `${this.loginDialogState.username} set as current user`,
      type: 'success'
    })
  }
}
</script>
