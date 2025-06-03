<script setup>
import { onMounted, watch } from 'vue';
import { defineProps } from 'vue';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

import { Button } from '@/components/ui/button';

import { Share } from 'lucide-vue-next';

const props = defineProps({
    SurveyList: {
        type: Array,
        default: () => [],
    },
});

onMounted(() => {
    console.log('SurveyList mounted:', props.SurveyList);
});

</script>

<template>
    <div class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card v-for="survey in SurveyList" :key="survey.id" class="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
                <CardTitle>{{ survey.nom }}</CardTitle>
                <CardDescription>by {{ survey.createur.firstName + ' ' + survey.createur.lastName }}</CardDescription>
            </CardHeader>
            <CardContent>
                JSP
            </CardContent>
            <CardFooter class="flex justify-between items-center">
                <Button variant="secondary">
                    Reply 
                </Button>
                <Button variant="outline" size="icon">
                    <Share class="w-4 h-4" />
                </Button>
            </CardFooter>
        </Card>
    </div>

</template>
