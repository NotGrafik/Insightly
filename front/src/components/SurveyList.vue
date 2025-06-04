<script setup>
import { onMounted, defineProps } from 'vue';

import { useSidebar } from '@/components/ui/sidebar/utils';
import { Button } from '@/components/ui/button';

import { Share } from 'lucide-vue-next';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { watch } from 'vue';


const props = defineProps({
    SurveyList: {
        type: Array,
        default: () => [],
    },
});

const { state } = useSidebar();

watch(
    () => state.value,
    (newState) => {
        console.log('Sidebar state changed:', newState);
    },
    { immediate: true }
)

onMounted(() => {
    console.log('Mounted SurveyList component', props.SurveyList);
});

</script>

<template>
    <div :class="state === 'collapsed' ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full' : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full'">
        <Card v-for="survey in SurveyList" :key="survey.id" class="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
                <CardTitle>{{ survey.name }}</CardTitle>
                <CardDescription>by {{ survey.creator.firstName + ' ' + survey.creator.lastName }}</CardDescription>
            </CardHeader>
            <CardContent>
                <p class="text-sm text-gray-600">{{ survey.description }}</p>
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
