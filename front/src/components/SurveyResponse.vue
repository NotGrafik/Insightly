<script setup>
import { ref } from 'vue';
import PageTemplate from '@/pages/PageTemplate.vue';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-vue-next';
import { cn } from '@/lib/utils';
import { useRouter } from 'vue-router';

const router = useRouter();

const submissionSuccess = ref(false);

const props = defineProps({
    survey: Object,
    user: Object,
});

const answers = ref(props.survey.questions.map((q) => {
    if (q.type === 'multiple choices') return [];
    else return '';
}));

const submitAnswers = async () => {
    const payload = {
        survey_id: props.survey._id,
        user_id: props.user._id,
        responses: props.survey.questions.map((q, i) => ({
            question_id: q._id,
            response: answers.value[i],
        })),
    };

    try {
        const res = await fetch(`/api/survey/${props.survey._id}/response`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error('Erreur serveur');
        
        submissionSuccess.value = true;

        setTimeout(() => {
            router.push('/home');
        }, 2000);
    } catch (err) {
        console.error('Erreur de soumission', err);
        alert('Erreur lors de l’envoi des réponses.');
    }
};
</script>

<template>
    <div
        v-if="submissionSuccess"
        class="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500"
    >
        <CheckCircle class="text-green-500 w-20 h-20 animate-bounce mb-6" />
        <h2 class="text-xl font-semibold text-center text-foreground">Vos réponses ont bien été prises en compte !</h2>
        <p class="text-sm text-muted-foreground mt-2">Redirection en cours...</p>
    </div>
    <div class="flex flex-col items-center w-full">
        <h1 class="text-2xl font-bold mb-2 text-center">{{ survey.name }}</h1>
        <p class="text-gray-500 mb-8 text-center max-w-2xl">{{ survey.description }}</p>

        <div class="w-full max-w-3xl space-y-6">
            <div v-for="(question, index) in survey.questions" :key="question._id">
                <Card class='w-full max-w-2xl'>
                    <CardHeader>
                        <CardTitle>Question {{ index + 1 }}</CardTitle>
                    </CardHeader>
                    <CardContent class="space-y-4">
                        <p class="font-semibold">{{ question.title }}</p>

                        <!-- Question ouverte -->
                        <div v-if="question.type === 'open'">
                            <Textarea v-model="answers[index]" placeholder="Votre réponse..." rows="3" />
                        </div>

                        <!-- Choix unique -->
                        <div v-else-if="question.type === 'single choice'" class="space-y-2">
                            <div v-for="(option, optIdx) in question.responses" :key="optIdx"
                                class="flex items-center gap-2">
                                <input type="radio" :name="`q-${index}`" :value="option" v-model="answers[index]"
                                    class="accent-blue-600" />
                                <label>{{ option }}</label>
                            </div>
                        </div>

                        <!-- Choix multiples -->
                        <div v-else-if="question.type === 'multiple choices'" class="space-y-2">
                            <div v-for="(option, optIdx) in question.responses" :key="optIdx"
                                class="flex items-center gap-2">
                                <input type="checkbox" :value="option" v-model="answers[index]"
                                    class="accent-blue-600" />
                                <label>{{ option }}</label>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <!-- Bouton de soumission -->
            <div class="flex justify-center pt-4">
                <Button @click="submitAnswers">Soumettre mes réponses</Button>
            </div>
        </div>
    </div>
</template>
