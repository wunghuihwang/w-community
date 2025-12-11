import { postLogin } from '@/lib/supabase/auth';
import { useMutation } from '@tanstack/react-query';

export function useLoginRequest() {
    return useMutation({
        mutationFn: ({ email, password }: { email: string; password: string }) => postLogin(email, password),

        onSuccess: (success) => {
            console.log('login post success:', success);
        },

        onError: (error) => {
            console.error('login post failed:', error);
        },
    });
}
