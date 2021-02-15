<template>
  <div id="recipes">
    <section>
      <div class="col1">
        <div class="profile">
          <h4>Recipes</h4>
        </div>
        <form @submit.prevent="createRecipe">
          <input v-model.trim="recipe.name" placeholder="Name" required/>
          <textarea v-model.trim="recipe.description" placeholder="Description" required></textarea>
          <textarea v-model.trim="recipe.ingredients" placeholder="Ingredients" required></textarea>
          <textarea v-model.trim="recipe.instructions" placeholder="Instructions" required></textarea>
          <button class="button">Post Recipe</button>
        </form>
      </div>
    </section>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  components: {},
  data() {
    return {
      recipe: {
        description: '',
        ingredients: '',
        name: '',
      },
    }
  },
  computed: {},
  methods: {
    createRecipe() {
      this.$store.dispatch('createRecipe', {
        description: this.recipe.description,
        name: this.recipe.name,
        ingredients: this.recipe.ingredients,
        instructions: this.recipe.instructions,
        // ...this.recipe maybe?
      })
      this.recipe.description = ''
      this.recipe.name = ''
      this.recipe.ingredients = ''
      this.recipe.instructions = ''
      this.$router.push('/recipes');
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
