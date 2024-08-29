<template>
  <uploadImage v-if="uploadType === 'image'" v-bind="$attrs" />
</template>

<script setup lang="ts">
import uploadImage from './upload-image.vue'
const props = defineProps({
  uploadType: {
    type: String,
    default: 'image'
  }
})
</script>

<style lang="less"></style>
