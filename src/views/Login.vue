<template>
  <div id="login">
    <PasswordReset v-if="showPasswordReset" @close="togglePasswordReset()"></PasswordReset>
    <section>
      <div class="col1">
        <h1>Vuegram</h1>
        <p>Welcome to the <a href="https://savvyapps.com/" target="_blank">Savvy Apps</a> sample social media web app powered by Vue.js and Firebase.
          Build this project by checking out The Definitive Guide to Getting Started with Vue.js</p>
      </div>
      <div :class="{ 'signup-form': !showLoginForm }" class="col2">
        <form v-if="showLoginForm" @submit.prevent>
          <h1>Welcome Back</h1>
          <div>
            <label for="email1">Email</label>
            <input v-model.trim="loginForm.email" type="text" placeholder="you@email.com" id="email1" />
          </div>
          <div>
            <label for="password1">Password</label>
            <input v-model.trim="loginForm.password" type="password" placeholder="******" id="password1" />
          </div>
          <button @click="login()" class="button">Log In</button>
          <div class="extras">
            <a @click="togglePasswordReset()">Forgot Password</a>
            <a @click="toggleForm()">Create an Account</a>
          </div>
        </form>
        <form v-else @submit.prevent>
          <h1>Get Started</h1>
          <label v-for="(message, index) in errorMessages" :key=index>{{message}}</label>
          <label for="name">Name</label>
          <input v-model.trim="signupForm.name" type="text" placeholder="Name" id="name" />
          <label for="handle">Handle</label>
          <input v-model.trim="signupForm.handle" type="text" placeholder="Unique display name" id="handle" />
          <label for="email2">Email</label>
          <input v-model.trim="signupForm.email" type="text" placeholder="you@email.com" id="email2" />
          <label for="password2">Password</label>
          <input v-model.trim="signupForm.password" type="password" placeholder="min 6 characters" id="password2" />
          <button @click="signup()" class="button">Sign Up</button>
          <div class="extras">
            <a @click="toggleForm()">Back to Log In</a>
          </div>
        </form>
      </div>
    </section>
  </div>
</template>

<script>
import PasswordReset from '@/components/PasswordReset'

export default {
  components: {
    PasswordReset
  },
  data() {
    return {
      loginForm: {
        email: '',
        password: ''
      },
      signupForm: {
        name: '',
        email: '',
        password: ''
      },
      showLoginForm: true,
      showPasswordReset: false,
      showError: false,
      errorMessages: []
    }
  },
  methods: {
    toggleForm() {
      this.showLoginForm = !this.showLoginForm
    },
    togglePasswordReset() {
      this.showPasswordReset = !this.showPasswordReset
    },
    login() {
      this.$store.dispatch('login', {
        email: this.loginForm.email,
        password: this.loginForm.password
      })
    },
    signup() {
      this.$store.dispatch('signup', {
        email: this.signupForm.email,
        password: this.signupForm.password,
        name: this.signupForm.name,
        handle: this.signupForm.handle
      }).then((msg) => {
        // resolved
        this.showError = false;
        this.errorMessages = [];
        console.log(msg);
      }, (msg) => {
        // rejected
        this.showError = true;
        this.errorMessages.push('This handle has already been taken, please choose something else');
        console.log(msg);
      })
    }
  }
}
</script>
