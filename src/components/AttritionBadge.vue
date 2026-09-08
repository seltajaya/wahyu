<script setup>
import { computed } from 'vue';

const props = defineProps({
  riskLevel: { type: String, default: 'low' },
});

const badgeClass = computed(() => {
  const level = (props.riskLevel || 'low').toLowerCase();
  if (level === 'medium') return 'bg-amber-100 text-amber-800 border border-amber-200';
  if (level === 'high') return 'bg-rose-100 text-rose-800 border border-rose-200';
  return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
});
</script>

<template>
  <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium" :class="badgeClass">
    {{ (riskLevel || 'low').toLowerCase() }}
  </span>
</template>
