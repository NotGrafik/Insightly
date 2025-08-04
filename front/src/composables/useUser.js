import { ref } from 'vue';

import { API_BASE_URL } from '@/constants/url';
const user = ref(null);

export const useUser = async () => {
    if (!user.value) {
        const res = await fetch(`${API_BASE_URL}/user/get`);
        user.value = await res.json();
    }
    return { user };
};
