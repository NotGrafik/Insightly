<script setup>
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

import { ref } from 'vue';
import { useRouter } from 'vue-router';


const email = ref('');
const password = ref('');
const router = useRouter();

const login = async () => {
  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.value, password: password.value }),
    });
    console.log(response);
    if (response.ok) {
      router.push('/home');
    } else {
      console.error('Login failed');
    }
  } catch (error) {
    console.error('Error during login:', error);
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
        <form @submit.prevent="login">
          <div class="grid gap-6">
            <div class="grid gap-6">
              <div class="grid gap-2">
                <Label html-for="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  v-model="email"
                  placeholder="m@example.com"
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
                <Input id="password" type="password" v-model="password" required />
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
    <div
      class="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary"
    >
      By clicking continue, you agree to our
      <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
    </div>
  </div>
</template>
