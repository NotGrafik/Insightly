<script setup>
import { ref, reactive, onMounted } from 'vue';
import PageTemplate from './PageTemplate.vue';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

let user ;

onMounted(() => {
    fetch('/api/user/get', {
        method: 'GET',
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
        type: 'text',
        responses: [],
    });
}

function submitSurvey() {
    fetch('/api/survey/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(survey),
    })
        .then((res) => res.json())
        .then((data) => console.log('Survey created:', data))
        .catch((err) => console.error('Error:', err));
}
</script>

<template>
    <PageTemplate pageInfos="Create Survey">
        <div class="flex flex-col items-center justify-center w-full">
            <h1 class="text-2xl font-bold mb-6">Create a New Survey</h1>
            <div class="space-y-4 w-full max-w-3xl">
                <Input v-model="survey.name" placeholder="Survey Title" />
                <Textarea v-model="survey.description" placeholder="Survey Description" rows="3" />

                <div v-for="(question, index) in survey.questions" :key="index">
                    <Card class="mb-4">
                        <CardHeader>
                            <CardTitle>Question {{ index + 1 }}</CardTitle>
                        </CardHeader>
                        <CardContent class="space-y-4">
                            <Input v-model="question.title" placeholder="Question Title" />

                            <Select v-model="question.type">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select question type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem v-for="type in questionTypes" :key="type" :value="type">
                                        {{ String(type).charAt(0).toUpperCase() + String(type).slice(1) }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <div v-if="question.type !== 'open'">
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
