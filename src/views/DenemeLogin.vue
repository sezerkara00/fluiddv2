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
      <div class="text-center">
        <v-card
          class="pa-4"
          :class="{ 'fade-in': showContent }"
        >
          <h2 class="mb-4">Welcome</h2>

          <!-- Sadece trusted user için login butonu göster -->
          <div v-if="isTrustedUser">
            <p>You are not logged in</p>
            <app-btn
              block
              large
              color="blue"
              @click="goToLogin"
            >
              Go to Login
            </app-btn>
          </div>
          <div v-else>
            <p>You are logged in as: {{ currentUsername }}</p>
            <app-btn
              block
              large
              color="warning"
              @click="goToHome"
            >
              Go to Home
            </app-btn>
          </div>
        </v-card>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import type { AppUser } from '@/store/auth/types'

@Component({})
export default class DenemeLogin extends Vue {
  get users (): AppUser[] {
    return this.$store.state.auth.users
  }

  async ensureAdminUser () {
    const admins = this.users.filter(user => user.username === 'admin')

    if (admins.length === 0) {
      // Eğer admin yoksa otomatik ekle
      const adminUser: AppUser = {
        username: 'admin',
        password: 'admin123',
        source: 'system'
      }
      await this.$store.dispatch('auth/addUser', adminUser)
      console.log('Admin user added')
    }
  }

  showContent = false

  get currentUsername (): string {
    return this.$store.state.auth.currentUser?.username || ''
  }

  get isTrustedUser (): boolean {
    return this.currentUsername === '_TRUSTED_USER_'
  }

  get isAuthenticated (): boolean {
    return this.$store.state.auth.authenticated
  }

  goToHome () {
    this.$router.replace({ name: 'home' })
  }

  async goToLogin () {
    await this.$store.dispatch('auth/logout')
    this.$router.replace({ name: 'login' })
  }

  mounted () {
    // Önce içeriği göster
    this.showContent = true

    // 1 saniye sonra yönlendir
    setTimeout(() => {
      if (!this.isTrustedUser) {
        this.goToHome()
      } else {
        this.goToLogin()
      }
    }, 1500)
    this.ensureAdminUser()
  }
}
</script>

<style scoped>
.fade-in {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
