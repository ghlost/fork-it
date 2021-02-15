<template>
  <div class="recipe">
    <h4 class="recipe__title">{{ recipe.name }}</h4>
    <h5 class="recipe__username">{{ recipe.userName }}</h5>
    <p class="recipe__time">{{ recipe.published | formatDate }}</p>
    <p class="recipe__description" v-if="recipe.description">{{ recipe.description | trimLength }}</p>
    <div class="recipe__ingredients ingredients" v-if="recipe.ingredients">
      <h5 class="ingredients__heading">Ingredients</h5>
      <ul class="ingredients__set">
        <li class="ingredients__item" v-for="(ingredient, index) in formattedIngredients" :key="index">{{ingredient}}</li>
      </ul>
    </div>
    <div class="recipe__instructions instructions" v-if="recipe.instructions">
      <h5 class="instructions__heading">Instructions</h5>
      <ol class="instructions__set">
        <li class="instructions__item" v-for="(instruction, index) in formattedInstructions" :key="index">{{instruction}}</li>
      </ol>
    </div>
  </div>
</template>

<script>
import { commentsCollection, postsCollection, auth } from '@/firebase'
import moment from 'moment'

export default {
  props: ['recipe'],
  data() {
    const data = {};
    return data;
  },
  computed: {
    formattedIngredients() {
      const ingredients = this.recipe.ingredients.split('\n');
      return ingredients
    },

    formattedInstructions() {
      const instructionsArray = this.recipe.instructions.split('\n').map(item => {
        return this.formatInstruction(item);
      });

      return instructionsArray;
    },
  },
  methods: {
    async addComment() {
      // create comment
      await commentsCollection.add({
        createdOn: new Date(),
        content: this.comment,
        postId: this.post.id,
        userId: auth.currentUser.uid,
        userName: this.$store.state.userProfile.name
      })

      // update comment count on post
      await postsCollection.doc(this.post.id).update({
        comments: parseInt(this.post.comments) + 1
      })

      // close modal
      this.$emit('close')
    },
    formatInstruction(instruction) {
      // let formatting = `/^\d(\.|\)|\.\)|\)\.)?\s/gm`;
      const formatting = /^\d+[.)]*\s+/gm;

      const updatedInstruction = instruction.replace(formatting, '');
      return updatedInstruction;
    }
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

<style lang="scss">
.recipe {
  &__time {
    font-size: 10px;
  }
}

.ingredients {
  &__item {
    margin-bottom: 10px;
  }
}

.instructions {
  &__item {
    margin-bottom: 10px;
  }
}
</style>
