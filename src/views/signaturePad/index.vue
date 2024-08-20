<template>
  <div id="app">
    <div class="center">
    <h1>电子签名</h1>
    <SignaturePad @save-signature="handleSaveSignature" @clean="handleClean" />
    <div >
      <h2>签名图片：</h2>
      <div class="showimg">
        <img v-if="signatureImage" :src="signatureImage"  alt="Signature" />
      </div>
    </div>
    <div>
      <el-button @click="handleExport">导出</el-button>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SignaturePad from './SignaturePad.vue';

let signatureImage: any = ref('');

const handleSaveSignature = (dataURL: string) => {
  signatureImage.value = dataURL;
};

const handleClean = () => {
  signatureImage.value = null;
};

const handleExport = () => {
  if (!signatureImage.value) return
  const link = document.createElement('a');
  link.href = signatureImage.value;
  link.download = '签名.png';
  link.click();
}
</script>

<style>
.showimg{
  border-radius: 4px;
  border: 1px solid #ccc;
  padding: 10px;
  box-sizing: border-box;
  width: 610px;
  height: 310px;
}
</style>