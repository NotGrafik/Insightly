<script lang="ts">
export const description =
  'A sign up form with first name, last name, email and password inside a card. There\'s an option to sign up with GitHub and a link to login if you already have an account';
export const iframeHeight = '600px';
export const containerClass =
  'w-full h-screen flex items-center justify-center px-4';
</script>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye } from 'lucide-vue-next'
import { EyeClosed } from 'lucide-vue-next'

// Champs liés au formulaire
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)

const handleSubmit = () => {
  console.log('Form submitted with:', {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    passwordHash: password.value,
  })
  fetch('/api/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    passwordHash: password.value,
  }),
})
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    return response.json()
  })
  .then((data) => {
    console.log('Success:', data)
  })
  .catch((error) => {
    console.error('Error:', error)
  })
}
</script>

<template>
  <div
    class="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10"
  >
    <Card class="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle class="text-xl"> Sign Up </CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form class="grid gap-4" @submit.prevent="handleSubmit">
          <div class="grid grid-cols-2 gap-4">
            <div class="grid gap-2">
              <Label for="first-name">First name</Label>
              <Input id="first-name" v-model="firstName" placeholder="Max" required />
            </div>
            <div class="grid gap-2">
              <Label for="last-name">Last name</Label>
              <Input id="last-name" v-model="lastName" placeholder="Robinson" required />
            </div>
          </div>
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input id="email" v-model="email" type="email" placeholder="m@example.com" required />
          </div>
          <div class="grid gap-2">
            <Label for="password">Password</Label>
            <div class="relative w-full max-w-sm">
              <Input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                placeholder="••••"
                class="pr-10"
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
          </div>
          <Button type="submit" class="w-full"> Create an account </Button>
        </form>
        <div class="mt-4 text-center text-sm">
          Already have an account?
          <a href="/auth/login" class="underline"> Sign in </a>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
