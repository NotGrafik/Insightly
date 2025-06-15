import { ref } from 'vue';

const user = ref(null);

export const useUser = async () => {
    if (!user.value) {
        const res = await fetch('https://insightly-26vw.onrender.com/user/get');
        user.value = await res.json();
    }
    return { user };
};
