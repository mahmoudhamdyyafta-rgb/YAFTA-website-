import { useState, useEffect } from 'react';
import { db as firestoreDb, isFirebaseConfigured } from '../../firebaseConfig';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';

export interface Inquiry {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  serviceInterest: string;
  message: string;
  createdAt: string;
  status: 'Pending' | 'Contacted' | 'Closed';
}

export function useContact() {
  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    const saved = localStorage.getItem('yafta_contact_inquiries');
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !firestoreDb) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(collection(firestoreDb, 'inquiries'), (snapshot) => {
      const fetchedInq: Inquiry[] = [];
      snapshot.forEach((doc) => {
        fetchedInq.push({ id: doc.id, ...doc.data() } as Inquiry);
      });
      setInquiries(fetchedInq);
      setLoading(false);
    }, (error) => {
      console.error("Firestore loading inquiries failed:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addInquiry = async (newInq: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => {
    const inquiryPayload = {
      ...newInq,
      createdAt: new Date().toISOString(),
      status: 'Pending' as const,
    };

    if (isFirebaseConfigured && firestoreDb) {
      try {
        const docRef = await addDoc(collection(firestoreDb, 'inquiries'), inquiryPayload);
        return docRef.id;
      } catch (err) {
        console.error("Failed to add inquiry in Firestore:", err);
      }
    }

    const localInq = { id: 'inq_' + Date.now(), ...inquiryPayload };
    const updated = [localInq, ...inquiries];
    setInquiries(updated);
    localStorage.setItem('yafta_contact_inquiries', JSON.stringify(updated));
    return localInq.id;
  };

  return {
    inquiries,
    loading,
    addInquiry,
  };
}
