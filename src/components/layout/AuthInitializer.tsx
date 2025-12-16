'use client';

import useSupabaseBrowser from '@/lib/supabase/supabase-browser';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect } from 'react';

export const AuthInitializer = () => {
    const supabase = useSupabaseBrowser();
    const { setUser, setLoading } = useAuthStore();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session }, error }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, [supabase, setUser, setLoading]);

    return null;
};
