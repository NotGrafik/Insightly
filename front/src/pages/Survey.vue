<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import SurveyStats from '@/components/SurveyStats.vue';
import SurveyResponse from '@/components/SurveyResponse.vue';
import PageTemplate from './PageTemplate.vue';

const route = useRoute();
const surveyId = route.params.id;

const user = ref(null);
const survey = ref(null);
const isOwner = ref(false);
const loading = ref(true);

onMounted(async () => {
    try {
        const userRes = await fetch('/api/user/get');
        user.value = await userRes.json();

        const surveyRes = await fetch(`/api/survey/${surveyId}`);
        survey.value = await surveyRes.json();

        isOwner.value = survey.value.creator?._id === user.value._id;
    } catch (error) {
        console.error('Error loading survey:', error);
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <PageTemplate :pageInfos="`Survey: ${survey?.name || ''}`">
        <div v-if="loading" class="text-center text-gray-500">Loading survey...</div>
        <div class="w-full" v-else>
            <SurveyStats v-if="isOwner === true" :survey="survey" />
            <SurveyResponse v-if="isOwner === false" :survey="survey" :user="user" />
        </div>
    </PageTemplate>
</template>
