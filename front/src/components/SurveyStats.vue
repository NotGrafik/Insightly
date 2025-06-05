<script setup>
import { ref, onMounted } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

const props = defineProps({
  survey: Object
});

const chartData = ref([]);

onMounted(() => {
  chartData.value = props.survey.questions.map((question) => {
    if (question.type === 'open') {
      return {
        type: 'open',
        title: question.title,
        responses: question.responses
      };
    } else {
      const counts = {};
      question.responses.forEach((response) => {
        counts[response] = (counts[response] || 0) + 1;
      });
      return {
        type: 'chart',
        title: question.title,
        series: Object.values(counts),
        labels: Object.keys(counts)
      };
    }
  });
});
</script>

<template>
  <div class="space-y-6">
    <div v-for="(data, index) in chartData" :key="index">
      <h3 class="text-lg font-semibold mb-2">{{ data.title }}</h3>
      <div v-if="data.type === 'open'" class="space-y-1">
        <div v-for="(response, idx) in data.responses" :key="idx" class="bg-gray-100 p-2 rounded">
          {{ response }}
        </div>
      </div>
      <div v-else>
        <VueApexCharts
          type="donut"
          :options="{ labels: data.labels }"
          :series="data.series"
          width="400"
        />
      </div>
    </div>
  </div>
</template>
