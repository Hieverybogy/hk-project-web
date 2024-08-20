<!-- src/components/SignaturePad.vue -->
<template>
  <div>
    <canvas ref="signatureCanvas"></canvas>
    <button @click="clearCanvas">清除</button>
    <button @click="saveSignature">保存签名</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import SignaturePad from 'signature_pad';

const emit = defineEmits(['save-signature'])

const signatureCanvas = ref<HTMLCanvasElement | null>(null);
const signaturePad = ref<SignaturePad | null>(null);
const isDrawing = ref(false);

onMounted(() => {
  const canvas = signatureCanvas.value;
  if (canvas) {
    canvas.width = 600;
    canvas.height = 300;
    signaturePad.value = new SignaturePad(canvas);
  }
});


const clearCanvas = () => {
  if (signaturePad.value) {
    signaturePad.value.clear();
  }
};

const saveSignature = () => {
  if (signaturePad.value && signaturePad.value.isEmpty()) {
    alert('请先签名！');
    return;
  }
  const dataURL = signaturePad.value?.toDataURL();
  if (dataURL) {
    // Emit save-signature event
    emit('save-signature', dataURL);
  }
};

onUnmounted(() => {
  if (signaturePad.value) {
    signaturePad.value.off();
  }
});
</script>

<style scoped>
canvas {
  border: 1px solid #ccc;
  display: block;
  margin-bottom: 10px;
}
button {
  margin-right: 10px;
}
</style>