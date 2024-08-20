<template>
  <el-menu
    :default-active="active"
    active-text-color="#ffd04b"
    background-color="#000"
    text-color="#fff"
    @select="handleSelect"
  >
    <el-menu-item :index="router.path" v-for="router in constantRouterMap" :key="router.path">
      <el-icon><icon-menu /></el-icon>
      <span>{{ router.meta.title }}</span>
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { constantRouterMap } from '@/router'
import {
  Menu as IconMenu,
} from '@element-plus/icons-vue'

const active = window.location.hash.split('#')[1]

const { push, currentRoute } = useRouter()

const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
  push(key)
}
</script>

<style scoped>

</style>