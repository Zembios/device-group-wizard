<template>
  <div>
    <group-name-picker
      v-if="step === WizardStep.NAME_PICKER"
      @nextStep="toDevicePickerStep"
      :name="groupName"
    />
    <device-picker
      v-if="step === WizardStep.DEVICE_PICKER"
      :availableDevices="availableDevices"
      :alreadySelectedDevices="selectedDevices"
      @previousStep="backToNamePicker"
      @nextStep="toOverviewStep"
    ></device-picker>
    <device-group-overview
      v-if="step === WizardStep.OVERVIEW"
      :deviceGroupName="groupName"
      :selectedDevices="selectedDevices"
      @previousStep="step = WizardStep.DEVICE_PICKER"
      @dataSubmitted="clearWizardData"
    ></device-group-overview>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';
  import GroupNamePicker from 'components/deviceGroupWizard/groupNamePicker/GroupNamePicker.vue';
  import DevicePicker from 'components/deviceGroupWizard/devicePicker/DevicePicker.vue';
  import { api } from 'boot/axios';
  import { useQuasar } from 'quasar';
  import { Device } from 'components/deviceGroupWizard/devicePicker/models';
  import DeviceGroupOverview from 'components/deviceGroupWizard/deviceGroupOverview/DeviceGroupOverview.vue';

  enum WizardStep {
    NAME_PICKER,
    DEVICE_PICKER,
    OVERVIEW
  }

  const step = ref<WizardStep>(WizardStep.NAME_PICKER);
  const groupName = ref<string>('');
  const devicesData = ref<Device[]>([]);
  const availableDevices = ref<Device[]>([]);
  const selectedDevices = ref<Device[]>([]);
  const $q = useQuasar();

  // Populate availableDevices on mount
  onMounted(() => {
    api.get('/devices')
      .then((response) => {
        devicesData.value = response.data;
        availableDevices.value = response.data;
      })
      .catch(() => {
        $q.notify({
          color: 'negative',
          position: 'top',
          message: 'Loading failed',
          icon: 'report_problem'
        })
      })
  })

  function toDevicePickerStep(deviceGroupName: string) {
    groupName.value = deviceGroupName;
    step.value = WizardStep.DEVICE_PICKER
  }

  function backToNamePicker(emittedDeviceList: Device[]) {
    selectedDevices.value = emittedDeviceList;
    updateAvailableDevices(emittedDeviceList);

    step.value = WizardStep.NAME_PICKER;
  }

  function toOverviewStep(emittedDeviceList: Device[]) {
    selectedDevices.value = emittedDeviceList;
    updateAvailableDevices(emittedDeviceList);

    step.value = WizardStep.OVERVIEW
  }

  function updateAvailableDevices(deviceSelection: Device[]) {
    if (deviceSelection.length > 0) {
      availableDevices.value = devicesData.value.filter((device) => {
        deviceSelection.forEach(selectedDevice => {
          if (device.id === selectedDevice.id) {
            return false;
          }
        });

        return true;
      });
    } else {
      availableDevices.value = devicesData.value;
    }
  }

  function clearWizardData() {
    groupName.value = '';
    selectedDevices.value = [];
    step.value = WizardStep.NAME_PICKER;
  }
</script>
