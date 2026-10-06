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
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  onSnapshot,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { writeToIDB, readFromIDB } from './storage';

// Initialize Firebase App singleton
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Validate connection to Firestore on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Ensure Firebase Auth persists permanently in local storage across browser & APK launches
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn('Firebase persistence setup note:', err);
});

export const SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
  'https://www.googleapis.com/auth/drive.file',
];

const provider = new GoogleAuthProvider();
SCOPES.forEach((scope) => {
  provider.addScope(scope);
});

export const TOKEN_STORAGE_KEY = 'ayurlife_google_access_token';
export const USER_EMAIL_KEY = 'ayurlife_user_email';
export const SAVED_USER_PROFILE_KEY = 'ayurlife_saved_user_profile';
export const DEFAULT_OWNER_EMAIL = 'rk867000@gmail.com';
export const DEFAULT_OWNER_NAME = 'Dr. Ravi Shankar';

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
    if (auth.currentUser?.email) {
      return auth.currentUser;
    }
    const rawProfile = localStorage.getItem(SAVED_USER_PROFILE_KEY);
    if (rawProfile) {
      const parsed = JSON.parse(rawProfile) as SavedUserProfile;
      if (parsed && parsed.email) {
        return {
          uid: parsed.uid || `perm-${parsed.email}`,
          email: parsed.email,
          displayName: parsed.displayName || DEFAULT_OWNER_NAME,
          photoURL: parsed.photoURL || null,
          emailVerified: true,
        } as unknown as User;
      }
    }
    return null;
  } catch {
    return null;
  }
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
  }

  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user && user.email) {
      const token = cachedAccessToken || localStorage.getItem(TOKEN_STORAGE_KEY) || '';
      if (token) {
        cachedAccessToken = token;
      }
      savePermanentUserEmail(
        user.email,
        user.displayName || undefined,
        user.photoURL,
        user.uid
      );
      if (onAuthSuccess) onAuthSuccess(user, token);
    } else {
      // Check localStorage first
      const savedUser = getSavedUser();
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY) || '';
      if (savedUser) {
        if (onAuthSuccess) onAuthSuccess(savedUser, storedToken);
        return;
      }

      // Check IndexedDB in case Android APK WebView cleared localStorage on restart
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
    // allow seamless permanent email login fallback
    const fallbackEmail =
      preferredEmail?.trim() ||
      localStorage.getItem(USER_EMAIL_KEY) ||
      DEFAULT_OWNER_EMAIL;
    if (
      error?.code === 'auth/unauthorized-domain' ||
      error?.code === 'auth/popup-blocked' ||
      error?.code === 'auth/operation-not-supported-in-this-environment' ||
      error?.code === 'auth/internal-error' ||
      error?.code === 'auth/web-storage-unsupported'
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
    localStorage.removeItem(SAVED_USER_PROFILE_KEY);
    localStorage.removeItem(USER_EMAIL_KEY);
    writeToIDB(TOKEN_STORAGE_KEY, '');
    writeToIDB(SAVED_USER_PROFILE_KEY, '');
    writeToIDB(USER_EMAIL_KEY, '');
  } catch {}
};

const WORKSPACE_COLLECTION = 'workspaces';
const WORKSPACE_DOC_ID = 'ravi_shankar_hq';
const WORKSPACE_PATH = `${WORKSPACE_COLLECTION}/${WORKSPACE_DOC_ID}`;

function stripUndefinedDeep<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export function buildValidatedWorkspacePayload(allData: Record<string, any>, updatedAtMs?: number) {
  const clean = stripUndefinedDeep(allData || {});
  const expensesList = Array.isArray(clean.expenses) ? clean.expenses.slice(0, 500) : [];
  const archiveList = Array.isArray(clean.expensesArchive)
    ? clean.expensesArchive.slice(0, 500)
    : expensesList;

  return {
    ownerEmail: DEFAULT_OWNER_EMAIL,
    updatedAtMs: typeof updatedAtMs === 'number' ? updatedAtMs : Date.now(),
    milestones: Array.isArray(clean.milestones) ? clean.milestones.slice(0, 100) : [],
    loans: Array.isArray(clean.loans) ? clean.loans.slice(0, 200) : [],
    investments: Array.isArray(clean.investments) ? clean.investments.slice(0, 200) : [],
    expenses: expensesList,
    expensesArchive: archiveList,
    notes: Array.isArray(clean.notes) ? clean.notes.slice(0, 300) : [],
    tasks: Array.isArray(clean.tasks) ? clean.tasks.slice(0, 300) : [],
    events: Array.isArray(clean.events) ? clean.events.slice(0, 300) : [],
    notifications: Array.isArray(clean.notifications) ? clean.notifications.slice(0, 200) : [],
    dinacharyaLogs: Array.isArray(clean.dinacharyaLogs) ? clean.dinacharyaLogs.slice(0, 400) : [],
    habits: Array.isArray(clean.habits) ? clean.habits.slice(0, 100) : [],
    journalEntries: Array.isArray(clean.journalEntries) ? clean.journalEntries.slice(0, 300) : [],
  };
}

export interface WorkspaceFetchResult {
  status: 'found' | 'not_found' | 'error';
  data: Record<string, any> | null;
}

export async function fetchMasterWorkspaceFromFirestore(): Promise<WorkspaceFetchResult> {
  const ref = doc(db, WORKSPACE_COLLECTION, WORKSPACE_DOC_ID);
  try {
    try {
      const serverSnap = await getDocFromServer(ref);
      if (serverSnap.exists()) {
        return { status: 'found', data: serverSnap.data() };
      }
      return { status: 'not_found', data: null };
    } catch {
      const cachedSnap = await getDoc(ref);
      if (cachedSnap.exists()) {
        return { status: 'found', data: cachedSnap.data() };
      }
      return { status: 'error', data: null };
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, WORKSPACE_PATH);
    return { status: 'error', data: null };
  }
}

export async function saveMasterWorkspaceToFirestore(
  allData: Record<string, any>,
  updatedAtMs?: number
): Promise<number> {
  const ref = doc(db, WORKSPACE_COLLECTION, WORKSPACE_DOC_ID);
  const payload = buildValidatedWorkspacePayload(allData, updatedAtMs);
  try {
    await setDoc(ref, payload);
    const timeStr = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    localStorage.setItem('ayurlife_cloud_last_synced', timeStr);
    window.dispatchEvent(new CustomEvent('ayurlife_cloud_synced', { detail: { time: timeStr } }));
    return payload.updatedAtMs;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, WORKSPACE_PATH);
    return payload.updatedAtMs;
  }
}

export function subscribeToMasterWorkspaceFirestore(
  onUpdate: (data: Record<string, any>) => void
): () => void {
  const ref = doc(db, WORKSPACE_COLLECTION, WORKSPACE_DOC_ID);
  return onSnapshot(
    ref,
    (snapshot) => {
      if (snapshot.exists()) {
        onUpdate(snapshot.data());
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, WORKSPACE_PATH);
    }
  );
}
