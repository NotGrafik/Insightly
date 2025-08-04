<script setup>
import { ref, onMounted, computed, nextTick, watchEffect } from 'vue';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Search } from 'lucide-vue-next';

import PageTemplate from './PageTemplate.vue';
import SurveyList from '@/components/SurveyList.vue';
import { API_BASE_URL } from '@/constants/url';

const prefixRef = ref(null);
const prefixWidth = ref(0);

const glowInput = ref(false);
const data = ref([]);
const searchQuery = ref('');
const filters = ref([]); // ex: ['user']
const user = ref(null);

const fetchData = async () => {
  const res = await fetch(`${API_BASE_URL}/survey/all`);
  data.value = await res.json();

  const userRes = await fetch(`${API_BASE_URL}/user/get`, {
    credentials: 'include',
  });
  user.value = await userRes.json();

  if (user) data.value = data.value.filter(survey => survey.creator._id !== user.value._id);
};

const handleTab = () => {
  const trimmed = searchQuery.value.trim().toLowerCase();
  if (['user'].includes(trimmed) && !filters.value.includes(trimmed)) {
    filters.value.push(trimmed.charAt(0).toUpperCase() + trimmed.slice(1));
    glowInput.value = true;
    searchQuery.value = '';
    prefixWidth.value = prefixRef.value.offsetWidth * 3.2;

    setTimeout(() => {
      glowInput.value = false;
    }, 400); // Durée du glow
  }
};

const removeFilter = (filter) => {
  filters.value = filters.value.filter(f => f !== filter);
    prefixWidth.value = prefixRef.value.offsetWidth / 3.2;

};

const filteredSurveys = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  return data.value.filter((survey) => {
    if (filters.value.includes('User')) {
      const fullName = `${survey.creator.firstName} ${survey.creator.lastName}`.toLowerCase();
      return fullName.includes(query);
    }
    return survey.name.toLowerCase().includes(query);
  });
});

const handleKeyDown = (e) => {
  if (e.key === 'Escape' && filters.value.length) {
    filters.value.pop();
    nextTick(updatePrefixWidth);
  } else if (e.key === 'Backspace' && searchQuery.value === '' && filters.value.length) {
    filters.value.pop();
    nextTick(updatePrefixWidth);
  }
};

const updatePrefixWidth = () => {
  if (prefixRef.value) {
    prefixWidth.value = prefixRef.value.offsetWidth;
  }
};

onMounted(() => {
  fetchData();
  updatePrefixWidth();
});

watchEffect(() => {
  nextTick(() => updatePrefixWidth());
});
</script>

<template>
  <PageTemplate pageInfos="Home">
    <div class="w-full flex flex-col">
      <div class="mb-6">
        <div class="relative w-full">
          <div
            class="absolute inset-y-0 left-2 flex items-center gap-2 z-10 pointer-events-none"
            ref="prefixRef"
          >
            <Search class="w-4 h-4 text-muted-foreground" />
            <div class="flex gap-1">
              <Badge
                v-for="filter in filters"
                :key="filter"
                :class="[
                  'px-2 py-0.5 text-xs font-medium pointer-events-auto'
                ]"
              >
                {{ filter }}
                <X class="w-3 h-3 cursor-pointer" @click.stop="removeFilter(filter)" />
              </Badge>
            </div>
          </div>
          <Input
            v-model="searchQuery"
            :style="{ paddingLeft: `${prefixWidth + 16}px` }"
            placeholder="Search surveys… (e.g. user <Tab>)"
            :class="['transition-all', { 'glow-effect': glowInput }]"
            @keydown.tab.prevent="handleTab"
            @keydown="handleKeyDown"
          />
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

input {
  transition: padding-left 0.2s ease;
}

@keyframes input-glow {
  0% {
    box-shadow: 0 0 0px rgb(93, 155, 255);
  }
  50% {
    box-shadow: 0 0 10px rgb(64, 130, 255);
  }
  100% {
    box-shadow: 0 0 0px rgb(46, 107, 255);
  }

}

.glow-effect {
  animation: input-glow 0.4s ease-out;
}
</style>
