import Vue from 'vue';
import App from './App.vue';
import router from './router';
import { store } from './store';
import './assets/scss/app.scss';

const firebase = require('./firebaseConfig.js');

Vue.config.productionTip = false;

// handle page reloads
let app;

firebase.auth.onAuthStateChanged(user => {
  if (!app) {
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app');
  }
});
