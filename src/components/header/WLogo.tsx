import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

type Size = 'sm' | 'md' | 'lg';

export const WLogo = ({ size = 'md' }: { size: Size }) => {
    const router = useRouter();
    const sizes = {
        sm: 'w-8 h-8 text-xl',
        md: 'w-10 h-10 text-2xl',
        lg: 'w-16 h-16 text-5xl',
    };

    return (
        <motion.div
            onClick={() => router.push('/')}
            className={`${sizes[size]} bg-blue-500 rounded-lg flex items-center justify-center font-black text-white cursor-pointer`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <span>W</span>
        </motion.div>
    );
};
