<script setup>
import { ref, reactive, onMounted } from 'vue';
import PageTemplate from './PageTemplate.vue';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Trash, CheckCircle } from 'lucide-vue-next';
import { cn } from '@/lib/utils';
import { useRouter } from 'vue-router';

import { API_BASE_URL } from '@/constants/url';

const router = useRouter();

const submissionSuccess = ref(false);

let user ;

onMounted(() => {
    fetch(`${API_BASE_URL}/user/get`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.json())
    .then(data => {
        user = data;
        survey.creator = user;
    })
    .catch(err => console.error('Error fetching user:', err));

});

const survey = reactive({
    name: '',
    description: '',
    creator: user,
    questions: [
        {
            title: '',
            type: 'open',
            responses: [],
        },
    ],
});

const questionTypes = ['open', 'multiple choices', 'single choice'];

function addQuestion() {
    survey.questions.push({
        title: '',
        type: 'open',
        responses: [],
    });
}

function submitSurvey() {
    fetch(`${API_BASE_URL}/survey/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(survey),
    })
        .then((res) => res.json())
        .then((data) => console.log('Survey created:', data))
        .then(() => {
            submissionSuccess.value = true;
            setTimeout(() => {
                router.push('/me/survey');
            }, 2000);
        })
        .catch((err) => console.error('Error:', err));
}

function removeQuestion(index) {
    if (survey.questions.length > 1) {
        survey.questions.splice(index, 1);
    }
}
</script>

<template>
    <div
        v-if="submissionSuccess"
        class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500"
    >
        <CheckCircle class="text-green-500 w-20 h-20 animate-bounce mb-6" />
        <h2 class="text-xl font-semibold text-center text-foreground">Votre sondage a bien été créé !</h2>
        <p class="text-sm text-muted-foreground mt-2">Redirection en cours...</p>
    </div>
    <PageTemplate pageInfos="Create Survey">
        <div class="flex flex-col items-center justify-center w-full">
            <h1 class="text-2xl font-bold mb-6">Create a New Survey</h1>
            <div class="space-y-4 w-full max-w-3xl">
                <Input v-model="survey.name" placeholder="Survey Title" />
                <Textarea v-model="survey.description" placeholder="Survey Description" rows="3" />

                <div v-for="(question, index) in survey.questions" :key="index">
                    <Card class="mb-4">
                        <CardHeader class="flex justify-between items-start flex-row">
                            <CardTitle>Question {{ index + 1 }}</CardTitle>
                            <Button v-if="survey.questions.length > 1" variant="outline" size="icon" @click="removeQuestion(index)">
                                <Trash class="w-4 h-4" />
                            </Button>
                            <Button v-else variant="disabled" size="icon" disabled>
                                <Trash class="w-4 h-4" />
                            </Button>

                        </CardHeader>
                        <CardContent class="space-y-4">
                            <Input v-model="question.title" placeholder="Question Title" />

                            <Select v-model="question.type">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem v-for="type in questionTypes" :key="type" :value="type">
                                        {{ String(type).charAt(0).toUpperCase() + String(type).slice(1) }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <div v-if="question.type !== 'open'" class="space-y-2">
                                <div v-for="(response, optIdx) in question.responses" :key="optIdx"
                                    class="flex gap-2 mb-2">
                                    <Input v-model="question.responses[optIdx]" placeholder="Option text" />
                                </div>
                                <div class="flex gap-2">
                                    <Button variant="secondary" size="sm" @click="question.responses.push('')">+ Add
                                        option
                                    </Button>
                                    <Button v-if="question.responses.length >= 1" variant="destructive" size="sm"
                                        @click="question.responses.pop()">- Remove
                                        option
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div class="flex flex-col gap-10">
                    <div class="flex flex-col items-start">
                        <Button variant="outline" @click="addQuestion">+ Add Question</Button>
                    </div>
                    <div class="flex flex-col items-center max-w-3xl">
                        <Button @click="submitSurvey">Submit Survey</Button>
                    </div>
                </div>

            </div>
        </div>
    </PageTemplate>
</template>
