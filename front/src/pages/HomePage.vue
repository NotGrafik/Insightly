<script setup>
import { ref, onMounted, computed } from 'vue';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Search } from 'lucide-vue-next';

import PageTemplate from './PageTemplate.vue';
import SurveyList from '@/components/SurveyList.vue';

const data = ref([]);
const searchQuery = ref('');
const filters = ref([]); // ex: ['user']

const fetchData = async () => {
  const res = await fetch('/api/survey/all');
  data.value = await res.json();
};

onMounted(() => fetchData());

const handleTab = () => {
  const trimmed = searchQuery.value.trim().toLowerCase();
  if (['user', 'title'].includes(trimmed) && !filters.value.includes(trimmed)) {
    filters.value.push(trimmed);
    searchQuery.value = '';
  }
};

const removeFilter = (filter) => {
  filters.value = filters.value.filter(f => f !== filter);
};

const filteredSurveys = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  return data.value.filter((survey) => {
    if (filters.value.includes('user')) {
      const fullName = `${survey.creator.firstName} ${survey.creator.lastName}`.toLowerCase();
      return fullName.includes(query);
    }
    return survey.name.toLowerCase().includes(query);
  });
});
</script>

<template>
  <PageTemplate pageInfos="Home">
    <div class="w-full flex flex-col">
      <div class="mb-6">
        <div class="relative w-full">
          <div class="flex flex-wrap items-center gap-2 mb-2">
            <Badge v-for="filter in filters" :key="filter" class="flex items-center gap-1">
              {{ filter }}
              <X class="w-3 h-3 cursor-pointer" @click="removeFilter(filter)" />
            </Badge>
          </div>
          <div class="relative">
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              v-model="searchQuery"
              placeholder="Search surveys… (e.g. user <Tab>)"
              class="pl-10"
              @keydown.tab.prevent="handleTab"
            />
          </div>
        </div>
      </div>

      <SurveyList v-if="filteredSurveys.length" :SurveyList="filteredSurveys" :is-user-survey="false" />
      <div v-else class="text-center text-gray-500">No surveys found</div>
    </div>
  </PageTemplate>
</template>

<style scoped>
input:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--ring);
}
</style>
