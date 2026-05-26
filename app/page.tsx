"use client";

import { motion } from 'framer-motion';
import { ArrowRight, Key, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-8 pb-10">
      {/* Hero Section */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="brutal-card bg-yellow mt-4 flex flex-col items-center text-center space-y-4"
      >
        <div className="bg-white p-3 rounded-full brutal-border brutal-shadow-sm">
          <Zap className="w-8 h-8 text-black" />
        </div>
        <div>
          <h1 className="text-3xl font-black uppercase">Malzz Nokos</h1>
          <p className="font-medium mt-1">
            Platform nomor virtual OTP otomatis tercepat dan termurah.
          </p>
        </div>
        <Link href="/order" className="w-full">
          <button className="brutal-btn bg-blue w-full flex items-center justify-center gap-2 py-3 mt-2 text-lg">
            Mulai Order <ArrowRight className="w-5 h-5" />
          </button>
        </Link>
      </motion.div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Total Users', value: '1,240+', color: 'bg-pink' },
          { label: 'Transaksi', value: '8,500+', color: 'bg-green' },
          { label: 'Sukses', value: '99.9%', color: 'bg-blue' },
          { label: 'Layanan', value: '500+', color: 'bg-yellow' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
            className={`brutal-card ${stat.color} flex flex-col items-center justify-center py-6`}
          >
            <h3 className="text-2xl font-black">{stat.value}</h3>
            <p className="text-sm font-bold mt-1 text-center">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Features */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-black uppercase mb-4 px-2">Keunggulan</h2>
        
        <div className="brutal-card flex items-start gap-4">
          <div className="bg-pink p-2 rounded-xl brutal-border brutal-shadow-sm">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Super Cepat</h3>
            <p className="text-sm">Sistem otomasi 24/7 tanpa delay.</p>
          </div>
        </div>

        <div className="brutal-card flex items-start gap-4">
          <div className="bg-green p-2 rounded-xl brutal-border brutal-shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Aman & Private</h3>
            <p className="text-sm">Nomor fresh untuk keamanan akun anda.</p>
          </div>
        </div>

        <div className="brutal-card flex items-start gap-4">
          <div className="bg-blue p-2 rounded-xl brutal-border brutal-shadow-sm">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Deposit QRIS Auto</h3>
            <p className="text-sm">Topup saldo 1 detik masuk otomatis.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
