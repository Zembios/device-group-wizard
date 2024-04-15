<template>
  <q-page class="row items-center justify-evenly">
<!--    <example-component-->
<!--      title="Example component"-->
<!--      active-->
<!--      :todos="todos"-->
<!--      :meta="meta"-->
<!--    ></example-component>-->
    <device-group-wizard/>
  </q-page>
</template>

<script setup lang="ts">
import DeviceGroupWizard from 'components/deviceGroupWizard/DeviceGroupWizard.vue';

defineOptions({
  name: 'IndexPage'
});
</script>
