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
