<template>
  <q-page class="row items-center justify-evenly">
    <example-component
      title="Example component"
      active
      :meta="meta"
    ></example-component>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Meta } from 'components/models';

defineOptions({
  name: 'IndexPage',
});

const meta = ref<Meta>({
  totalCount: 1200,
});
</script>
