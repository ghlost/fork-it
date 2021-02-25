<template>
  <div id="recipes">
    <section>
      <div class="col1">
        <div class="profile">
        </div>
      </div>
      <div class="col2">
        <div v-if="!!recipe">
          <recipe-detail :recipe="recipe"></recipe-detail>
        </div>
        <div v-else>
          <p class="no-results">There are currently no recipes</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
// import RecipeBlock from '@/components/RecipeBlock'
import RecipeDetail from '@/components/RecipeDetail'
import { mapState } from 'vuex'

export default {
  components: {
    RecipeDetail,
    // RecipeBlock,
  },
  data() {
    const data = {};
    return data;
  },
  computed: {
    ...mapState(['userProfile', 'recipes', 'recipe'])
  },
  created: function() {
    this.fetchRecipe();
  },
  methods: {
    fetchRecipe() {
      this.$store.dispatch('fetchRecipe', this.$route.params.id);
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
