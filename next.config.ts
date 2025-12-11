import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    reactCompiler: true,
    images: {
        domains: ['https://mapbkickscojminolnoa.supabase.co', 'images.unsplash.com'],
    },
};

export default nextConfig;
