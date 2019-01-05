<template>
  <form @submit.prevent="onSave">
    <AppControlInput v-model="editedPost.author">Author Name</AppControlInput>

    <AppControlInput v-model="editedPost.title">Title</AppControlInput>

    <AppControlInput v-model="editedPost.thumbnail">Thumbnail Link</AppControlInput>

    <AppControlInput v-model="editedPost.content" control-type="textarea">Content</AppControlInput>
    <AppControlInput v-model="editedPost.previewText" control-type="textarea">Preview text</AppControlInput>

    <AppButton type="submit">Save</AppButton>

    <AppButton type="button" style="margin-left: 10px" btn-style="cancel" @click="onCancel">Cancel</AppButton>
  </form>
</template>

<script>
export default {
  props: {
    post: {
      type: Object,
      default: () => ({
        author: '',
        title: '',
        content: '',
        thumbnail: '',
        previewText: ''
      })
    }
  },
  data() {
    return {
      editedPost: { ...this.post }
    }
  },
  methods: {
    onSave() {
      this.$emit('submit', this.editedPost)
    },
    onCancel() {
      this.$router.push('/admin')
    }
  }
}
</script>

<style scoped>
</style>
