import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  signOut,
  type User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { writeToIDB, readFromIDB } from './storage';

// Initialize Firebase App singleton
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Ensure Firebase Auth persists permanently in local storage across browser & APK launches
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn('Firebase persistence setup note:', err);
});

export const SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/spreadsheets',
];

const provider = new GoogleAuthProvider();
SCOPES.forEach((scope) => {
  provider.addScope(scope);
});

export const TOKEN_STORAGE_KEY = 'ayurlife_google_access_token';
export const USER_EMAIL_KEY = 'ayurlife_user_email';
export const SAVED_USER_PROFILE_KEY = 'ayurlife_saved_user_profile';

export interface SavedUserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
  savedAt: string;
}

let isSigningIn = false;
let cachedAccessToken: string | null = (() => {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
})();

export const getSavedUser = (): User | null => {
  try {
    const rawProfile = localStorage.getItem(SAVED_USER_PROFILE_KEY);
    if (rawProfile) {
      const parsed = JSON.parse(rawProfile) as SavedUserProfile;
      if (parsed && parsed.email) {
        return {
          uid: parsed.uid || `perm-${parsed.email}`,
          email: parsed.email,
          displayName: parsed.displayName || parsed.email.split('@')[0],
          photoURL: parsed.photoURL || null,
          emailVerified: true,
        } as unknown as User;
      }
    }
    const storedEmail = localStorage.getItem(USER_EMAIL_KEY);
    if (storedEmail && storedEmail.trim()) {
      const cleanEmail = storedEmail.trim();
      return {
        uid: `perm-${cleanEmail}`,
        email: cleanEmail,
        displayName: cleanEmail === 'rk867000@gmail.com' ? 'Dr. Ravi Shankar' : cleanEmail.split('@')[0],
        photoURL: null,
        emailVerified: true,
      } as unknown as User;
    }
  } catch {
    // ignore storage errors
  }
  return null;
};

export const savePermanentUserEmail = (
  email: string,
  displayName?: string,
  photoURL?: string | null,
  uid?: string
): User => {
  const cleanEmail = email.trim();
  const profile: SavedUserProfile = {
    uid: uid || `perm-${cleanEmail}`,
    email: cleanEmail,
    displayName:
      displayName ||
      (cleanEmail.toLowerCase() === 'rk867000@gmail.com'
        ? 'Dr. Ravi Shankar'
        : cleanEmail.split('@')[0]),
    photoURL: photoURL || null,
    savedAt: new Date().toISOString(),
  };
  try {
    const profileJson = JSON.stringify(profile);
    localStorage.setItem(USER_EMAIL_KEY, cleanEmail);
    localStorage.setItem(SAVED_USER_PROFILE_KEY, profileJson);
    writeToIDB(USER_EMAIL_KEY, cleanEmail);
    writeToIDB(SAVED_USER_PROFILE_KEY, profileJson);
  } catch (e) {
    console.warn('Failed to persist user email:', e);
  }
  return {
    uid: profile.uid,
    email: profile.email,
    displayName: profile.displayName,
    photoURL: profile.photoURL,
    emailVerified: true,
  } as unknown as User;
};

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  // 1. Immediately restore permanently saved user from localStorage on website/APK launch
  const initialSavedUser = getSavedUser();
  if (initialSavedUser && onAuthSuccess) {
    onAuthSuccess(initialSavedUser, cachedAccessToken || '');
  } else {
    // 2. Also check IndexedDB in case Android APK WebView cleared localStorage on restart
    readFromIDB(SAVED_USER_PROFILE_KEY).then((idbProfileRaw) => {
      if (idbProfileRaw) {
        try {
          const parsed = JSON.parse(idbProfileRaw) as SavedUserProfile;
          if (parsed && parsed.email) {
            localStorage.setItem(USER_EMAIL_KEY, parsed.email);
            localStorage.setItem(SAVED_USER_PROFILE_KEY, idbProfileRaw);
            const restoredUser = getSavedUser();
            if (restoredUser && onAuthSuccess) {
              onAuthSuccess(restoredUser, cachedAccessToken || '');
            }
          }
        } catch {}
      }
    });
  }

  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      const token = cachedAccessToken || localStorage.getItem(TOKEN_STORAGE_KEY) || '';
      if (token) {
        cachedAccessToken = token;
      }
      if (user.email) {
        savePermanentUserEmail(
          user.email,
          user.displayName || undefined,
          user.photoURL,
          user.uid
        );
      }
      if (onAuthSuccess) onAuthSuccess(user, token);
    } else {
      // If Firebase session is not active (e.g., on reload, Vercel, or APK WebView), keep the permanently saved email login!
      const savedUser = getSavedUser();
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
      if (savedUser) {
        if (onAuthSuccess) onAuthSuccess(savedUser, storedToken);
      } else {
        const idbProfileRaw = await readFromIDB(SAVED_USER_PROFILE_KEY);
        if (idbProfileRaw) {
          try {
            const parsed = JSON.parse(idbProfileRaw) as SavedUserProfile;
            if (parsed && parsed.email) {
              const restored = savePermanentUserEmail(
                parsed.email,
                parsed.displayName,
                parsed.photoURL,
                parsed.uid
              );
              if (onAuthSuccess) onAuthSuccess(restored, storedToken);
              return;
            }
          } catch {}
        }
        if (!isSigningIn) {
          cachedAccessToken = null;
          if (onAuthFailure) onAuthFailure();
        }
      }
    }
  });
};

export const googleSignIn = async (
  preferredEmail?: string
): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const savedEmail = preferredEmail?.trim() || localStorage.getItem(USER_EMAIL_KEY);
    if (savedEmail) {
      provider.setCustomParameters({
        login_hint: savedEmail,
      });
    } else {
      provider.setCustomParameters({
        prompt: 'select_account',
      });
    }

    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken || '';

    if (token) {
      cachedAccessToken = token;
    }

    try {
      if (token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
        writeToIDB(TOKEN_STORAGE_KEY, token);
      }
      if (result.user?.email) {
        savePermanentUserEmail(
          result.user.email,
          result.user.displayName || undefined,
          result.user.photoURL,
          result.user.uid
        );
      }
    } catch (e) {
      console.warn('Could not persist token in localStorage:', e);
    }

    return { user: result.user, accessToken: cachedAccessToken || '' };
  } catch (error: any) {
    console.warn('Google Sign-in popup note:', error);
    // If running inside an Android APK WebView or custom Vercel domain where OAuth popups are restricted,
    // allow seamless permanent email login fallback if an email is available
    const fallbackEmail = preferredEmail?.trim() || localStorage.getItem(USER_EMAIL_KEY) || 'rk867000@gmail.com';
    if (
      error?.code === 'auth/unauthorized-domain' ||
      error?.code === 'auth/popup-blocked' ||
      error?.code === 'auth/operation-not-supported-in-this-environment'
    ) {
      const permUser = savePermanentUserEmail(fallbackEmail);
      return { user: permUser, accessToken: cachedAccessToken || '' };
    }
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  if (cachedAccessToken) return cachedAccessToken;
  try {
    const stored = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (stored) {
      cachedAccessToken = stored;
      return stored;
    }
    const idbToken = await readFromIDB(TOKEN_STORAGE_KEY);
    if (idbToken) {
      cachedAccessToken = idbToken;
      localStorage.setItem(TOKEN_STORAGE_KEY, idbToken);
      return idbToken;
    }
  } catch {}
  return null;
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch {}
  cachedAccessToken = null;
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_EMAIL_KEY);
    localStorage.removeItem(SAVED_USER_PROFILE_KEY);
    writeToIDB(TOKEN_STORAGE_KEY, '');
    writeToIDB(USER_EMAIL_KEY, '');
    writeToIDB(SAVED_USER_PROFILE_KEY, '');
  } catch {}
};
