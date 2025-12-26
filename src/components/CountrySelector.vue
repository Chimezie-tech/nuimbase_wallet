<template>
  <div class="selector-wrapper">
    <label class="custom-label">Country of Origin</label>

    <Select
      :model-value="modelValue"
      @update:model-value="updateValue"
      :options="countries"
      option-label="name"
      option-value="code"
      filter
      required
      placeholder="Select country"
      class="w-full custom-select"
      :class="{ 'p-invalid': error }"
      :pt="{
        root: { class: 'flex items-center' },
        label: { class: 'text-base text-gray-700' }
      }"
    >
      <template #option="slotProps">
        <div class="flex items-center">
          <span>{{ slotProps.option.name }}</span>
        </div>
      </template>

      <template #value="slotProps">
        <div v-if="slotProps.value" class="flex items-center">
          <span>{{ getCountryName(slotProps.value) }}</span>
        </div>
        <span v-else class="text-gray-400">{{ slotProps.placeholder }}</span>
      </template>
    </Select>

    <small v-if="error" class="text-red-500 text-xs">{{ error }}</small>
  </div>
</template>

<script setup>
import { Select } from 'primevue';

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue', 'change']);

// List populated with crypto-friendly countries (Flags removed)
const countries = [
  { name: 'El Salvador', code: 'SV' },
  { name: 'Switzerland', code: 'CH' },
  { name: 'Singapore', code: 'SG' },
  { name: 'United Arab Emirates', code: 'AE' },
  { name: 'United States', code: 'US' },
  { name: 'United Kingdom', code: 'GB' },
  { name: 'Nigeria', code: 'NG' },
  { name: 'Germany', code: 'DE' },
  { name: 'Japan', code: 'JP' },
  { name: 'South Korea', code: 'KR' },
  { name: 'Canada', code: 'CA' },
  { name: 'Australia', code: 'AU' },
  { name: 'Brazil', code: 'BR' },
  { name: 'Argentina', code: 'AR' },
  { name: 'Vietnam', code: 'VN' },
  { name: 'Philippines', code: 'PH' },
  { name: 'India', code: 'IN' },
  { name: 'Turkey', code: 'TR' },
  { name: 'South Africa', code: 'ZA' },
  { name: 'France', code: 'FR' },
  { name: 'Spain', code: 'ES' },
  { name: 'Italy', code: 'IT' },
  { name: 'Netherlands', code: 'NL' },
  { name: 'Portugal', code: 'PT' },
  { name: 'Mexico', code: 'MX' },
  { name: 'Thailand', code: 'TH' },
  { name: 'Malaysia', code: 'MY' },
  { name: 'Indonesia', code: 'ID' },
  { name: 'Estonia', code: 'EE' },
  { name: 'Malta', code: 'MT' },
  { name: 'Georgia', code: 'GE' },
  { name: 'Hong Kong', code: 'HK' }
];

const updateValue = (val) => {
  emit('update:modelValue', val);
  emit('change', val);
};

const getCountryName = (code) => {
  const c = countries.find(x => x.code === code);
  return c ? c.name : code;
};
</script>

<style scoped>
.selector-wrapper {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
}

.custom-label {
  /* Matches your Auth file labels */
  font-size: 1rem;
  color: #000;
  font-weight: 400;
}

/* Deep styling to force PrimeVue Select to look like your Auth inputs */
.custom-select {
  border: 1px solid #1bac4b !important;
  border-radius: 6px !important;
  height: 40px !important;
  display: flex;
  align-items: center;
  transition: 0.2s ease;
  background: white;
}

.custom-select:hover {
  border-color: #159a43 !important;
}

.custom-select:focus-within {
  border-color: #1bac4b !important;
  outline: none;
  box-shadow: 0 0 0 2px rgba(27,172,75,0.3) !important;
}

.custom-select.p-invalid {
  border-color: #ef4444 !important;
}

/* Ensure text inside fits vertically */
.custom-select :deep(.p-select-label) {
  padding: 0 10px !important;
  line-height: 1.5;
}

.custom-select :deep(.p-icon) {
  color: #6b7280;
  margin-right: 10px;
}
</style>
