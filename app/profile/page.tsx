"use client";

import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { LogOut, User, Edit2 } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Profile() {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) return <div className="p-4 font-bold text-center animate-pulse">Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black uppercase">Profile Saya</h1>
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="brutal-card bg-pink flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="bg-white p-4 rounded-full brutal-border brutal-shadow-sm">
            <User className="w-8 h-8" />
          </div>
          <div className="overflow-hidden">
            <h2 className="font-bold text-xl truncate max-w-[150px]">{userData?.name || 'User'}</h2>
            <p className="text-xs font-medium truncate max-w-[150px]">{userData?.email}</p>
          </div>
        </div>
        <button className="brutal-btn bg-white px-2 py-2">
          <Edit2 className="w-4 h-4" />
        </button>
      </motion.div>

      <div className="brutal-card bg-white space-y-2">
        <h3 className="font-bold text-lg mb-4">Informasi Saldo & Akun</h3>
        
        <div className="flex justify-between items-center py-2 border-b-2 border-black border-dashed">
          <span className="font-bold">Saldo Tersedia</span>
          <span className="font-black text-xl text-blue-600">Rp {userData?.balance?.toLocaleString('id-ID') || 0}</span>
        </div>
      </div>

      <button 
        onClick={() => {auth.signOut(); router.push('/')}}
        className="brutal-btn bg-black text-white w-full flex justify-center items-center gap-2"
      >
        <LogOut className="w-5 h-5" /> Keluar
      </button>
    </div>
  );
}
