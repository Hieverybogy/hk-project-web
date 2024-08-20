<template>
  <div style="height: 100vh; width: 100%">
    <el-container style="height: 100%;">
      <el-header style="background-color: aqua; text-align: center; line-height: 60px;">Header</el-header>
      <el-container>
        <el-aside width="200px" style="background-color: #000; color: #fff;">
          <Nav/>
        </el-aside>
        <el-main>
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import Nav from './nav.vue'

</script>

<style lang="less">

</style>