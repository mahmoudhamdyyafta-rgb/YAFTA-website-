import { useState, useEffect } from 'react';
import { Project, BeforeAfterItem } from '../../types';
import { db as firestoreDb, isFirebaseConfigured } from '../../firebaseConfig';
import { collection, onSnapshot, addDoc, doc, setDoc } from 'firebase/firestore';

export function usePortfolio() {
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('yafta_portfolio_projects');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [beforeAfterItems, setBeforeAfterItems] = useState<BeforeAfterItem[]>(() => {
    const saved = localStorage.getItem('yafta_portfolio_before_after');
    return saved ? JSON.parse(saved) : [];
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (!isFirebaseConfigured || !firestoreDb) {
      setLoading(false);
      return;
    }

    const unsubProjects = onSnapshot(collection(firestoreDb, 'projects'), (snapshot) => {
      const fetchedProj: Project[] = [];
      snapshot.forEach((doc) => {
        fetchedProj.push({ id: doc.id, ...doc.data() } as Project);
      });
      if (fetchedProj.length > 0) {
        setProjects(fetchedProj);
      }
      setLoading(false);
    }, (error) => {
      console.error("Firestore loading projects failed:", error);
      setLoading(false);
    });

    const unsubBeforeAfter = onSnapshot(collection(firestoreDb, 'beforeAfter'), (snapshot) => {
      const fetchedItems: BeforeAfterItem[] = [];
      snapshot.forEach((doc) => {
        fetchedItems.push({ id: doc.id, ...doc.data() } as BeforeAfterItem);
      });
      if (fetchedItems.length > 0) {
        setBeforeAfterItems(fetchedItems);
      }
    });

    return () => {
      unsubProjects();
      unsubBeforeAfter();
    };
  }, []);

  const addProject = async (newProj: Omit<Project, 'id'>) => {
    if (isFirebaseConfigured && firestoreDb) {
      try {
        const docRef = await addDoc(collection(firestoreDb, 'projects'), newProj);
        return docRef.id;
      } catch (err) {
        console.error("Failed to add project in Firestore:", err);
      }
    }

    const localProj = { id: 'proj_' + Date.now(), ...newProj };
    const updated = [localProj, ...projects];
    setProjects(updated);
    localStorage.setItem('yafta_portfolio_projects', JSON.stringify(updated));
    return localProj.id;
  };

  const addBeforeAfter = async (newItem: Omit<BeforeAfterItem, 'id'>) => {
    if (isFirebaseConfigured && firestoreDb) {
      try {
        const docRef = await addDoc(collection(firestoreDb, 'beforeAfter'), newItem);
        return docRef.id;
      } catch (err) {
        console.error("Failed to add beforeAfter item in Firestore:", err);
      }
    }

    const localItem = { id: 'ba_' + Date.now(), ...newItem };
    const updated = [localItem, ...beforeAfterItems];
    setBeforeAfterItems(updated);
    localStorage.setItem('yafta_portfolio_before_after', JSON.stringify(updated));
    return localItem.id;
  };

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  return {
    projects,
    beforeAfterItems,
    loading,
    selectedCategory,
    setSelectedCategory,
    filteredProjects,
    addProject,
    addBeforeAfter,
  };
}
