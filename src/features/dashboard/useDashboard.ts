import { useState, useEffect } from 'react';
import { db as firestoreDb, isFirebaseConfigured } from '../../firebaseConfig';
import { collection, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

export interface DashboardMetric {
  titleAr: string;
  titleEn: string;
  val: number | string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface ActivityLog {
  id: string;
  text: string;
  timestamp: string;
  user?: string;
}

export function useDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetric[]>([
    { titleAr: 'إجمالي المبيعات والتعاقدات', titleEn: 'Total Contracting Sales', val: 'EGP 1,240,000', change: '+12.5%', trend: 'up' },
    { titleAr: 'مشاريع التشغيل قيد المراجعة والتركيب', titleEn: 'Active Fabrication Projects', val: '18', change: '+4', trend: 'up' },
    { titleAr: 'إنتاجية اللافتات الكلادينج والزنكور', titleEn: 'Signage & Facades Output', val: '86%', change: '+3.2%', trend: 'up' },
    { titleAr: 'معدل رضا وتحويل العملاء المباشر', titleEn: 'Client Satisfaction Rate', val: '98.4%', change: '+0.5%', trend: 'up' },
  ]);

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('yafta_dashboard_logs');
    return saved ? JSON.parse(saved) : [
      { id: 'log-1', text: 'تم بدء تصنيع الحروف البارزة لـ "شركة اورنج"', timestamp: new Date(Date.now() - 3600000).toLocaleTimeString() },
      { id: 'log-2', text: 'قام العميل "أحمد فؤاد" بتقديم استفسار بخصوص لافتة أكريليك مضيئة', timestamp: new Date(Date.now() - 7200000).toLocaleTimeString() }
    ];
  });

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !firestoreDb) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(collection(firestoreDb, 'logs'), (snapshot) => {
      const fetchedLogs: ActivityLog[] = [];
      snapshot.forEach((doc) => {
        fetchedLogs.push({ id: doc.id, ...doc.data() } as ActivityLog);
      });
      if (fetchedLogs.length > 0) {
        setActivityLogs(fetchedLogs);
      }
      setLoading(false);
    }, (error) => {
      console.error("Firestore loading logs failed:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addLog = async (text: string, userName?: string) => {
    const newLog = {
      text,
      timestamp: new Date().toLocaleTimeString(),
      user: userName || 'System',
    };

    if (isFirebaseConfigured && firestoreDb) {
      try {
        await addDoc(collection(firestoreDb, 'logs'), newLog);
        return;
      } catch (err) {
        console.error("Failed to add log in Firestore:", err);
      }
    }

    const localLog = { id: 'log_' + Date.now(), ...newLog };
    const updated = [localLog, ...activityLogs].slice(0, 50); // limit to Last 50
    setActivityLogs(updated);
    localStorage.setItem('yafta_dashboard_logs', JSON.stringify(updated));
  };

  return {
    metrics,
    activityLogs,
    loading,
    addLog,
  };
}
