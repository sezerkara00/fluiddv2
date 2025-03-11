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

@Component({})
export default class DenemeLogin extends Vue {
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
    this.$router.push({ name: 'home' })
  }

  goToLogin () {
    this.$router.push({ name: 'login' })
  }

  mounted () {
    // Önce içeriği göster
    this.showContent = true

    // 1 saniye sonra yönlendir
    setTimeout(() => {
      if (!this.isTrustedUser) {
        this.goToHome()
      }
    }, 500)
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
