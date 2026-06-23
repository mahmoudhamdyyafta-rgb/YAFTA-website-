import { useState, useEffect } from 'react';
import { db as firestoreDb, isFirebaseConfigured } from '../../firebaseConfig';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export interface TrackerTask {
  id: string;
  titleAr: string;
  titleEn: string;
  assignedTo: string;
  assignedToId?: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'In Progress' | 'Completed' | 'Pending' | 'On Hold';
  deadline: string;
  createdAt: string;
  category: string;
}

export function useTracker() {
  const [tasks, setTasks] = useState<TrackerTask[]>(() => {
    const saved = localStorage.getItem('yafta_tracker_tasks');
    return saved ? JSON.parse(saved) : [
      {
         id: 'task-1',
         titleAr: 'تركيب لوحة مضيئة في طريق الملك عبدالعزيز',
         titleEn: 'Install illuminated signage on King Abdulaziz Rd',
         assignedTo: 'أحمد العتيبي',
         assignedToId: 'emp-1',
         priority: 'High',
         status: 'In Progress',
         deadline: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
         createdAt: new Date().toISOString().split('T')[0],
         category: 'Signage'
      },
      {
         id: 'task-2',
         titleAr: 'طباعة بروشورات لشركة الاتصالات',
         titleEn: 'Print brochures for Telecom Company',
         assignedTo: 'محمد السالم',
         assignedToId: 'emp-2',
         priority: 'Medium',
         status: 'Pending',
         deadline: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
         createdAt: new Date().toISOString().split('T')[0],
         category: 'Printing'
      }
    ];
  });

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !firestoreDb) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(collection(firestoreDb, 'tasks'), (snapshot) => {
      const fetchedTasks: TrackerTask[] = [];
      snapshot.forEach((doc) => {
        fetchedTasks.push({ id: doc.id, ...doc.data() } as TrackerTask);
      });
      setTasks(fetchedTasks);
      setLoading(false);
    }, (error) => {
      console.error("Firestore loading tasks failed:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addTask = async (task: Omit<TrackerTask, 'id' | 'createdAt'>) => {
    const newTask = {
      ...task,
      createdAt: new Date().toISOString().split('T')[0],
    };

    if (isFirebaseConfigured && firestoreDb) {
      try {
        const docRef = await addDoc(collection(firestoreDb, 'tasks'), newTask);
        return docRef.id;
      } catch (err) {
        console.error("Failed to add task in Firestore:", err);
      }
    }

    // Fallback or Local Update
    const finalTask = { id: 'task_' + Date.now(), ...newTask };
    const updated = [finalTask, ...tasks];
    setTasks(updated);
    localStorage.setItem('yafta_tracker_tasks', JSON.stringify(updated));
    return finalTask.id;
  };

  const updateTaskStatus = async (taskId: string, status: TrackerTask['status']) => {
    if (isFirebaseConfigured && firestoreDb && !taskId.startsWith('local_') && !taskId.startsWith('task-')) {
      try {
        const taskRef = doc(firestoreDb, 'tasks', taskId);
        await updateDoc(taskRef, { status });
        return;
      } catch (err) {
        console.error("Failed to update task in Firestore:", err);
      }
    }

    // Local update
    const updated = tasks.map(t => t.id === taskId ? { ...t, status } : t);
    setTasks(updated);
    localStorage.setItem('yafta_tracker_tasks', JSON.stringify(updated));
  };

  const deleteTask = async (taskId: string) => {
    if (isFirebaseConfigured && firestoreDb && !taskId.startsWith('local_') && !taskId.startsWith('task-')) {
      try {
        await deleteDoc(doc(firestoreDb, 'tasks', taskId));
        return;
      } catch (err) {
        console.error("Failed to delete task in Firestore:", err);
      }
    }

    // Local delete
    const updated = tasks.filter(t => t.id !== taskId);
    setTasks(updated);
    localStorage.setItem('yafta_tracker_tasks', JSON.stringify(updated));
  };

  return {
    tasks,
    loading,
    addTask,
    updateTaskStatus,
    deleteTask,
  };
}
