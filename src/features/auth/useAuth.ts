import { useState, useEffect } from 'react';
import { UserAccount, UserRole } from '../../types';
import { auth as firebaseAuth, db as firestoreDb, isFirebaseConfigured } from '../../firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('yafta_currentUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured || !firebaseAuth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (fbUser) => {
      if (fbUser) {
        try {
          // Attempt to retrieve additional profile data from Firestore
          const docRef = doc(firestoreDb, 'users', fbUser.uid);
          const docSnap = await getDoc(docRef);

          let userProfile: UserAccount;
          if (docSnap.exists()) {
            const data = docSnap.data();
            userProfile = {
              id: fbUser.uid,
              name: data.name || fbUser.displayName || 'User',
              email: fbUser.email || '',
              role: (data.role as UserRole) || 'Client',
              phone: data.phone || '',
              status: data.status || 'active',
              registeredDate: data.registeredDate || new Date().toISOString().split('T')[0],
            };
          } else {
            // Document does not exist yet (first-time login or legacy record)
            userProfile = {
              id: fbUser.uid,
              name: fbUser.displayName || 'User',
              email: fbUser.email || '',
              role: 'Client',
              status: 'active',
              registeredDate: new Date().toISOString().split('T')[0],
            };
            // Create user document in Firestore asynchronously
            await setDoc(docRef, userProfile);
          }

          setCurrentUser(userProfile);
          localStorage.setItem('yafta_currentUser', JSON.stringify(userProfile));
        } catch (err: any) {
          console.error("Firestore user fetch error, continuing with local profile:", err);
          // Fallback to local profile based on simple auth
          const fallbackUser: UserAccount = {
            id: fbUser.uid,
            name: fbUser.displayName || 'User',
            email: fbUser.email || '',
            role: 'Client',
            status: 'active',
          };
          setCurrentUser(fallbackUser);
        }
      } else {
        setCurrentUser(null);
        localStorage.removeItem('yafta_currentUser');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginUser = async (email: string, role: UserRole = 'Client') => {
    setLoading(true);
    setError(null);
    try {
      if (isFirebaseConfigured && firebaseAuth) {
        // Under active Firebase, we sign in using email
        // For testing/safe evaluation without real user sign-up in firestore, we fall back to general auth
        const mockPass = 'YaftaAdAgency123!';
        const credentials = await signInWithEmailAndPassword(firebaseAuth, email, mockPass);
        const fbUser = credentials.user;

        const docRef = doc(firestoreDb, 'users', fbUser.uid);
        const docSnap = await getDoc(docRef);
        let activeRole = role;
        if (docSnap.exists()) {
          activeRole = docSnap.data().role as UserRole;
        }

        const user: UserAccount = {
          id: fbUser.uid,
          name: fbUser.displayName || email.split('@')[0],
          email: fbUser.email || email,
          role: activeRole,
          status: 'active',
        };
        setCurrentUser(user);
        localStorage.setItem('yafta_currentUser', JSON.stringify(user));
        return user;
      } else {
        // No Firebase - local authentication simulation
        const simulatedUser: UserAccount = {
          id: 'local_' + Date.now(),
          name: email.split('@')[0],
          email: email,
          role: role,
          status: 'active',
          registeredDate: new Date().toISOString().split('T')[0],
        };
        setCurrentUser(simulatedUser);
        localStorage.setItem('yafta_currentUser', JSON.stringify(simulatedUser));
        return simulatedUser;
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (name: string, email: string, role: UserRole, phone?: string) => {
    setLoading(true);
    setError(null);
    try {
      if (isFirebaseConfigured && firebaseAuth) {
        const mockPass = 'YaftaAdAgency123!';
        const credentials = await createUserWithEmailAndPassword(firebaseAuth, email, mockPass);
        const fbUser = credentials.user;

        const newUser: UserAccount = {
          id: fbUser.uid,
          name,
          email,
          role,
          phone,
          status: 'active',
          registeredDate: new Date().toISOString().split('T')[0],
        };

        await setDoc(doc(firestoreDb, 'users', fbUser.uid), newUser);
        setCurrentUser(newUser);
        localStorage.setItem('yafta_currentUser', JSON.stringify(newUser));
        return newUser;
      } else {
        // Local simulation
        const newUser: UserAccount = {
          id: 'local_' + Date.now(),
          name,
          email,
          role,
          phone,
          status: 'active',
          registeredDate: new Date().toISOString().split('T')[0],
        };
        setCurrentUser(newUser);
        localStorage.setItem('yafta_currentUser', JSON.stringify(newUser));
        return newUser;
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = async () => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && firebaseAuth) {
        await fbSignOut(firebaseAuth);
      }
      setCurrentUser(null);
      localStorage.removeItem('yafta_currentUser');
    } catch (err: any) {
      setError(err.message || 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  return {
    currentUser,
    loading,
    error,
    loginUser,
    registerUser,
    logoutUser,
  };
}
