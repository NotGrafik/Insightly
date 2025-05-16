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
    items?: {
      title: string
      url: string
    }[]
  }[]
}>()

const activeItem = ref<string | null>(null)

function setActive(itemTitle: string, url?: string) {
  if (activeItem.value === itemTitle) {
    activeItem.value = null
    localStorage.setItem('CurrentNav', itemTitle);
    if (url) router.push(url)
  } else {
    activeItem.value = itemTitle
    localStorage.setItem('CurrentNav', itemTitle);
    if (url) router.push(url)
  }
}

setActive(localStorage.getItem('CurrentNav'))
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
            <SidebarMenuButton :tooltip="item.title" @click="setActive(item.title, item.url)">
              <component :is="item.icon" v-if="item.icon" />
              <span>{{ item.title }}</span>
            </SidebarMenuButton>
          </CollapsibleTrigger>
        </SidebarMenuItem>
        <CollapsibleContent v-if="item.items">
          <SidebarMenuSub>
            <SidebarMenuSubButton>
              <ChevronRight />
              <span>Documentation</span>
            </SidebarMenuSubButton>
            <SidebarMenuItem
              v-for="subItem in item.items"
              :key="subItem.title"
            >
              <SidebarMenuSubItem :tooltip="subItem.title" :href="subItem.url">
                <span>{{ subItem.title }}</span>
              </SidebarMenuSubItem>
            </SidebarMenuItem>
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenu>
  </SidebarGroup>
</template>
