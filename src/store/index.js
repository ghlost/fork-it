import Vue from 'vue'
import Vuex from 'vuex'
import * as fb from '../firebase'
import router from '../router/index'

Vue.use(Vuex)

// realtime firebase
fb.postsCollection.orderBy('createdOn', 'desc').onSnapshot(snapshot => {
  let postsArray = []

  snapshot.forEach(doc => {
    let post = doc.data()
    post.id = doc.id

    postsArray.push(post)
  })

  store.commit('setPosts', postsArray)
})

fb.recipesCollection.orderBy('published', 'desc').onSnapshot(snapshot => {
  let recipeArray = []

  snapshot.forEach(doc => {
    let recipe = doc.data()
    recipe.id = doc.id

    recipeArray.push(recipe)
  })

  store.commit('setRecipes', recipeArray)
})

const store = new Vuex.Store({
  state: {
    userProfile: {},
    posts: [],
    recipes: [],
    recipe: {},
  },
  mutations: {
    setUserProfile(state, val) {
      state.userProfile = val;
    },
    setPerformingRequest(state, val) {
      state.performingRequest = val;
    },
    setPosts(state, val) {
      state.posts = val;
    },
    setRecipes(state, val) {
      state.recipes = val;
    },
    setRecipe(state, val) {
      state.recipe = val;
    }
  },
  actions: {
    async login({ dispatch }, form) {
      // sign user in
      const { user } = await fb.auth.signInWithEmailAndPassword(form.email, form.password)

      // fetch user profile and set in state
      dispatch('fetchUserProfile', user)
    },
    async signup({ dispatch }, form) {
      // check for existing handle
      console.log(form.handle);
      const querySnapshot = await fb.usersCollection.where('handle', '==', form.handle).get();
      console.log(querySnapshot.docs);
      if (querySnapshot.empty) {
        // The querySnapshot contains the matching documents
        // You can access the first user (if multiple found) using querySnapshot.docs[0]

        // sign user up
        const { user } = await fb.auth.createUserWithEmailAndPassword(form.email, form.password)

        // create user object in usersCollections
        await fb.usersCollection.doc(user.uid).set({
          name: form.name,
          handle: form.handle
        })

        // fetch user profile and set in state
        dispatch('fetchUserProfile', user)

        return Promise.resolve('User created')
      } else {
        // Matching handle found
        // error?
        // how to return an error and display it
        return Promise.reject(new Error('fail'));
      }
    },
    async fetchUserProfile({ commit }, user) {
      // fetch user profile
      const userProfile = await fb.usersCollection.doc(user.uid).get()

      // set user profile in state
      commit('setUserProfile', userProfile.data())

      // change route to dashboard
      if (router.currentRoute.path === '/login') {
        router.push('/')
      }
    },
    /**
     * fetchRecipesFromUserId
     * @param {Object} {commit}
     * @param {string} userId 
     */
    async fetchRecipesFromUserId({commit}, userId) {
      const recipes = await fb.recipesCollection.where('userId', '==', userId)
        .get()
        .then((querySnapshot) => {
          let recipeArray = [];
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            let recipe = doc.data()

            recipeArray.push(recipe);
          });

          commit('setRecipes', recipeArray)
        });
    },
    /**
     * fetchUserRecipes - using the handle, get the users recipes in an array
     * @param {Object} {commit, dispatch}
     * @param {string} userId 
     */
    async fetchUserRecipes({ dispatch, commit }, handle) {
      // fetch user profile
      const userProfile = await fb.usersCollection.where('handle', '==', handle)
        .get()
        .then((userSnapshot) => {
          if (userSnapshot.size > 0) {
            dispatch('fetchRecipesFromUserId', userSnapshot.docs[0].id)
          } else {
            commit('setRecipes', []);
          }
        })
    },
    /**
     * fetchCurrentUserRecipes - using the current logged in user 
     * get the users recipes in an array
     * @param {Object} {commit, dispatch}
     * @param {string} userId
     */
    async fetchCurrentUserRecipes({ commit, dispatch }) {
      // fetch user profile
      const userId = fb.auth.currentUser.uid;
      
      await dispatch('fetchRecipesFromUserId', userId)
    },
    async fetchRecipe({commit}, id) {
      await fb.recipesCollection.doc(id).get().then((doc) => {
        commit('setRecipe', doc.data());
      });
    },
    async logout({ commit }) {
      // log user out
      await fb.auth.signOut()

      // clear user data from state
      commit('setUserProfile', {})

      // redirect to login view
      router.push('/login')
    },
    async createPost({ state, commit }, post) {
      // create post in firebase
      await fb.postsCollection.add({
        createdOn: new Date(),
        content: post.content,
        userId: fb.auth.currentUser.uid,
        userName: state.userProfile.name,
        comments: 0,
        likes: 0
      })
    },
    async createRecipe({ state, commit }, recipe) {
      // create post in firebase
      await fb.recipesCollection.add({
        published: new Date(),
        description: recipe.description,
        userId: fb.auth.currentUser.uid,
        userName: state.userProfile.name,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        name: recipe.name,
      })
    },
    async likePost ({ commit }, post) {
      const userId = fb.auth.currentUser.uid
      const docId = `${userId}_${post.id}`

      // check if user has liked post
      const doc = await fb.likesCollection.doc(docId).get()
      if (doc.exists) { return }

      // create post
      await fb.likesCollection.doc(docId).set({
        postId: post.id,
        userId: userId
      })

      // update post likes count
      fb.postsCollection.doc(post.id).update({
        likes: post.likesCount + 1
      })
    },
    async updateProfile({ dispatch }, user) {
      const userId = fb.auth.currentUser.uid
      // update user object
      const userRef = await fb.usersCollection.doc(userId).update({
        name: user.name,
        handle: user.handle
      })

      dispatch('fetchUserProfile', { uid: userId })

      // update all posts by user
      const postDocs = await fb.postsCollection.where('userId', '==', userId).get()
      postDocs.forEach(doc => {
        fb.postsCollection.doc(doc.id).update({
          userName: user.name
        })
      })

      // update all comments by user
      const commentDocs = await fb.commentsCollection.where('userId', '==', userId).get()
      commentDocs.forEach(doc => {
        fb.commentsCollection.doc(doc.id).update({
          userName: user.name
        })
      })
    }
  }
})

export default store
