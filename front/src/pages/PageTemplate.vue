<script setup>
import { ref, onMounted } from 'vue';

defineProps({
    pageInfos: {
        type: String,
        required: true,
    },
})

import AppSidebar from '@/components/AppSidebar.vue';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { Sun, Moon, ArrowLeft } from 'lucide-vue-next';
import { useRouter } from 'vue-router';

const router = useRouter();

// Reactive state for theme
const isDark = ref(false);

// Detect initial theme on mount
onMounted(() => {
    if (localStorage.theme === 'dark') {
        document.documentElement.classList.add('dark');
        isDark.value = true;
    } else {
        document.documentElement.classList.remove('dark');
        isDark.value = false;
    }
});

const toggleDarkMode = () => {
    isDark.value = !isDark.value;
    if (isDark.value) {
        document.documentElement.classList.add('dark');
        localStorage.theme = 'dark';
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.theme = 'light';
    }
}
</script>

<template>
    <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
            <header
                class="flex mt-4 mb-6 shrink-0 items-center gap-2 transition-[width,height] ease-linear justify-between px-4">
                <div class="flex items-center gap-2">
                    <SidebarTrigger class="-ml-1" />
                    <Separator orientation="vertical" class="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <ArrowLeft v-if="$route.path !== '/home' && $route.path !== '/me/survey'"
                                class="w-4 h-4 cursor-pointer" @click="router.back()" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{{ pageInfos }}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div>
                    <Button variant="outline" size="icon" @click="toggleDarkMode">
                        <Sun v-if="!isDark" class="w-4 h-4" />
                        <Moon v-else class="w-4 h-4" />
                    </Button>
                </div>
            </header>
            <div class="flex items-center justify-center gap-2 px-4 w-full mb-4">
                <slot></slot>
            </div>
        </SidebarInset>
    </SidebarProvider>
</template>
