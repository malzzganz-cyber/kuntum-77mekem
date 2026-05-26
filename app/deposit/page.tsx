"use client";

import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import QRCode from 'qrcode';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc, increment } from 'firebase/firestore';

export default function Deposit() {
  const { user, userData, loading } = useAuth();
  const [amount, setAmount] = useState('');
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [depositId, setDepositId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseInt(amount) < 1000) {
      toast.error('Minimal deposit Rp 1.000');
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.get(`/api/deposit?action=create&amount=${amount}`);
      if (res.data?.data?.qr_string) {
        const qrDataUrl = await QRCode.toDataURL(res.data.data.qr_string);
        setQrCodeData(qrDataUrl);
        setDepositId(res.data.data.deposit_id);
      } else {
        toast.error('Gagal membuat QRIS');
      }
    } catch (err: any) {
      toast.error('Gagal: ' + (err.response?.data?.error || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!depositId || !user) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`/api/deposit?action=status&deposit_id=${depositId}`);
        if (res.data?.data?.status === 'success') {
          // Increase user balance
          await updateDoc(doc(db, 'users', user.uid), {
            balance: increment(Number(amount))
          });

          // Log notification
          await addDoc(collection(db, 'notifications'), {
            userId: user.uid,
            message: `Deposit Rp ${Number(amount).toLocaleString('id-ID')} Berhasil!`,
            type: 'success',
            read: false,
            createdAt: new Date().toISOString()
          });

          setQrCodeData(null);
          setDepositId(null);
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Polling error', err);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [depositId, user, amount]);

  if (loading) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black uppercase">Isi Saldo</h1>
      
      {!qrCodeData ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="brutal-card bg-green">
          <h2 className="font-bold mb-4">Pilih Nominal Deposit</h2>
          <form onSubmit={handleDeposit} className="space-y-4">
            <input 
              type="number" 
              placeholder="Minimal Rp 1.000" 
              className="brutal-input text-lg"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1000"
              required
            />
            <button 
              type="submit" 
              disabled={isLoading}
              className="brutal-btn bg-black text-white w-full"
            >
              {isLoading ? 'Memproses...' : 'Buat QRIS'}
            </button>
          </form>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="brutal-card bg-white flex flex-col items-center">
          <h2 className="font-bold text-xl mb-2 text-center">Scan QRIS</h2>
          <p className="text-sm text-center mb-4 font-medium">Buka aplikasi e-Wallet atau M-Banking Anda dan scan QR di bawah ini.</p>
          <div className="bg-white p-4 rounded-xl brutal-border brutal-shadow-sm inline-block">
            <img src={qrCodeData} alt="QRIS" className="w-[200px] h-[200px]" />
          </div>
          <p className="font-black text-2xl mt-4 text-blue-600">Rp parseInt(amount).toLocaleString('id-ID')</p>
          <p className="text-xs font-bold mt-4 animate-pulse">Menunggu pembayaran... (Auto Cek)</p>
          <button 
            onClick={() => { setQrCodeData(null); setDepositId(null); }}
            className="mt-6 text-sm underline font-bold"
          >
            Batalkan Deposit
          </button>
        </motion.div>
      )}
    </div>
  );
}
