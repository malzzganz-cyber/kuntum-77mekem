"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success('Login berhasil');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        toast.success('Register berhasil');
      }
      router.push('/');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success('Login dengan Google berhasil');
      router.push('/');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="brutal-card w-full max-w-sm bg-yellow flex flex-col space-y-4"
      >
        <h1 className="text-2xl font-black text-center">{isLogin ? 'LOGIN' : 'REGISTER'}</h1>
        
        <form onSubmit={handleAuth} className="space-y-4">
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="brutal-input"
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="brutal-input"
            required
          />
          <button type="submit" className="brutal-btn bg-black text-white w-full">
            {isLogin ? 'Masuk' : 'Daftar'}
          </button>
        </form>

        <div className="text-center font-bold">ATAU</div>

        <button onClick={handleGoogle} className="brutal-btn bg-white w-full flex items-center justify-center gap-2">
          Gunakan Google
        </button>

        <button 
          onClick={() => setIsLogin(!isLogin)} 
          className="text-sm font-bold text-center underline cursor-pointer hover:text-blue-600"
        >
          {isLogin ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Login'}
        </button>
      </motion.div>
    </div>
  );
}
