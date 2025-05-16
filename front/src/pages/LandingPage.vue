<script setup lang="ts">
import { Button } from '@/components/ui/button'
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="flex space-x-4">
      <Button @click="$router.push('/auth/login')" variant="default" class="bg-black text-white hover:bg-gray-800">
        Login
      </Button>
      <Button @click="$router.push('/auth/register')" variant="outline" class="bg-white text-black hover:bg-gray-100">
        Register
      </Button>
    </div>
  </div>
</template>
