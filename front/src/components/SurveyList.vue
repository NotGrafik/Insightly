<script setup>
import { onMounted, defineProps } from 'vue';

import { useSidebar } from '@/components/ui/sidebar/utils';
import { Button } from '@/components/ui/button';

import { Share, ChartArea, Copy } from 'lucide-vue-next';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { watch } from 'vue';


const props = defineProps({
    SurveyList: {
        type: Array,
        default: () => [],
    },
    isUserSurvey: {
        type: Boolean,
        default: false,
    },
});

const { state } = useSidebar();

function formatDescirption(description) {
    if (!description) return '';
    return description.length > 180 ? description.slice(0, 180) + '...' : description;
}


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
    <div :class="state === 'collapsed' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full'">
        <Card v-for="survey in SurveyList" :key="survey.id" class="hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between">
            <div>
                <CardHeader>
                    <CardTitle>{{ survey.name }}</CardTitle>
                    <CardDescription>by {{ isUserSurvey ? ('You') : (survey.creator.firstName + ' ' + survey.creator.lastName) }}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p class="text-sm text-gray-600">{{ formatDescirption(survey.description) }}</p>
                </CardContent>
            </div>
            <CardFooter class="flex justify-between items-center">
                <Button v-if="isUserSurvey">
                    <ChartArea class="w-4 h-4" /> Analytics
                </Button>
                <Button v-else>
                    Reply
                </Button>
                <Dialog>
                    <DialogTrigger as-child>
                    <Button variant="outline" size="icon">
                        <Share class="w-4 h-4" />
                    </Button>
                    </DialogTrigger>
                    <DialogContent class="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Share link</DialogTitle>
                        <DialogDescription>
                        Anyone who has this link will be able to view this.
                        </DialogDescription>
                    </DialogHeader>
                    <div class="flex items-center space-x-2">
                        <div class="grid flex-1 gap-2">
                        <Label for="link" class="sr-only">
                            Link
                        </Label>
                        <Input
                            id="link"
                            default-value="https://shadcn-vue.com/docs/installation/"
                        />
                        </div>
                        <Button type="submit" size="sm" class="px-3">
                        <span class="sr-only">Copy</span>
                        <Copy class="w-4 h-4" />
                        </Button>
                    </div>
                    <DialogFooter class="sm:justify-start">
                        <DialogClose as-child>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                        </DialogClose>
                    </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardFooter>
        </Card>
    </div>

</template>
