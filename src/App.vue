<script setup>
import { ref, onMounted } from 'vue';
import EmployeeList from './components/EmployeeList.vue';
import EmployeeForm from './components/EmployeeForm.vue';
import { getEmployees, createEmployee } from './services/api.js';

const employees = ref([]);
const loading = ref(true);

onMounted(async () => {
  try {
    employees.value = await getEmployees();
  } finally {
    loading.value = false;
  }
});

async function handleSubmit(payload) {
  const saved = await createEmployee(payload);
  employees.value = [saved, ...employees.value];
}
</script>

<template>
  <div class="min-h-screen bg-slate-100">
    <div class="mx-auto max-w-5xl space-y-6 p-6">
      <header>
        <h1 class="text-2xl font-bold text-slate-900">Employee Directory</h1>
        <p class="text-sm text-slate-500">Dashboard direktori karyawan &amp; indikator risiko attrition.</p>
      </header>
      <div class="grid gap-6 md:grid-cols-[1fr_320px]">
        <div>
          <p v-if="loading" class="text-sm text-slate-500">Memuat data...</p>
          <EmployeeList v-else :employees="employees" />
        </div>
        <EmployeeForm @submit="handleSubmit" />
      </div>
    </div>
  </div>
</template>
