<template>
  <div class="deviceGroupOverview">
    <p class="overviewTitle">Device Group Overview</p>

    <p class="groupField">Name:</p>
    <p>{{ deviceGroupName }}</p>

    <p class="groupField">Selected Devices:</p>
    <div v-for="device in props.selectedDevices" :key="device.name + device.id">
      <p>{{ device.name }}</p>
    </div>

    <div class="actions">
      <div class="backBtn" @click="$emit('previousStep')">Back</div>
      <div class="nextBtn" @click="submitDeviceGroup">Submit</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { api } from 'boot/axios';
  import { useQuasar } from 'quasar';
  import { Device } from 'components/deviceGroupWizard/devicePicker/models';

  const props = defineProps<{
    deviceGroupName: string;
    selectedDevices: Device[];
  }>()

  const emit = defineEmits(['dataSubmitted', 'previousStep'])
  const $q = useQuasar()

  function submitDeviceGroup() {
    api.post('/createDeviceGroup', {
      name: props.deviceGroupName,
      devices: props.selectedDevices.map(device => device.id)
    }).then((response) => {
      alert(`${response.data.message}`);
      emit('dataSubmitted');
    }).catch(() => {
      $q.notify({
        color: 'negative',
        position: 'top',
        message: 'Loading failed',
        icon: 'report_problem'
      })
    })
  }
</script>

<style scoped>
  .deviceGroupOverview {
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  .overviewTitle {
    font-size: 1.5rem;
  }

  .groupField {
    font-weight: bold;
  }

  .actions {
    display: flex;
    justify-content: space-between;
    width: 600px;
    max-width: 90vw;
    padding: 2rem;
    padding-top: 0;
  }

  .nextBtn, .backBtn {
    display: flex;
    justify-content: center;
    align-items: center;
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