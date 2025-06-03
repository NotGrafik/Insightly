<script setup lang="ts">
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { ChevronRight, type LucideIcon } from 'lucide-vue-next'
import { ref } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter();

defineProps<{
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
  }[]
}>()

const activeItem = ref<string | null>(null)

function setActive(itemTitle: string, url?: string) {
  if (activeItem.value === itemTitle) {
    activeItem.value = null
  } else {
    activeItem.value = itemTitle
    localStorage.setItem('activeItem', itemTitle)
  if (url) {
    window.location.href = url
  }
}

setActive(localStorage.getItem('activeItem') || 'Home');
</script>

<template>
  <SidebarGroup>
    <SidebarGroupLabel>Home</SidebarGroupLabel>
    <SidebarMenu>
      <Collapsible
        v-for="item in items"
        :key="item.title"
        as-child
        class="group/collapsible"
      >
        <SidebarMenuItem :class="activeItem === item.title && 'bg-gray-100 dark:bg-gray-600 rounded-md'">
          <CollapsibleTrigger as-child>
            <SidebarMenuButton :tooltip="item.title" @click="setActive(item.title, item.url); console.log(item.url)">
              <component :is="item.icon" v-if="item.icon" />
              <span>{{ item.title }}</span>
            </SidebarMenuButton>
          </CollapsibleTrigger>
        </SidebarMenuItem>
      </Collapsible>
    </SidebarMenu>
  </SidebarGroup>
</template>
