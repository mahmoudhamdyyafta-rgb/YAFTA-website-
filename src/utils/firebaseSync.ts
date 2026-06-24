/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  collection, doc, setDoc, addDoc, getDocs, onSnapshot, deleteDoc, updateDoc
} from 'firebase/firestore';
import { db, isFirebaseConfigured, auth } from '../firebaseConfig';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

// Global Firebase error handler per SKILL guidelines
function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
    },
    operationType,
    path
  };
  console.error('Firestore Error Details: ', JSON.stringify(errInfo));
  return errInfo;
}

/**
 * Generic real-time synchronizer for ERP datasets
 * Handles Firestore replication when online/configured, with silent LocalStorage caching fallback.
 */
export function subscribeToCollection<T extends { id: string }>(
  collectionName: string,
  localCacheKey: string,
  defaultItems: T[],
  onDataChange: (items: T[]) => void
) {
  // 1. Initial Load from LocalStorage fallback
  const getCached = (): T[] => {
    try {
      const cached = localStorage.getItem(localCacheKey);
      return cached ? JSON.parse(cached) : defaultItems;
    } catch {
      return defaultItems;
    }
  };

  const initialItems = getCached();
  onDataChange(initialItems);

  // 2. Setup Firebase dynamic synchronization if initialized
  if (isFirebaseConfigured && db) {
    try {
      const ref = collection(db, collectionName);
      const unsubscribe = onSnapshot(ref, (snapshot) => {
        const items: T[] = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() } as unknown as T);
        });

        if (items.length > 0) {
          localStorage.setItem(localCacheKey, JSON.stringify(items));
          onDataChange(items);
        } else {
          // If Firestore is empty, seed it with the default list so we don't start with blank databases
          initialItems.forEach(async (item) => {
            try {
              await setDoc(doc(db, collectionName, item.id), { ...item });
            } catch (err) {
              handleFirestoreError(err, OperationType.CREATE, `${collectionName}/${item.id}`);
            }
          });
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, collectionName);
      });

      return unsubscribe;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, collectionName);
    }
  }

  return () => {};
}

/**
 * Persists a document locally and in Firestore
 */
export async function saveDocument<T extends { id: string }>(
  collectionName: string,
  localCacheKey: string,
  docId: string,
  data: Partial<T>
) {
  // Update local storage first for high-responsiveness
  try {
    const cached = localStorage.getItem(localCacheKey);
    const list: T[] = cached ? JSON.parse(cached) : [];
    const idx = list.findIndex(item => item.id === docId);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data };
    } else {
      list.push({ id: docId, ...data } as unknown as T);
    }
    localStorage.setItem(localCacheKey, JSON.stringify(list));
  } catch (err) {
    console.error('LocalStorage write failed:', err);
  }

  // Sync to Firestore
  if (isFirebaseConfigured && db) {
    const docRef = doc(db, collectionName, docId);
    try {
      await setDoc(docRef, data, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `${collectionName}/${docId}`);
    }
  }
}

/**
 * Deletes a document locally and in Firestore
 */
export async function deleteDocument(
  collectionName: string,
  localCacheKey: string,
  docId: string
) {
  try {
    const cached = localStorage.getItem(localCacheKey);
    if (cached) {
      const list = JSON.parse(cached).filter((item: any) => item.id !== docId);
      localStorage.setItem(localCacheKey, JSON.stringify(list));
    }
  } catch (err) {
    console.error(err);
  }

  if (isFirebaseConfigured && db) {
    const docRef = doc(db, collectionName, docId);
    try {
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${collectionName}/${docId}`);
    }
  }
}
