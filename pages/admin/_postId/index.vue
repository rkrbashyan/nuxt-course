<template>
  <div class="admin-post-page">
    <section class="update-form">
      <AdminPostForm :post="loadedPost" @submit="updatePost"/>
    </section>
  </div>
</template>

<script>
import AdminPostForm from '@/components/Admin/AdminPostForm'
import axios from '@/api/axios'

export default {
  layout: 'admin',
  middleware: ['check-auth', 'auth'],
  components: {
    AdminPostForm
  },
  // asyncData return object which will be merge with components data object
  asyncData(context) {
    return axios
      .get('posts/' + context.params.postId)
      .then(response => ({
        loadedPost: response.data
      }))
      .catch(e => context.error(e))
  },
  methods: {
    updatePost(post) {
      this.$store.dispatch('updatePost', post).then(() => this.$router.push('/admin'))
    }
  }
}
</script>

<style scoped>
.update-form {
  width: 90%;
  margin: 20px auto;
}
@media (min-width: 768px) {
  .update-form {
    width: 500px;
  }
}
</style>
