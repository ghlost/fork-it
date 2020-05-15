import Vue from 'vue';
import Vuex from 'vuex';
const fb = require('../firebaseConfig.js');

Vue.use(Vuex);

// handle page reload
fb.auth.onAuthStateChanged(user => {
  if(user) {
    store.commit('setCurrentUser', user);
    store.dispatch('fetchUserProfile');

    fb.postsCollection.orderBy('createdOn', 'desc').onSnapshot(querySnapshot => {
      // check if created by currentUser
      let createdByCurrentUser;
      if(querySnapshot.docs.length) {
        createdByCurrentUser = store.state.currentUser.uid === querySnapshot.docChanges()[0].doc.data().userId;
      }

      // add new posts to hiddenPosts array after initial load
      if(querySnapshot.docChanges().length !== querySnapshot.docs.length &&
        querySnapshot.docChanges()[0].type === 'added' && !createdByCurrentUser) {
        const post = querySnapshot.docChanges()[0].doc.data();
        post.id = querySnapshot.docChanges()[0].doc.id;

        store.commit('setHiddenPosts', post);
      } else {
        const postsArray = [];

        querySnapshot.forEach(doc => {
          const post = doc.data();
          post.id = doc.id;
          postsArray.push(post);
        });

        store.commit('setPosts', postsArray);
      }
    });

    fb.usersCollection.doc(user.uid).onSnapshot(doc => {
      store.commit('setUserProfile', doc.data());
    });
  }
});

export const store = new Vuex.Store({
  state: {
    currentUser: null,
    hiddenPosts: [],
    posts: [],
    userProfile: {},
  },

  actions: {
    clearData({ commit }) {
      commit('setCurrentUser', null);
      commit('setUserProfile', {});
      commit('setPosts', null);
      // commit('setHiddenPosts', null);
    },

    fetchUserProfile({ commit, state }) {
      fb.usersCollection.doc(state.currentUser.uid).get().then(res => {
        commit('setUserProfile', res.data());
      }).catch(err => {
        console.log(err);
      });
    },

    updateProfile({ commit, state }, data) {
      const name = data.name;
      const title = data.title;

      fb.usersCollection.doc(state.currentUser.uid).update({ name, title }).then(user => {
        // update all posts by user to reflect new name
        fb.postsCollection.where('userId', '==', state.currentUser.uid).get().then(docs => {
          docs.forEach(doc => {
            fb.postsCollection.doc(doc.id).update({
              userName: name
            });
          });
        });
        // update all comments by user to reflect new name
        fb.commentsCollection.where('userId', '==', state.currentUser.uid).get().then(docs => {
          docs.forEach(doc => {
            fb.commentsCollection.doc(doc.id).update({
              userName: name
            });
          });
        });
      }).catch(err => {
        console.log(err);
      });
    }
  },

  mutations: {
    setCurrentUser(state, val) {
      state.currentUser = val;
    },

    setHiddenPosts(state, val) {
      if(val) {
        // make sure not to add duplicates
        if(!state.hiddenPosts.some(x => x.id === val.id)) {
          state.hiddenPosts.unshift(val);
        }
      } else {
        state.hiddenPosts = [];
      }
    },

    setPosts(state, val) {
      state.posts = val;
    },

    setUserProfile(state, val) {
      state.userProfile = val;
    },
  }
});
