import { createBrowserClient } from '@supabase/ssr';

export async function postLogin(email: string, password: string) {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        console.error('login post error:', error);
        throw error;
    }

    return data;
}

export const SignUp = async (email: string, password: string, username: string) => {
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                username,
            },
        },
    });

    if (error) throw error;

    if (data.user) {
        const { error: profileError } = await supabase.from('profiles').insert([
            {
                id: data.user.id,
                username,
                email,
            },
        ]);

        if (profileError) throw profileError;
    }

    return data;
};
