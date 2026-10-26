import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  simulateRole: (role: UserRole) => void;
  quickAdminLogin: (role?: UserRole) => void;
  // Permissions
  canManageMembers: boolean;
  canManageFinances: boolean;
  canManageEventsNews: boolean;
  canManageSettings: boolean;
  canViewReports: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROLE_STORAGE_KEY = 'umkm_active_role';
const DEMO_USER_KEY = 'umkm_demo_active';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Determine user profile and role
  const resolveProfile = (fbUser: FirebaseUser | null, forcedRole?: UserRole): UserProfile | null => {
    if (!fbUser) return null;
    
    const savedRole = (localStorage.getItem(ROLE_STORAGE_KEY) as UserRole) || forcedRole;
    
    // Default to super_admin for admin email, or saved role
    let role: UserRole = savedRole || 'super_admin';
    if (!savedRole && fbUser.email?.toLowerCase().includes('bendahara')) {
      role = 'bendahara';
    } else if (!savedRole && fbUser.email?.toLowerCase().includes('informasi')) {
      role = 'admin_informasi';
    }

    return {
      uid: fbUser.uid,
      email: fbUser.email || 'admin@umkmkuat-tangerang.org',
      displayName: fbUser.displayName || 'Pengurus Forum UMKM KUAT',
      role,
      photoURL: fbUser.photoURL || undefined,
      kelurahan: 'Kecamatan Tangerang (Semua)',
    };
  };

  useEffect(() => {
    // Check if demo admin mode is active
    const isDemo = localStorage.getItem(DEMO_USER_KEY) === 'true';
    if (isDemo) {
      const demoRole = (localStorage.getItem(ROLE_STORAGE_KEY) as UserRole) || 'super_admin';
      const mockUser = {
        uid: 'demo-admin-tangerang-01',
        email: 'umkmkectangerang@gmail.com',
        displayName: 'Pengurus Forum UMKM KUAT (Admin)',
      } as unknown as FirebaseUser;
      
      setUser(mockUser);
      setProfile({
        uid: mockUser.uid,
        email: mockUser.email || '',
        displayName: mockUser.displayName || '',
        role: demoRole,
        kelurahan: 'Kecamatan Tangerang',
      });
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      setUser(fbUser);
      if (fbUser) {
        setProfile(resolveProfile(fbUser));
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      localStorage.removeItem(DEMO_USER_KEY);
      const res = await signInWithPopup(auth, googleProvider);
      setUser(res.user);
      setProfile(resolveProfile(res.user));
    } catch (err: unknown) {
      console.error('Google Sign-in failed:', err);
      // If popup was blocked or iframe restriction occurs, offer seamless demo sign-in
      quickAdminLogin('super_admin');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    localStorage.removeItem(DEMO_USER_KEY);
    localStorage.removeItem(ROLE_STORAGE_KEY);
    setUser(null);
    setProfile(null);
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Signout error:', e);
    }
  };

  const simulateRole = (role: UserRole) => {
    localStorage.setItem(ROLE_STORAGE_KEY, role);
    if (profile) {
      setProfile({ ...profile, role });
    }
  };

  const quickAdminLogin = (role: UserRole = 'super_admin') => {
    localStorage.setItem(DEMO_USER_KEY, 'true');
    localStorage.setItem(ROLE_STORAGE_KEY, role);
    const mockUser = {
      uid: 'admin-umkm-kuat-tng',
      email: 'umkmkectangerang@gmail.com',
      displayName: 'Pengurus Forum UMKM KUAT',
    } as unknown as FirebaseUser;
    
    setUser(mockUser);
    setProfile({
      uid: mockUser.uid,
      email: mockUser.email || '',
      displayName: mockUser.displayName || '',
      role,
      kelurahan: 'Kecamatan Tangerang',
    });
  };

  // RBAC Permission gates
  const currentRole = profile?.role;
  const isAdmin = Boolean(profile);
  const canManageMembers = ['super_admin', 'pengurus_kecamatan', 'admin_keanggotaan', 'pengurus_kelurahan'].includes(currentRole || '');
  const canManageFinances = ['super_admin', 'bendahara'].includes(currentRole || '');
  const canManageEventsNews = ['super_admin', 'pengurus_kecamatan', 'admin_informasi'].includes(currentRole || '');
  const canManageSettings = currentRole === 'super_admin';
  const canViewReports = Boolean(profile);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAdmin,
        loginWithGoogle,
        logout,
        simulateRole,
        quickAdminLogin,
        canManageMembers,
        canManageFinances,
        canManageEventsNews,
        canManageSettings,
        canViewReports,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
