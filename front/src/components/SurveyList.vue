<script setup>
import { onMounted, defineProps, ref, computed } from "vue";

import { useSidebar } from "@/components/ui/sidebar/utils";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

import {
  Share,
  ChartArea,
  Copy,
  Check,
  EllipsisVertical,
  Trash,
  SquarePen,
  Frown,
} from "lucide-vue-next";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

import { watch } from "vue";
import { useRouter } from "vue-router";
import { set } from "zod";

const router = useRouter();

const props = defineProps({
  SurveyList: {
    type: Array,
    default: () => [],
  },
  isUserSurvey: {
    type: Boolean,
    default: false,
  },
});

const { state } = useSidebar();

const updatedName = ref("");
const updatedDescription = ref("");
const typeButton = computed(() =>
  updatedName.value === "" && updatedDescription.value === ""
    ? "disabled"
    : ""
);

watch(typeButton, (newVal) => {
  console.log("typeButton changed to:", newVal);
});

function formatDescirption(description) {
  if (!description) return "";
  return description.length > 180 ? description.slice(0, 180) + "..." : description;
}

watch(
  () => state.value,
  (newState) => {
    console.log("Sidebar state changed:", newState);
  },
  { immediate: true }
);

const urlOrigin = window.location.origin;

const copiedSurveyId = ref(null);

function copyToClipboard(link, surveyId) {
  navigator.clipboard.writeText(link).then(() => {
    copiedSurveyId.value = surveyId;

    // 🎉 Lance les confettis
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.6 },
    });

    setTimeout(() => {
      copiedSurveyId.value = null;
    }, 2000);
  });
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

async function isAlreadyReplied(surveyId) {  
  const tokenCookie = getCookie("token");
  const decodedToken = parseJwt(tokenCookie);
  const userId = decodedToken ? decodedToken.id : null;
  if (!userId) return false;
  
  try {
    const response = await fetch(`/api/survey/${surveyId}/responses`);
    if (!response.ok) {
      console.error("Failed to fetch responses:", response.statusText);
      return false;
    }
    const responses = await response.json();
    return responses.some((response) => response.user_id === userId);
  } catch (error) {
    console.error("Error fetching responses:", error);
    return false;
  }
}

async function deleteSurvey(surveyId) {
  try {
    const response = await fetch(`/api/survey/${surveyId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      console.error("Failed to delete survey:", response.statusText);
      return;
    }

    window.location.reload();
  } catch (error) {
    console.error("Error deleting survey:", error);
  }
}

async function updateSurvey(surveyId) {
  if(typeButton.value === "disabled") {
    return;
  }
  try {
    const surveyName = updatedName.value ?  updatedName.value : props.SurveyList.find(s => s._id === surveyId).name;
    const surveyDescription = updatedDescription.value ? updatedDescription.value : props.SurveyList.find(s => s._id === surveyId).description;
    const response = await fetch(`/api/survey/${surveyId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: surveyName,
        description: surveyDescription,
      }),
    });
    if (!response.ok) {
      console.error("Failed to update survey:", response.statusText);
      return;
    }
    const data = await response.json();
    console.log("Survey updated successfully:", data);
  } catch (error) {
    console.error("Error updating survey:", error);
    return;
  }
  confetti({
    particleCount: 100,
    spread: 100,
    origin: { y: 0.6 },
  });
  setTimeout(() => {
    window.location.reload();
  }, 900);
  console.log("Survey updated and redirected to survey page");
}

const replyStatusMap = ref({});

onMounted(async () => {
  console.log("SurveyList component mounted", props.SurveyList);
  
  for (const survey of props.SurveyList) {
    const res = await isAlreadyReplied(survey._id);
    replyStatusMap.value[survey._id] = res;
  }
});
</script>

<template>
  <div
    v-if="SurveyList.length > 0"
    :class="
      state === 'collapsed'
        ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full'
        : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full'
    "
  >
    <Card
      v-for="survey in SurveyList"
      :key="survey.id"
      class="hover:shadow-md transition-shadow duration-200 flex flex-col justify-between dark:hover:shadow-stone-700"
    >
      <div>
        <CardHeader>
          <div class="flex justify-between items-start">
            <div class="flex flex-col gap-2">
              <CardTitle>{{ survey.name }}</CardTitle>
              <CardDescription
                >by
                {{
                  isUserSurvey
                    ? "You"
                    : survey.creator.firstName + " " + survey.creator.lastName
                }}
                </CardDescription
              >
            </div>
            <Popover v-if="isUserSurvey">
              <PopoverTrigger as-child>
                <Button variant="outline" size="icon" class="ml-auto">
                  <EllipsisVertical class="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent class="w-30 m-0 p-2 flex flex-col items-center">
                  <Dialog>
                    <DialogTrigger>
                        <div
                          class="text-secondary-foreground flex items-center cursor-pointer relative p-2 rounded group"
                        >
                        <SquarePen class="size-4 mr-2" />
                        <span
                          class="relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-secondary-foreground after:transition-all after:duration-200 group-hover:after:w-full"
                        >
                          Update
                        </span>
                      </div>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Survey {{ survey.name }}</DialogTitle>
                        <DialogDescription>
                          Make changes to your survey here. Click save when you're done.
                        </DialogDescription>
                      </DialogHeader>
                        <div class="grid gap-4">
                          <Label for="surveyName">Survey Name</Label>
                          <Input
                            id="surveyName"
                            type="text"
                            v-model="updatedName"
                            :placeholder="survey.name"
                          />
                          <Label for="surveyDescription">Description</Label>
                          <Input
                            id="surveyDescription"
                            type="text"
                            v-model="updatedDescription"
                            :placeholder="survey.description"
                          />
                        </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          :variant="typeButton"
                          @click="updateSurvey(survey._id)"
                        >
                          Save Changes
                        </Button>

                      </DialogFooter>
                    </DialogContent>  
                  </Dialog>
                <Separator />
                <div
                  class="text-red-600 flex items-center cursor-pointer relative p-2 rounded group"
                  @click="deleteSurvey(survey._id)"
                >
                  <Trash class="w-4 h-4 mr-2" />
                  <span
                    class="relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-0 after:bg-red-600 after:transition-all after:duration-200 group-hover:after:w-full"
                  >
                    Delete
                  </span>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-secondary-foreground break-words">
            {{ formatDescirption(survey.description) }}
          </p>
        </CardContent>
      </div>
      <CardFooter class="flex justify-between items-center">
        <Button v-if="isUserSurvey" @click="router.push(`/survey/${survey._id}`)">
          <ChartArea class="w-4 h-4" /> Analytics
        </Button>
        <Button
          v-if="!isUserSurvey && replyStatusMap[survey._id] === false"
          @click="router.push(`/survey/${survey._id}`)"
        >
          Reply
        </Button>
        <Button
          v-if="replyStatusMap[survey._id] === true && !isUserSurvey"
          variant="outline"
          class="border-green-600 text-green-600"
          disabled
        >
          Already replied !
        </Button>
        <Dialog>
          <DialogTrigger as-child>
            <Button variant="outline" size="icon">
              <Share class="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share link</DialogTitle>
              <DialogDescription>
                Anyone who has this link will be able to view this.
              </DialogDescription>
            </DialogHeader>
            <div class="flex items-center space-x-2">
              <div class="grid flex-1 gap-2">
                <Label for="link" class="sr-only">Link</Label>
                <Input id="link" :default-value="`${urlOrigin}/survey/${survey._id}`" />
              </div>

              <TooltipProvider>
                <Tooltip :open="copiedSurveyId === survey._id">
                  <TooltipTrigger as-child>
                    <Button
                      type="button"
                      size="sm"
                      class="px-3 flex items-center justify-center"
                      @click="
                        copyToClipboard(`${urlOrigin}/survey/${survey._id}`, survey._id)
                      "
                    >
                      <component
                        :is="copiedSurveyId === survey._id ? Check : Copy"
                        class="w-4 h-4 transition-transform duration-300"
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" class="text-primary-foreground">
                    Copied!
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <DialogFooter class="sm:justify-start">
              <DialogClose as-child>
                <Button type="button" variant="secondary"> Close </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  </div>
  <div
    v-else
    class="w-full flex flex-col items-center justify-center gap-4 flex-grow py-10"
  >
    <h1 class="text-secondary-foreground text-2xl font-bold text-center">
      No surveys available.
    </h1>
    <Frown class="size-24" />
  </div>
</template>
