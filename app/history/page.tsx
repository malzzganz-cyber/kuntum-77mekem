"use client";

import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function History() {
  const { user, loading } = useAuth();
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      
      try {
        const q = query(
          collection(db, 'orders'),
          where('userId', '==', user.uid)
        );
        
        const qSnap = await getDocs(q);
        const data = qSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
        
        // Sort explicitly because orderBy needs a composite index along with where('userId')
        data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setHistoryData(data);
      } catch (err) {
        console.error("Failed fetching history", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (!loading) fetchHistory();
  }, [user, loading]);

  if (loading) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black uppercase">Riwayat</h1>
      
      <div className="space-y-4">
        {isLoading ? (
          <div className="brutal-card bg-white text-center py-8">
            <p className="font-bold opacity-50 animate-pulse">Memuat riwayat...</p>
          </div>
        ) : historyData.length === 0 ? (
          <div className="brutal-card bg-white text-center py-8">
            <p className="font-bold opacity-50">Belum ada transaksi</p>
          </div>
        ) : (
          historyData.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`brutal-card ${item.status === 'success' ? 'bg-green' : item.status === 'cancel' ? 'bg-pink' : 'bg-yellow'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-black text-lg">{item.service || 'Nomor API'}</h3>
                  <p className="font-bold text-sm bg-white inline-block px-2 py-1 brutal-border rounded-md mt-1">
                    {item.number}
                  </p>
                </div>
                <span className={`font-bold text-xs uppercase px-2 py-1 rounded-md brutal-border bg-white ${item.status === 'success' ? 'text-green-600' : item.status === 'cancel' ? 'text-red-500' : 'text-yellow-600'}`}>
                  {item.status}
                </span>
              </div>
              <div className="flex justify-between items-center mt-4 border-t-2 border-black border-dashed pt-2">
                <p className="text-xs font-bold">{new Date(item.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                <p className="text-xs font-bold opacity-70">Rp {item.price?.toLocaleString('id-ID')}</p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
