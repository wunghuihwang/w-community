import { createClient } from '@supabase/supabase-js';

import { useMemo } from 'react';
import { Database } from '../../../database.types';
import { TypedSupabaseClient } from './supabase';

let client: TypedSupabaseClient | undefined;

function getSupabaseBrowserClient() {
    if (client) {
        return client;
    }

    client = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

    return client;
}

function useSupabaseBrowser() {
    return useMemo(getSupabaseBrowserClient, []);
}

export default useSupabaseBrowser;
