<script setup>
import { onMounted, watch } from 'vue';
import { defineProps } from 'vue';

const props = defineProps({
    SurveyList: {
        type: Array,
        default: () => [],
    },
});

onMounted(() => {
    console.log('SurveyList mounted:', props.SurveyList);
});

watch(
    () => props.SurveyList,
    (newVal) => {
        console.log('SurveyList updated:', newVal);
    },
    { immediate: true }
);
</script>

<template>
</template>
