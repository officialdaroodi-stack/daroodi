'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '@/lib/types';
import { INITIAL_USERS } from '@/lib/mockData';

interface AuthContextType {
  currentUser: UserProfile | null;
  setCurrentUser: (user: UserProfile | null) => void;
  switchRole: (role: UserRole) => void;
  allUsers: UserProfile[];
  createUser: (user: Omit<UserProfile, 'id' | 'created_at'>) => void;
  updateUserRole: (userId: string, newRole: UserRole, managerId?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [allUsers, setAllUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(INITIAL_USERS[0]); // Default to Super Admin

  useEffect(() => {
    // Check local storage for persistent role simulation
    const savedUserId = typeof window !== 'undefined' ? localStorage.getItem('daroodi_active_user') : null;
    if (savedUserId) {
      const found = allUsers.find((u) => u.id === savedUserId);
      if (found) setCurrentUser(found);
    }
  }, [allUsers]);

  const switchRole = (role: UserRole) => {
    const matched = allUsers.find((u) => u.role === role);
    if (matched) {
      setCurrentUser(matched);
      if (typeof window !== 'undefined') {
        localStorage.setItem('daroodi_active_user', matched.id);
      }
    }
  };

  const createUser = (userData: Omit<UserProfile, 'id' | 'created_at'>) => {
    const newUser: UserProfile = {
      ...userData,
      id: `user-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setAllUsers((prev) => [newUser, ...prev]);
  };

  const updateUserRole = (userId: string, newRole: UserRole, managerId?: string) => {
    setAllUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, role: newRole, manager_id: managerId !== undefined ? managerId : u.manager_id }
          : u
      )
    );
    if (currentUser?.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, role: newRole, manager_id: managerId } : null));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        allUsers,
        createUser,
        updateUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
