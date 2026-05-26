"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Wallet, ShoppingCart, Clock, User } from 'lucide-react';
import { motion } from 'framer-motion';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Deposit', href: '/deposit', icon: Wallet },
    { name: 'Order', href: '/order', icon: ShoppingCart },
    { name: 'History', href: '/history', icon: Clock },
    { name: 'Profile', href: '/profile', icon: User },
  ];

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="brutal-card bg-white rounded-full flex items-center justify-between w-full max-w-[400px] px-2 py-2 pointer-events-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="relative p-3 flex flex-col items-center justify-center"
            >
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-active"
                  className="absolute inset-0 bg-yellow rounded-full brutal-border brutal-shadow-sm"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <Icon 
                className={`w-6 h-6 relative z-10 ${isActive ? 'text-black' : 'text-gray-500 hover:text-black transition-colors'}`} 
              />
              <span className="sr-only">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
