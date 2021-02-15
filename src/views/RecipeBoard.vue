<template>
  <div id="recipes">
    <section>
      <div class="col1">
        <div class="profile">
          <h4>Recipes</h4>
          <h5>{{ userProfile.name }}</h5>
          <p>{{ userProfile.title }}</p>
          <p>{{ userProfile.id }}</p>
          <p><router-link to="/recipe/create">Create a recipe</router-link></p>
        </div>
      </div>
      <div class="col2">
        <div v-if="recipes.length">
          <div v-for="recipe in recipes" :key="recipe.id" class="post">
            <!-- <recipe-preview :recipe="recipe"></recipe-preview> -->
            <recipe-detail :recipe="recipe"></recipe-detail>
          </div>
        </div>
        <div v-else>
          <p class="no-results">There are currently no recipes</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
// import RecipePreview from '@/components/RecipePreview'
import RecipeDetail from '@/components/RecipeDetail'
import { mapState } from 'vuex'

export default {
  components: {
    // RecipePreview
    RecipeDetail
  },
  data() {
    return {
      recipe: {
        description: '',
        ingredients: '',
        name: '',
      },
    }
  },
  computed: {
    ...mapState(['userProfile', 'recipes'])
  },
  created: function() {
    this.fetchUserRecipes();
  },
  methods: {
    fetchUserRecipes() {
      this.$store.dispatch('fetchUserRecipes')
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
