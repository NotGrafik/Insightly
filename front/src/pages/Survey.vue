<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import SurveyStats from "@/components/SurveyStats.vue";
import SurveyResponse from "@/components/SurveyResponse.vue";
import PageTemplate from "./PageTemplate.vue";
import { CheckCircle } from "lucide-vue-next";

import { API_BASE_URL } from "@/constants/url";

const route = useRoute();
const router = useRouter();
const surveyId = route.params.id;

const user = ref(null);
const survey = ref(null);
const isOwner = ref(false);
const loading = ref(true);

const alreadyReplied = ref(false);


async function isAlreadyReplied(surveyId) {
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
    }

    const tokenCookie = getCookie("token");
    const userId = tokenCookie ? decodeURIComponent(tokenCookie).id : null;
    if (!userId) return false;

    try {
        const response = await fetch(`${API_BASE_URL}/survey/${surveyId}/responses`);
        if (!response.ok) {
        console.error("Failed to fetch responses:", response.statusText);
        return false;
        }
        const responses = await response.json();
        return responses.some((response) => response.user_id === userId);
    } catch (error) {
        console.error("Error fetching responses:", error);
        return false;
    }
}
onMounted(async () => {
    try {
        const userRes = await fetch("${API_BASE_URL}/user/get");
        user.value = await userRes.json();

        if (userRes.status === 401) {
        router.push({ path: "/auth/login", query: { redirect: route.fullPath } });
        return;
        }

        const surveyRes = await fetch(`${API_BASE_URL}/survey/${surveyId}`);
        survey.value = await surveyRes.json();

        isOwner.value = survey.value.creator?._id === user.value._id;

        if (!isOwner.value) {
        alreadyReplied.value = await isAlreadyReplied(surveyId);
        if (alreadyReplied.value) {
            setTimeout(() => {
            router.push("/home");
            }, 2000);
        }
        }
    } catch (error) {
        console.error("Error loading survey:", error);
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <PageTemplate :pageInfos="`Survey: ${survey?.name || ''}`">
        <div
        v-if="!loading && !isOwner && alreadyReplied"
        class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500"
        >
        <CheckCircle class="text-green-500 w-20 h-20 animate-bounce mb-6" />
        <h2 class="text-xl font-semibold text-center text-foreground">
            Vous avez déjà répondu à ce sondage, merci !
        </h2>
            <p class="text-sm text-muted-foreground mt-2">Redirection en cours...</p>
        </div>

        <div v-if="loading" class="text-center text-gray-500">Loading survey...</div>

        <div v-if="!loading && !alreadyReplied" class="w-full">
            <SurveyStats v-if="isOwner" :survey="survey" />
            <SurveyResponse v-if="!isOwner" :survey="survey" :user="user" />
        </div>
    </PageTemplate>
</template>
