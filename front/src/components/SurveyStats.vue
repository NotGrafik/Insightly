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

const usersMap = ref({});

async function fetchUser(id) {
  if (usersMap.value[id]) return usersMap.value[id];
  const res = await fetch(`/api/user/get/${id}`);
  const user = await res.json();
  usersMap.value[id] = user;
  return user;
}

onMounted(async () => {
  const questions = props.survey.questions;

  const res = await fetch(`/api/survey/${props.survey._id}/responses`);
  const rawResponses = await res.json();

  questions.forEach(q => q.responses = []);

  for (const submission of rawResponses) {
    const user = await fetchUser(submission.user_id);
    for (const responseItem of submission.responses) {
      const question = questions.find(q => q._id === responseItem.question_id);
      if (question) {
        if (question.type === 'open') {
          question.responses.push({
            text: responseItem.response,
            user: `${user.firstName} ${user.lastName}`
          });
        } else {
          question.responses.push(responseItem.response);
        }
      }
    }
  }

  chartData.value = questions.map((question) => {
    if (question.type === 'open') {
      return {
        type: 'open',
        title: question.title,
        responses: question.responses
      };
    } else {
      const counts = {};
      question.responses.forEach((r) => {
        const response = typeof r === 'object' ? r.text : r;
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
      <div v-if="chartData.length === 0" class="text-center p-6">
        <CardTitle class="text-lg font-semibold">No survey data available</CardTitle>
        <CardDescription class="text-sm text-gray-500">Please ensure the survey has questions with responses.</CardDescription>
      </div>
      <div v-for="(data, index) in chartData" :key="index">
        <CardHeader class="text-lg font-semibold"> Question {{ index + 1 + ': ' + data.title }}</CardHeader>
        <CardContent>
          <CardDescription class="text-sm text-gray-500">
            {{ data.type === 'open' ? 'Open responses' : 'Response distribution' }}
          </CardDescription>
          <div v-if="data.type === 'open'" class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Utilisateur</th>
                  <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Réponse</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="(response, idx) in data.responses" :key="idx" class="bg-white hover:bg-gray-50">
                  <td class="px-4 py-2 text-sm text-gray-800 font-semibold">{{ response.user }}</td>
                  <td class="px-4 py-2 text-sm text-gray-700">{{ response.text }}</td>
                </tr>
              </tbody>
            </table>
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
