"use client";

import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function AdminMarkup() {
  const { user, isAdmin, loading } = useAuth();
  const [markup, setMarkup] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      toast.error('Akses ditolak!');
      router.push('/');
    }
  }, [user, isAdmin, loading, router]);

  useEffect(() => {
    const fetchMarkup = async () => {
      const docRef = doc(db, 'settings', 'pricing');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setMarkup(docSnap.data().markup || 0);
      }
    };
    if (isAdmin) {
      fetchMarkup();
    }
  }, [isAdmin]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'pricing'), { markup, updatedAt: new Date().toISOString() });
      toast.success('Markup berhasil disimpan');
    } catch (err: any) {
      toast.error('Gagal: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !isAdmin) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black uppercase">Admin Panel</h1>
      
      <div className="brutal-card bg-pink">
        <h2 className="font-bold mb-4">Pengaturan Markup (Keuntungan)</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="font-bold block mb-1">Markup (Rp)</label>
            <input 
              type="number" 
              className="brutal-input text-lg"
              value={markup}
              onChange={(e) => setMarkup(Number(e.target.value))}
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={isSaving}
            className="brutal-btn bg-black text-white w-full"
          >
            {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>
    </div>
  );
}
