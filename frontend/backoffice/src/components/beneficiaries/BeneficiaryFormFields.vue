<template>
  <div class="fields-container">
    <div class="field-group">
      <label for="name" class="field-label">Nom de la famille</label>
      <input type="text" class="field-input" id="name" :value="modelValue.name" @input="update('name', $event)" required>
    </div>
    <div class="field-group">
      <label for="address" class="field-label">Adresse</label>
      <input type="text" class="field-input" id="address" :value="modelValue.address" @input="update('address', $event)" required>
    </div>
    <div class="field-group">
      <label for="members" class="field-label">Nombre de membres</label>
      <input type="number" class="field-input" id="members" :value="modelValue.members" @input="update('members', $event, true)" required>
    </div>
    <div class="field-group">
      <label for="socialStatus" class="field-label">Statut Social</label>
      <input type="text" class="field-input" id="socialStatus" :value="modelValue.socialStatus" @input="update('socialStatus', $event)" required>
    </div>
    <div class="field-group">
      <label for="phone" class="field-label">Téléphone</label>
      <input type="text" class="field-input" id="phone" :value="modelValue.phone" @input="update('phone', $event)" required>
    </div>
    <div class="field-group">
      <label for="cin" class="field-label">CIN du représentant</label>
      <input type="text" class="field-input" id="cin" :value="modelValue.cin" @input="update('cin', $event)" required>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Beneficiary } from '@/types/beneficiary';

const props = defineProps<{
  modelValue: Beneficiary;
}>();

const emit = defineEmits(['update:modelValue']);

const update = (field: keyof Beneficiary, event: Event, isNumber = false) => {
  const target = event.target as HTMLInputElement;
  const value = isNumber ? Number(target.value) : target.value;
  emit('update:modelValue', { ...props.modelValue, [field]: value });
};
</script>

<style scoped>
.fields-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.field-group {
  display: flex;
  flex-direction: column;
}
.field-label {
  font-weight: 600;
  margin-bottom: 8px;
  color: #374151;
  font-size: 14px;
}
.field-input {
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
}
.field-input:focus {
  outline: none;
  border-color: #0f766e;
  box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.1);
}
</style>
