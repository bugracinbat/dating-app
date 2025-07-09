'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-b from-bumble-yellow to-bumble-yellow-dark">
      <div className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-2">
            <Heart className="w-8 h-8 text-white fill-white" />
            <span className="text-2xl font-bold text-white">Bumble</span>
          </div>
          <div className="space-x-4">
            <button
              onClick={() => router.push('/login')}
              className="text-white hover:underline"
            >
              Sign In
            </button>
          </div>
        </nav>

        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            Make the First Move
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl text-white mb-12 max-w-2xl"
          >
            Start building valuable relationships, finding friends, and making empowered connections.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4"
          >
            <button
              onClick={() => router.push('/register')}
              className="block w-64 bg-white text-bumble-yellow font-bold py-4 px-8 rounded-full hover:bg-gray-100 transition-colors"
            >
              Join Bumble
            </button>
            <button
              onClick={() => router.push('/login')}
              className="block w-64 bg-transparent border-2 border-white text-white font-bold py-4 px-8 rounded-full hover:bg-white hover:text-bumble-yellow transition-colors"
            >
              Sign In
            </button>
          </motion.div>
        </div>
      </div>
    </main>
  );
}