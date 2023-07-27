import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/scss/app.scss';
import { auth } from './firebase';
// const firebase = require('./firebaseConfig.js');

Vue.config.productionTip = false;

// handle page reloads
let app;
auth.onAuthStateChanged(user => {
  if(!app) {
    app = create(app).mount('#app');
    app.user(store);
  }

  if(user) {
    store.dispatch('fetchUserProfile', user);
  }
});
