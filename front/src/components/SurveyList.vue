<script setup>
import { onMounted, defineProps, ref } from 'vue';

import { useSidebar } from '@/components/ui/sidebar/utils';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti'

import { Share, ChartArea, Copy, Check } from 'lucide-vue-next';

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

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

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

const urlOrigin = window.location.origin;

const copiedSurveyId = ref(null)

function copyToClipboard(link, surveyId) {
    navigator.clipboard.writeText(link).then(() => {
        copiedSurveyId.value = surveyId

        // 🎉 Lance les confettis
        confetti({
            particleCount: 100,
            spread: 100,
            origin: { y: 0.6 }
        });

        setTimeout(() => {
            copiedSurveyId.value = null
        }, 2000)
    })
}

async function isAlreadyReplied(surveyId) {
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    const tokenCookie = getCookie('token');
    const userId = tokenCookie ? JSON.parse(decodeURIComponent(tokenCookie)).id : null;
    if (!userId) return false;

    try {
        const response = await fetch(`/api/survey/${surveyId}/responses`);
        if (!response.ok) {
            console.error('Failed to fetch responses:', response.statusText);
            return false;
        }
        const responses = await response.json();
        return responses.some(response => response.user_id === userId);
    } catch (error) {
        console.error('Error fetching responses:', error);
        return false;
    }
}
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
                <Button v-if="isUserSurvey" @click="router.push(`/survey/${survey._id}`)">
                    <ChartArea class="w-4 h-4" /> Analytics
                </Button>
                <Button v-if="!isUserSurvey && (!isAlreadyReplied(survey._id))" @click="router.push(`/survey/${survey._id}`)">
                    Reply
                </Button>
                <Button v-if="isAlreadyReplied(survey._id)" variant="outline" class="border-green-600 text-green-600" disabled>
                    Already replied !
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
                            <Label for="link" class="sr-only">Link</Label>
                            <Input
                            id="link"
                            :default-value="`${urlOrigin}/survey/${survey._id}`"
                            />
                        </div>

                        <TooltipProvider>
                            <Tooltip :open="copiedSurveyId === survey._id">
                            <TooltipTrigger as-child>
                                <Button
                                type="button"
                                size="sm"
                                class="px-3 flex items-center justify-center"
                                @click="copyToClipboard(`${urlOrigin}/survey/${survey._id}`, survey._id)"
                                >
                                <component
                                    :is="copiedSurveyId === survey._id ? Check : Copy"
                                    class="w-4 h-4 transition-transform duration-300"
                                />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top" class=" text-white">
                                Copied!
                            </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
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
