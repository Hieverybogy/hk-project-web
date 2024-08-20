<!-- src/components/QrCodeGenerator.vue -->
<template>
  <div>
    <h1>QR Code Generator</h1>
    <input v-model="text" placeholder="Enter text or URL" />
    <button @click="generateQRCode">Generate QR Code</button>
    <div v-if="qrCodeDataUrl">
      <h2>Your QR Code:</h2>
      <img :src="qrCodeDataUrl" alt="QR Code" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import QRCode from 'qrcode';

const text = ref('');
const qrCodeDataUrl = ref('');

const generateQRCode = async () => {
  try {
    qrCodeDataUrl.value = await QRCode.toDataURL(text.value, {
      width: 300,
      margin: 2,
    });
  } catch (error) {
    console.error('Failed to generate QR code:', error);
  }
};
</script>
