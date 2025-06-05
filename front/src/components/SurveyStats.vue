<script setup>
import { ref, onMounted } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';

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
    <Card>
      <div v-if="props.survey.questions[0].responses.length === 0" class="p-6 text-center">
        <CardTitle class="text-lg font-semibold">No survey data available</CardTitle>
        <CardDescription class="text-sm text-gray-500">Please ensure the survey has questions with responses.</CardDescription>
      </div>
      <div v-else v-for="(data, index) in chartData" :key="index">
        <CardHeader class="text-lg font-semibold"> Question {{ index + 1 + ': ' + data.title }}</CardHeader>
        <CardContent>
          <CardDescription class="text-sm text-gray-500">
            {{ data.type === 'open' ? 'Open responses' : 'Response distribution' }}
          </CardDescription>
          <div v-if="data.type === 'open'" class="space-y-1">
            <div v-for="(response, idx) in data.responses" :key="idx" class="bg-gray-100 p-2 rounded">
              {{ response }}
            </div>
          </div>
          <div class="w-full" v-else>
                <VueApexCharts
                  class="w-full flex justify-center"
                  type="donut"
                  :options="{ labels: data.labels }"
                  :series="data.series"
                  width="400"
                />
          </div>
        </CardContent>
      </div>
    </Card>
  </div>
</template>
