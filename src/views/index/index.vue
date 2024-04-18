<template>
  <div ref="a">
    123
  </div>
  <test></test>
</template>

<script setup >
import test from '@/components/test.vue'
import utils from '@/utils/utils'
import { ref } from 'vue'
console.log(utils.isNull(123))

const a = ref(null)
</script>

<style lang="less" scoped>

</style>