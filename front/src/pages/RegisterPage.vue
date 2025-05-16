<script lang="ts">
export const description =
  'A sign up form with first name, last name, email and password inside a card. There\'s an option to sign up with GitHub and a link to login if you already have an account';
export const iframeHeight = '600px';
export const containerClass =
  'w-full h-screen flex items-center justify-center px-4';
</script>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { watch } from 'vue'
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

import { useRouter } from 'vue-router';

// Champs liés au formulaire
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)

const router = useRouter();

const formErrors = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
})

watch(
  [firstName, lastName, email, password],
  () => {
    formErrors.firstName = ''
    formErrors.lastName = ''
    formErrors.email = ''
    formErrors.password = ''
  },
)

const schema = z.object({
  firstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(30, 'First name must be at most 30 characters')
    .regex(/^[a-zA-ZÀ-ÿ\-'\s]+$/, 'First name contains invalid characters'),

  lastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(30, 'Last name must be at most 30 characters')
    .regex(/^[a-zA-ZÀ-ÿ\-'\s]+$/, 'Last name contains invalid characters'),

  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(64, 'Password must be at most 64 characters')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one digit')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
})



const handleSubmit = () => {
  // Réinitialiser les erreurs
  formErrors.firstName = ''
  formErrors.lastName = ''
  formErrors.email = ''
  formErrors.password = ''

  const result = schema.safeParse({
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    password: password.value,
  })

  if (!result.success) {
    result.error.errors.forEach((err) => {
      const field = err.path[0] as keyof typeof formErrors
      formErrors[field] = err.message
    })
    return
  }

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
      if (!response.ok) throw new Error('Network response was not ok')
      return response.json()
    })
    .then((data) => {
      console.log('Success:', data)
      router.push('/auth/login');
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
              <Input
                id="first-name"
                v-model="firstName"
                placeholder="Max"
                :class="formErrors.firstName ? 'border-red-500 ring-1 ring-red-500' : ''"
              />
              <p v-if="formErrors.firstName" class="text-sm text-red-500">{{ formErrors.firstName }}</p>
            </div>
            <div class="grid gap-2">
              <Label for="last-name">Last name</Label>
              <Input
                id="last-name"
                v-model="lastName"
                placeholder="Robinson"
                :class="formErrors.lastName ? 'border-red-500 ring-1 ring-red-500' : ''"
              />
              <p v-if="formErrors.lastName" class="text-sm text-red-500">{{ formErrors.lastName }}</p>
            </div>
          </div>

          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="email"
              type="email"
              placeholder="m@example.com"
              :class="formErrors.email ? 'border-red-500 ring-1 ring-red-500' : ''"
            />
            <p v-if="formErrors.email" class="text-sm text-red-500">{{ formErrors.email }}</p>
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
                :class="formErrors.password ? 'border-red-500 ring-1 ring-red-500' : ''"
              />
              <span
                class="absolute end-0 inset-y-0 flex items-center justify-center px-2 cursor-pointer"
                @click="showPassword = !showPassword"
              >
                <EyeClosed v-if="!showPassword" class="size-5 text-muted-foreground" />
                <Eye v-if="showPassword" class="size-5 text-muted-foreground" />
              </span>
            </div>
            <p v-if="formErrors.password" class="text-sm text-red-500">{{ formErrors.password }}</p>
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
