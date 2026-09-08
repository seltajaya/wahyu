<script setup>
import { ref } from 'vue';

const emit = defineEmits(['submit']);

const form = ref({ name: '', department: '', salary: '', attrition_score: '' });
const errors = ref({});

// TODO(intern): validasi client-side
function validate() {
  const e = {};
  if (!form.value.name.trim()) e.name = 'Nama wajib diisi.';
  if (!form.value.department.trim()) e.department = 'Departemen wajib diisi.';
  if (form.value.salary !== '' && (isNaN(Number(form.value.salary)) || Number(form.value.salary) < 0)) {
    e.salary = 'Harus angka non-negatif.';
  }
  const score = Number(form.value.attrition_score);
  if (form.value.attrition_score === '' || isNaN(score) || score < 0 || score > 1) {
    e.attrition_score = 'Skor harus antara 0.0 - 1.0.';
  }
  errors.value = e;
  return Object.keys(e).length === 0;
}

function onSubmit() {
  if (!validate()) return;
  const score = Number(form.value.attrition_score);
  emit('submit', {
    name: form.value.name.trim(),
    department: form.value.department.trim(),
    salary: form.value.salary === '' ? 0 : Number(form.value.salary),
    attrition_score: score,
    risk_level: score >= 0.66 ? 'high' : score >= 0.33 ? 'medium' : 'low',
  });
  form.value = { name: '', department: '', salary: '', attrition_score: '' };
  errors.value = {};
}
</script>

<template>
  <form class="space-y-3 rounded-xl border border-slate-200 bg-white p-4" @submit.prevent="onSubmit">
    <div>
      <label class="mb-1 block text-sm font-medium">Nama</label>
      <input v-model="form.name" type="text" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Nama karyawan" />
      <p v-if="errors.name" class="mt-1 text-xs text-rose-600">{{ errors.name }}</p>
    </div>
    <div>
      <label class="mb-1 block text-sm font-medium">Departemen</label>
      <input v-model="form.department" type="text" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Engineering / Sales / ..." />
      <p v-if="errors.department" class="mt-1 text-xs text-rose-600">{{ errors.department }}</p>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div>
        <label class="mb-1 block text-sm font-medium">Gaji</label>
        <input v-model="form.salary" type="number" min="0" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="0" />
        <p v-if="errors.salary" class="mt-1 text-xs text-rose-600">{{ errors.salary }}</p>
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium">Skor Attrition (0-1)</label>
        <input v-model="form.attrition_score" type="number" step="0.01" min="0" max="1" class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="0.0 - 1.0" />
        <p v-if="errors.attrition_score" class="mt-1 text-xs text-rose-600">{{ errors.attrition_score }}</p>
      </div>
    </div>
    <button type="submit" class="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700">
      Tambah Karyawan
    </button>
  </form>
</template>
