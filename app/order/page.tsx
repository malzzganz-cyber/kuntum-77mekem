"use client";

import { useAuth } from '@/hooks/useAuth';
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy } from 'lucide-react';

export default function Order() {
  const { user, userData, loading } = useAuth();
  const [services, setServices] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [operators, setOperators] = useState<any[]>([]);
  
  const [selectedService, setSelectedService] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('any');
  
  const [isLoading, setIsLoading] = useState(false);
  
  // OTP State
  const [activeOrder, setActiveOrder] = useState<any>(null);

  useEffect(() => {
    axios.get('/api/services').then(res => setServices(res.data?.data || []));
  }, []);

  useEffect(() => {
    if (selectedService) {
      axios.get(`/api/countries?service_id=${selectedService}`).then(res => setCountries(res.data?.data || []));
      setSelectedCountry('');
      setSelectedOperator('any');
    }
  }, [selectedService]);

  useEffect(() => {
    if (selectedService && selectedCountry) {
      axios.get(`/api/operators?country=${selectedCountry}&provider_id=${selectedService}`)
           .then(res => setOperators(res.data?.data || []));
      setSelectedOperator('any');
    }
  }, [selectedCountry, selectedService]);

  useEffect(() => {
    if (!activeOrder?.order_id) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`/api/otp?order_id=${activeOrder.order_id}`);
        // assume api returns { data: { status: 'success', sms: '...', number: '...' } }
        if (res.data?.data) {
          setActiveOrder(res.data.data);
          if (res.data.data.status === 'success' || res.data.data.status === 'cancel') {
            clearInterval(interval);
            if (res.data.data.status === 'success') {
                toast.success('OTP Berhasil diterima!');
            }
          }
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [activeOrder?.order_id]);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedCountry) {
      toast.error('Pilih layanan dan negara!');
      return;
    }
    
    setIsLoading(true);
    let url = `/api/orders?provider_id=${selectedService}&number_id=${selectedCountry}`;
    if (selectedOperator && selectedOperator !== 'any') {
      url += `&operator_id=${selectedOperator}`;
    }

    try {
      const res = await axios.get(url);
      if (res.data?.data?.order_id) {
        toast.success('Order berhasil dibuat!');
        setActiveOrder({
          ...res.data.data,
          status: 'pending'
        });
      } else {
        toast.error('Gagal membuat order');
      }
    } catch (err: any) {
      toast.error('Gagal: ' + (err.response?.data?.error || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!activeOrder?.order_id) return;
    try {
      await axios.get(`/api/otp?order_id=${activeOrder.order_id}&status=cancel`);
      toast.success('Order dibatalkan');
      setActiveOrder(null);
    } catch (err) {
      toast.error('Gagal membatalkan');
    }
  };

  if (loading) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black uppercase">Order Nomor</h1>

      <AnimatePresence mode="wait">
        {!activeOrder ? (
          <motion.div 
            key="order-form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="brutal-card bg-blue space-y-4"
          >
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div>
                <label className="font-bold block mb-1">Pilih Layanan</label>
                <select 
                  className="brutal-input bg-white"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  required
                >
                  <option value="">-- Pilih Layanan --</option>
                  {services.map((s, idx) => (
                    <option key={`service-${s.id || idx}-${idx}`} value={s.id}>{s.name} - Rp {s.price}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">Pilih Negara</label>
                <select 
                  className="brutal-input bg-white"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  disabled={!selectedService}
                  required
                >
                  <option value="">-- Pilih Negara --</option>
                  {countries.map((c, idx) => (
                    <option key={`country-${c.id || idx}-${idx}`} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">Pilih Operator</label>
                <select 
                  className="brutal-input bg-white"
                  value={selectedOperator}
                  onChange={(e) => setSelectedOperator(e.target.value)}
                  disabled={!selectedCountry}
                >
                  <option value="any">Any (Otomatis)</option>
                  {operators.map((o, idx) => (
                    <option key={`op-${o.id || idx}-${idx}`} value={o.id}>{o.name}</option>
                  ))}
                </select>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="brutal-btn bg-black text-white w-full py-3 mt-4 text-lg"
              >
                {isLoading ? 'Memproses...' : 'Dapatkan Nomor'}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            key="otp-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="brutal-card bg-yellow flex flex-col items-center py-8"
          >
            <div className="bg-white px-6 py-4 rounded-xl brutal-border brutal-shadow w-full text-center">
              <span className="text-sm font-bold opacity-70 block mb-1">Nomor Virtual Anda</span>
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-3xl font-black">{activeOrder.number}</h2>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(activeOrder.number);
                    toast.success('Nomor disalin!');
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <Copy className="w-5 h-5 text-black" />
                </button>
              </div>
            </div>

            <div className="mt-8 bg-white px-6 py-6 rounded-xl brutal-border brutal-shadow w-full text-center min-h-[140px] flex flex-col justify-center">
              <span className="text-sm font-bold opacity-70 block mb-2">Kode OTP</span>
              {activeOrder.status === 'success' ? (
                <h3 className="text-4xl font-black text-green-600 tracking-widest">{activeOrder.sms}</h3>
              ) : activeOrder.status === 'cancel' ? (
                <h3 className="text-xl font-black text-red-600">Order Dibatalkan</h3>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4 font-bold text-sm animate-pulse">Menunggu SMS...</p>
                </div>
              )}
            </div>

            {activeOrder.status === 'pending' && (
              <button 
                onClick={handleCancel}
                className="mt-6 text-sm underline font-bold text-red-600 hover:text-red-800"
              >
                Batalkan Order (Refund)
              </button>
            )}
            
            {(activeOrder.status === 'success' || activeOrder.status === 'cancel') && (
              <button 
                onClick={() => setActiveOrder(null)}
                className="mt-6 brutal-btn bg-black text-white w-full"
              >
                Order Baru
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
