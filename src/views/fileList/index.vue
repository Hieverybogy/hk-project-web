<template>
  <div>
    <UnnUpload v-model="fileList" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
const fileList = ref([
  {
    name: 'food.jpeg',
    extension: 'jpeg',
    url: 'https://fuss101.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
  },
  {
    name: 'food2.jpeg',
    extension: 'jpeg',
    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
  }
])
</script>

<style scoped>

</style>