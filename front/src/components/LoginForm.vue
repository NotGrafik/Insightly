<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { Eye, EyeClosed } from 'lucide-vue-next'


const router = useRouter();

const email = ref('');
const password = ref('');
const showPassword = ref(false);

const formErrors = reactive({
  globalError: '',
});

// Reset les erreurs quand on tape dans les champs
watch(email, () => (formErrors.globalError = ''));

const handleSubmit = async () => {
  formErrors.globalError = '';

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.value, password: password.value }),
    });

    if (response.ok) {
      localStorage.setItem('CurrentNav', 'Home');
      router.push('/home');
    } else if (response.status === 401) {
      formErrors.globalError = 'Email or password is incorrect';
    } else {
      console.error('Unexpected login error:', await response.text());
    }
  } catch (error) {
    console.error('Network error during login:', error);
  }
};

</script>

<template>
  <div class="flex flex-col gap-6">
    <Card>
      <CardHeader class="text-center">
        <CardTitle class="text-xl"> Welcome back </CardTitle>
        <CardDescription>
          Login with your Insightly account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleSubmit">
          <div class="grid gap-6">
            <div class="grid gap-6">
              <div class="grid gap-2">
                <Label html-for="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  v-model="email"
                  placeholder="m@example.com"
                  :class="formErrors.globalError ? 'border-red-500 ring-1 ring-red-500' : ''"
                  required
                />
              </div>
              <div class="grid gap-2">
                <div class="flex items-center">
                  <Label html-for="password">Password</Label>
                  <a
                    href="#"
                    class="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <div class="relative w-full max-w-sm">
                  <Input 
                    id="password"
                    :type="showPassword ? 'text' : 'password'"
                    v-model="password"
                    class="pr-10"
                    :class="formErrors.globalError ? 'border-red-500 ring-1 ring-red-500' : ''"
                    required 
                  />
                  <span
                    class="absolute end-0 inset-y-0 flex items-center justify-center px-2 cursor-pointer"
                    @click="showPassword = !showPassword"
                  >
                    <EyeClosed v-if="!showPassword" class="size-5 text-muted-foreground" />
                    <Eye v-if="showPassword" class="size-5 text-muted-foreground" />
                  </span>
                </div>
                <p v-if="formErrors.globalError" class="text-sm text-red-500">{{ formErrors.globalError }}</p>
              </div>
              <Button type="submit" class="w-full"> Login </Button>
            </div>
            <div class="text-center text-sm">
              Don't have an account?
              <a href="/auth/register" class="underline underline-offset-4"> Sign up </a>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
