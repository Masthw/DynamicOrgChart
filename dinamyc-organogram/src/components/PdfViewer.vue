<template>
  <div>
    <iframe
      :src="pdfUrl"
      style="width: 100%; height: 100vh"
      frameborder="0"
    ></iframe>
  </div>
</template>

<script>
export default {
  props: {
    pdfUrl: {
      type: String,
      required: true,
    },
  },
};
</script>
