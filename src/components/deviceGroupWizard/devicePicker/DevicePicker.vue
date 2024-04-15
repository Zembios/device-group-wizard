<template>
  <div class="devicesList">
    <div class="availableDevices">
      <p class="availableDevicesTitle">Available Devices:</p>
      <input
          type="text"
          v-model="devicesFilter"
          class="filterInput"
          placeholder="Filter available devices..."
      >
      <div v-if="devicesFilter.length === 0">
        <div v-for="device in devicesToDisplay" :key="device.name + device.id">
          <p
            @click="addToSelected(device)"
            class="availableDevice"
          >
            {{device.name}}
          </p>
        </div>
      </div>
      <div v-else>
        <div v-for="device in filteredDevices" :key="device.name + device.id">
          <p
              @click="addToSelected(device)"
              class="availableDevice"
          >
            {{device.name}}
          </p>
        </div>
      </div>
    </div>

    <div class="selectedDevices">
      <p class="selectedDevicesTitle">Selected Devices:</p>
      <div v-if="selectedDevices.length > 0">
        <div v-for="device in selectedDevices" :key="device.name + device.id">
          <p
              @click="removeFromSelected(device)"
              class="selectedDevice"
          >
            {{device.name}}
          </p>
        </div>
      </div>

      <div v-else>
        No devices selected...
      </div>
    </div>
  </div>

  <div class="actions">
    <div class="backBtn" @click="$emit('previousStep', selectedDevices)">Back</div>
    <div class="nextBtn" @click="$emit('nextStep', selectedDevices)">Next</div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from 'vue';
  import { Device } from 'components/deviceGroupWizard/devicePicker/models';

  const props = withDefaults(defineProps<{
    availableDevices: Device[],
    alreadySelectedDevices: Device[],
    devicesBlacklist?: Device[]
  }>(), {
    devicesBlacklist: () => []
  });

  const selectedDevices = ref<Device[]>(props.alreadySelectedDevices);
  const devicesFilter = ref('');
  const devicesToDisplay = ref<Device[]>([]);
  const filteredDevices = ref<Device[]>([]);

  // Update filtered devices when the filter is not empty
  watch([devicesFilter], () => {
    if (devicesFilter.value.length > 0) {
      filteredDevices.value = devicesToDisplay.value.filter(device => {
        return device.name.toLowerCase().includes(devicesFilter.value.toLowerCase())
      })
    }
  }, { immediate: true })

  // Populate devicesToDisplay on mount
  onMounted(() => {
    if (props.devicesBlacklist.length > 0) {
      devicesToDisplay.value = props.availableDevices.filter((device) => {
        props.devicesBlacklist.forEach(blacklistedDevice => {
          if (device.id === blacklistedDevice.id) {
            return false;
          }
        });

        return true;
      });
    } else {
      devicesToDisplay.value = props.availableDevices;
    }
  })

  function addToSelected(device: Device) {
    selectedDevices.value.push(device)

    const index = devicesToDisplay.value.findIndex(entry => entry.id === device.id)
    devicesToDisplay.value.splice(index, 1);
  }

  function removeFromSelected(device: Device) {
    const index = selectedDevices.value.findIndex(entry => entry.id === device.id)
    selectedDevices.value.splice(index, 1);

    devicesToDisplay.value.push(device);
  }
</script>

<style scoped>
  .devicesList {
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 600px;
    max-width: 90vw;
    padding: 2rem;
  }

  .availableDevices, .selectedDevices {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    height: fit-content;
    max-height: 350px;
    overflow-y: auto;
  }

  .availableDevicesTitle, .selectedDevicesTitle {
    font-size: 1.5rem;
    margin-bottom: .5rem;
  }

  /*.selectedDevices {*/
  /*  padding-left: 0;*/
  /*}*/

  .filterInput {
    width: 90%;
    height: 36px;
    min-height: 36px;
    padding: .25rem .75rem;
    margin-bottom: 1rem;
  }

  .availableDevice, .selectedDevice {
    cursor: pointer;
  }

  .availableDevice:hover, .selectedDevice:hover {
    background: rgba(0,0,0,.3);
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

  @media screen and (min-width: 480px) {
    .devicesList {
      flex-direction: row;
    }

    .selectedDevices {
      padding-left: 1rem;
    }

    .availableDevices, .selectedDevices {
      width: 300px;
    }
  }
</style>