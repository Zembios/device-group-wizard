<template>
  <div class="namePickerContainer">
    <p class="inputTitle">Device Group Name:</p>
    <input type="text" v-model="deviceGroupName" class="groupNameInput"/>
    <button class="nextBtn" @click="$emit('nextStep', deviceGroupName)">
      Next
    </button>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  interface Props {
    name?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    name: () => ''
  });

  const deviceGroupName = ref(props.name);
</script>

<style scoped>
  .namePickerContainer {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 600px;
    max-width: 90vw;
    padding: 2rem;
  }

  .inputTitle {
    width: 100%;
    font-size: 1.5rem;
  }

  .groupNameInput {
    width: 100%;
    height: 48px;
    padding: .25rem .75rem;
  }

  .nextBtn {
    cursor: pointer;
    width: fit-content;
    height: 48px;
    margin-top: 1.5rem;
    padding: .25rem 1.5rem;
    background: var(--q-primary);
    border: none;
    border-radius: 12px;
    color: #fff;
    font-weight: bold;
    font-size: 1rem;
  }
</style>