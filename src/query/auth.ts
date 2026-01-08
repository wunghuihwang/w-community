import { SignUp, postLogin } from '@/lib/supabase/auth';
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

export function useSingUpRequest() {
    return useMutation({
        mutationFn: ({ email, password, username }: { email: string; password: string; username: string }) =>
            SignUp(email, password, username),

        onSuccess: (success) => {
            console.log('signup post success:', success);
        },

        onError: (error) => {
            console.error('signup post failed:', error);
        },
    });
}
