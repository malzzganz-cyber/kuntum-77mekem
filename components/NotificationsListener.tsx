"use client";

import { useEffect } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

export function NotificationsListener() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      where('read', '==', false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const data = change.doc.data();
          
          if (data.type === 'success') {
            toast.success(data.message, { id: change.doc.id, duration: 5000 });
          } else if (data.type === 'error') {
            toast.error(data.message, { id: change.doc.id, duration: 5000 });
          } else {
            toast(data.message, { id: change.doc.id });
          }

          // Mark as read so it doesn't fire again on reload
          updateDoc(doc(db, 'notifications', change.doc.id), {
            read: true
          }).catch(err => console.error("Failed to mark notification state", err));
        }
      });
    });

    return () => unsubscribe();
  }, [user]);

  return null;
}
