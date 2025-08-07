<script setup>
import { onMounted, ref } from "vue";
import SurveyList from "@/components/SurveyList.vue";
import PageTemplate from "./PageTemplate.vue";

import { Button } from "@/components/ui/button";

import { API_BASE_URL } from "@/constants/url";

const data = ref(null);

const fetchData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/surveys`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const json = await response.json();
    data.value = json;
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

onMounted(() => {
  fetchData();
});
</script>

<template>
  <PageTemplate pageInfos="My surveys">
    <div class="w-full flex flex-col gap-6">
      <Button class="self-end" @click="$router.push('/me/survey/create')">
        + Create survey
      </Button>
      <SurveyList v-if="data" :SurveyList="data" :is-user-survey="true" />
      <div v-else class="text-center text-gray-500">Loading surveys...</div>
    </div>
  </PageTemplate>
</template>
