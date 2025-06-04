<script setup>
import { ref, onMounted } from 'vue';
import PageTemplate from './PageTemplate.vue';
import SurveyList from '@/components/SurveyList.vue';

const data = ref(null);

const fetchData = async () => {
  try {
    const response = await fetch('/api/survey/all');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const json = await response.json();
    data.value = json;
  } catch (error) {
    console.error('Fetch error:', error);
  }
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <PageTemplate pageInfos="Home" >
      <SurveyList v-if="data" :SurveyList="data" :is-user-survey="false" />
      <div v-else class="text-center text-gray-500">Loading surveys...</div>
  </PageTemplate>
</template>
