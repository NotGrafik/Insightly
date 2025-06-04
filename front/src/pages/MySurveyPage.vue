<script setup>
import PageTemplate from './PageTemplate.vue';

import { Button } from '@/components/ui/button';
</script>

<template>
  <PageTemplate pageInfos="My Surveys">
    <Button @click="$router.push('/me/survey/create')">
      + Create survey
    </Button>
  </PageTemplate>
</template>