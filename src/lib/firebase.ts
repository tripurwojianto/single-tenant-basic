/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, signInWithCredential, GoogleAuthProvider, onAuthStateChanged, User, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const GOOGLE_CLIENT_ID =
  (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID ||
  firebaseConfig.oAuthClientId ||
  '621496665265-03aolfd2fibn6vth5omfml703psb256o.apps.googleusercontent.com';

// Check if GIS script is loaded and ready
export const isGsiAvailable = (): boolean => {
  return typeof window !== 'undefined' && !!(window as any).google?.accounts?.oauth2;
};

// Helper to ensure GIS script is loaded with a 2.5s polling check
export const ensureGsiLoaded = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (isGsiAvailable()) {
      resolve(true);
      return;
    }
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (isGsiAvailable()) {
        clearInterval(interval);
        resolve(true);
      } else if (attempts >= 25) {
        clearInterval(interval);
        resolve(false);
      }
    }, 100);
  });
};

// Get the master registry spreadsheet ID from Firestore config
export async function getMasterRegistryIdFromFirestore(brandId: string): Promise<string | null> {
  try {
    const docRef = doc(db, 'config', `master_registry_${brandId}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().spreadsheetId || null;
    }
  } catch (error) {
    console.error('Error fetching master registry ID from Firestore:', error);
  }
  return null;
}

// Save the master registry spreadsheet ID to Firestore config
export async function saveMasterRegistryIdToFirestore(brandId: string, spreadsheetId: string): Promise<void> {
  try {
    const docRef = doc(db, 'config', `master_registry_${brandId}`);
    await setDoc(docRef, { spreadsheetId, updatedAt: new Date().toISOString() }, { merge: true });
  } catch (error) {
    console.error('Error saving master registry ID to Firestore:', error);
  }
}

const provider = new GoogleAuthProvider();
// Request Google Drive and Google Sheets scopes
provider.addScope('https://www.googleapis.com/auth/spreadsheets');
provider.addScope('https://www.googleapis.com/auth/drive.file');

const TOKEN_KEY = 'kasmasjid_google_access_token';

// Persistent token cache across page reloads
let cachedAccessToken: string | null = (() => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (e) {
    return null;
  }
})();
let isSigningIn = false;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (!cachedAccessToken) {
        try {
          cachedAccessToken = localStorage.getItem(TOKEN_KEY);
        } catch (e) {}
      }
      if (!cachedAccessToken) {
        try {
          const sessStr = localStorage.getItem('kasmasjid_session');
          if (sessStr) {
            const sess = JSON.parse(sessStr);
            if (sess?.token) cachedAccessToken = sess.token;
          }
        } catch (e) {}
      }
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      // Check if persistent session exists in localStorage before triggering failure
      try {
        const sessStr = localStorage.getItem('kasmasjid_session');
        if (sessStr) {
          const sess = JSON.parse(sessStr);
          if (sess && sess.isLoggedIn && sess.user && sess.token) {
            cachedAccessToken = sess.token;
            if (onAuthSuccess) {
              onAuthSuccess(sess.user as User, sess.token);
            }
            return;
          }
        }
      } catch (e) {}

      cachedAccessToken = null;
      try {
        localStorage.removeItem(TOKEN_KEY);
      } catch (e) {}
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  isSigningIn = true;
  try {
    const signInPromise = new Promise<{ user: User; accessToken: string }>(async (resolve, reject) => {
      try {
        // Try GIS token client first if available
        const gsiReady = await ensureGsiLoaded();
        if (gsiReady && (window as any).google?.accounts?.oauth2) {
          try {
            const tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
              client_id: GOOGLE_CLIENT_ID,
              scope: 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
              callback: async (response: any) => {
                if (response.error) {
                  reject(new Error(response.error_description || response.error));
                  return;
                }
                if (response.access_token) {
                  const token = response.access_token;
                  cachedAccessToken = token;
                  try {
                    localStorage.setItem(TOKEN_KEY, token);
                  } catch (e) {}

                  try {
                    const credential = GoogleAuthProvider.credential(null, token);
                    const authResult = await signInWithCredential(auth, credential);
                    resolve({ user: authResult.user, accessToken: token });
                  } catch (e) {
                    // Fallback to Google userinfo endpoint if credential exchange fails
                    try {
                      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                        headers: { Authorization: `Bearer ${token}` }
                      });
                      const profile = await res.json();
                      const customUser = {
                        uid: profile.sub || 'user-' + Date.now(),
                        email: profile.email || '',
                        displayName: profile.name || 'Pengurus Masjid',
                        photoURL: profile.picture || ''
                      } as User;
                      resolve({ user: customUser, accessToken: token });
                    } catch (pErr) {
                      reject(pErr);
                    }
                  }
                } else {
                  reject(new Error('Gagal mendapatkan token dari Google OAuth'));
                }
              },
              error_callback: (err: any) => {
                reject(new Error(err?.message || 'Proses otentikasi Google dibatalkan atau terganggu'));
              }
            });
            tokenClient.requestAccessToken({ prompt: 'consent' });
            return;
          } catch (gisErr) {
            console.warn('GIS Client error, falling back to signInWithPopup:', gisErr);
          }
        }

        // Fallback to Firebase signInWithPopup
        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (!credential?.accessToken) {
          throw new Error('Gagal mendapatkan token akses dari Google Sign-In');
        }
        cachedAccessToken = credential.accessToken;
        try {
          localStorage.setItem(TOKEN_KEY, cachedAccessToken);
        } catch (e) {}
        resolve({ user: result.user, accessToken: cachedAccessToken });
      } catch (err) {
        reject(err);
      }
    });

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Waktu login habis. Silakan klik tombol Masuk Kembali dengan Google untuk mencoba lagi.'));
      }, 60000);
    });

    return await Promise.race([signInPromise, timeoutPromise]);
  } catch (error: any) {
    console.error('Sign-in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = (): string | null => {
  if (!cachedAccessToken) {
    try {
      cachedAccessToken = localStorage.getItem(TOKEN_KEY);
    } catch (e) {}
  }
  return cachedAccessToken;
};

export const setAccessToken = (token: string) => {
  cachedAccessToken = token;
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (e) {}
};

export const logout = async () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (e) {}
  cachedAccessToken = null;
  await signOut(auth);
};
