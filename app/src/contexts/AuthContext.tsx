import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, AdminRequest, UserRole } from '@/types';
import { initialUsers, initialAdminRequests } from '@/data/initialData';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  register: (username: string, password: string, name: string, role?: UserRole) => boolean;
  isAdmin: () => boolean;
  isSuperAdmin: () => boolean;
  getAllUsers: () => User[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => boolean;
  deleteUser: (id: string) => boolean;
  updateUser: (id: string, data: Partial<User>) => void;
  resetAllData: () => void;
  // Admin requests
  adminRequests: AdminRequest[];
  requestAdminRole: (userId: string, username: string, name: string) => void;
  approveAdminRequest: (requestId: string, approved: boolean) => void;
  getPendingRequests: () => AdminRequest[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('radio_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });
  const [adminRequests, setAdminRequests] = useState<AdminRequest[]>(() => {
    const saved = localStorage.getItem('radio_admin_requests');
    return saved ? JSON.parse(saved) : initialAdminRequests;
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('radio_current_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('radio_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('radio_admin_requests', JSON.stringify(adminRequests));
  }, [adminRequests]);

  const login = (username: string, password: string): boolean => {
    const foundUser = users.find(
      (u) => u.username === username && u.password === password
    );
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('radio_current_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('radio_current_user');
  };

  const register = (username: string, password: string, name: string, role: UserRole = 'user'): boolean => {
    if (users.some((u) => u.username === username)) {
      return false;
    }
    
    // If registering as admin, set isApproved to false (needs superadmin approval)
    const isApproved = role === 'user';
    
    const newUser: User = {
      id: Date.now().toString(),
      username,
      password,
      name,
      role,
      isApproved,
      createdAt: new Date().toISOString(),
    };
    setUsers([...users, newUser]);
    return true;
  };

  const isAdmin = () => user?.role === 'admin' || user?.role === 'superadmin';
  const isSuperAdmin = () => user?.role === 'superadmin';

  const getAllUsers = () => users;

  const addUser = (userData: Omit<User, 'id' | 'createdAt'>): boolean => {
    if (users.some((u) => u.username === userData.username)) {
      return false;
    }
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setUsers([...users, newUser]);
    return true;
  };

  const deleteUser = (id: string): boolean => {
    if (id === '1') return false; // Prevent deleting superadmin
    const newUsers = users.filter((u) => u.id !== id);
    setUsers(newUsers);
    return true;
  };

  const updateUser = (id: string, data: Partial<User>) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, ...data } : u)));
  };

  // Reset all data
  const resetAllData = () => {
    localStorage.removeItem('radio_users');
    localStorage.removeItem('radio_admin_requests');
    localStorage.removeItem('radio_topics');
    localStorage.removeItem('radio_programs');
    localStorage.removeItem('radio_current_user');
    setUsers(initialUsers);
    setAdminRequests(initialAdminRequests);
    setUser(null);
    window.location.reload();
  };

  // Admin requests
  const requestAdminRole = (userId: string, username: string, name: string) => {
    const newRequest: AdminRequest = {
      id: Date.now().toString(),
      userId,
      username,
      name,
      status: 'pending',
      requestedAt: new Date().toISOString(),
    };
    setAdminRequests([...adminRequests, newRequest]);
  };

  const approveAdminRequest = (requestId: string, approved: boolean) => {
    const request = adminRequests.find((r) => r.id === requestId);
    if (request) {
      // Update request status
      setAdminRequests(
        adminRequests.map((r) =>
          r.id === requestId
            ? {
                ...r,
                status: approved ? 'approved' : 'rejected',
                processedAt: new Date().toISOString(),
                processedBy: user?.id,
              }
            : r
        )
      );
      
      // Update user role if approved
      if (approved) {
        updateUser(request.userId, { role: 'admin', isApproved: true });
      }
    }
  };

  const getPendingRequests = () => adminRequests.filter((r) => r.status === 'pending');

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        isAdmin,
        isSuperAdmin,
        getAllUsers,
        addUser,
        deleteUser,
        updateUser,
        resetAllData,
        adminRequests,
        requestAdminRole,
        approveAdminRequest,
        getPendingRequests,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
