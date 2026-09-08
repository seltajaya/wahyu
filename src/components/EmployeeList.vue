<script setup>
import { ref, computed, watch } from 'vue';
import AttritionBadge from './AttritionBadge.vue';

const props = defineProps({
  employees: { type: Array, default: () => [] },
});

const search = ref('');
const departmentFilter = ref('');
const riskFilter = ref('');
const currentPage = ref(1);
const pageSize = ref(5);

function riskOf(e) {
  const r = e.risk_level ?? e.riskLevel;
  if (r) return String(r).toLowerCase();
  const s = Number(e.attrition_score ?? e.attritionScore ?? 0);
  if (s >= 0.66) return 'high';
  if (s >= 0.33) return 'medium';
  return 'low';
}

// TODO(intern): filter pencarian nama, departemen, risiko
const filteredEmployees = computed(() => {
  const q = search.value.trim().toLowerCase();
  return props.employees.filter((e) => {
    if (q && !String(e.name || '').toLowerCase().includes(q)) return false;
    if (departmentFilter.value && e.department !== departmentFilter.value) return false;
    if (riskFilter.value && riskOf(e) !== riskFilter.value) return false;
    return true;
  });
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(filteredEmployees.value.length / pageSize.value))
);

// TODO(intern): pagination
const paginatedEmployees = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredEmployees.value.slice(start, start + pageSize.value);
});

const departments = computed(() => [
  ...new Set(props.employees.map((e) => e.department).filter(Boolean)),
]);

watch([search, departmentFilter, riskFilter], () => { currentPage.value = 1; });

function prevPage() { if (currentPage.value > 1) currentPage.value--; }
function nextPage() { if (currentPage.value < totalPages.value) currentPage.value++; }
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-col gap-2 sm:flex-row">
      <input
        v-model="search"
        type="text"
        placeholder="Cari nama..."
        class="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
      />
      <select v-model="departmentFilter" class="rounded-lg border border-slate-300 px-3 py-2 text-sm">
        <option value="">Semua Departemen</option>
        <option v-for="d in departments" :key="d" :value="d">{{ d }}</option>
      </select>
      <select v-model="riskFilter" class="rounded-lg border border-slate-300 px-3 py-2 text-sm">
        <option value="">Semua Risiko</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>

    <div class="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <table class="w-full text-left text-sm">
        <thead class="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th class="px-4 py-3">Nama</th>
            <th class="px-4 py-3">Departemen</th>
            <th class="px-4 py-3">Skor</th>
            <th class="px-4 py-3">Risiko</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="paginatedEmployees.length === 0">
            <td colspan="4" class="px-4 py-6 text-center text-slate-500">Tidak ada data.</td>
          </tr>
          <tr
            v-for="emp in paginatedEmployees"
            :key="emp.id"
            class="border-t border-slate-100"
          >
            <td class="px-4 py-3 font-medium">{{ emp.name }}</td>
            <td class="px-4 py-3">{{ emp.department }}</td>
            <td class="px-4 py-3">{{ emp.attrition_score ?? emp.attritionScore ?? '-' }}</td>
            <td class="px-4 py-3">
              <AttritionBadge :risk-level="riskOf(emp)" />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex items-center justify-between text-sm text-slate-600">
      <span>Halaman {{ currentPage }} / {{ totalPages }} ({{ filteredEmployees.length }} data)</span>
      <div class="flex gap-2">
        <button
          class="rounded-lg border border-slate-300 px-3 py-1 disabled:opacity-40"
          :disabled="currentPage <= 1"
          @click="prevPage"
        >
          Prev
        </button>
        <button
          class="rounded-lg border border-slate-300 px-3 py-1 disabled:opacity-40"
          :disabled="currentPage >= totalPages"
          @click="nextPage"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>
