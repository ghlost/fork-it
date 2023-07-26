<template>
  <div id="dashboard">
    <section>
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
import RecipeDetail from '@/components/RecipeDetail'
import { mapState } from 'vuex'
import moment from 'moment'

export default {
  components: {
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
      this.$store.dispatch('fetchUserRecipes', this.$route.params.handle);
    },
  },
  filters: {
    formatDate(val) {
      if (!val) { return '-' }

      let date = val.toDate()
      return moment(date).fromNow()
    },
    trimLength(val) {
      if (val.length < 200) { return val }
      return `${val.substring(0, 200)}...`
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
