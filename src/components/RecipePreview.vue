<template>
  <div class="c-recipe">
    <h4>{{ recipe.name }}</h4>
    <h5>{{ recipe.userName }}</h5>
    <span>{{ recipe.published | formatDate }}</span>
    <p v-if="recipe.description">{{ recipe.description | trimLength }}</p>
    <p v-if="recipe.ingredients">{{ recipe.ingredients | trimLength }}</p>
    <p v-if="recipe.instructions">{{ recipe.instructions | trimLength }}</p>
  </div>
</template>

<script>
import { commentsCollection, postsCollection, auth } from '@/firebase'
import moment from 'moment'

export default {
  props: ['recipe'],
  data() {
    return {
      // comment: ''
    }
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
