<template>
  <div ref="a">
    <el-button @click="xxxxx">1234121111111111</el-button>
  </div>
  <test></test>
</template>

<script setup >
import test from '@/components/test.vue'
import utils from '@/utils/utils'
import { ref } from 'vue'
import {fetchShopPageData, aaaaaa} from '@/api/aaa'
fetchShopPageData({})
aaaaaa({aaa: 1})
console.log(utils.isNull(123))

const aaa = ref({
  aa: 1,
  bb: 2
})

console.log(111, aaa.value);

const xxxxx = () => {
  fetchShopPageData(aaa.value)
}
</script>

<style lang="less" scoped>

</style>