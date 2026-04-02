export type UserRole = 'user' | 'admin' | 'superadmin';

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  name: string;
  isApproved: boolean;
  createdAt: string;
}

export interface AdminRequest {
  id: string;
  userId: string;
  username: string;
  name: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  processedAt?: string;
  processedBy?: string;
}

export interface RadioTopic {
  id: string;
  title: string;
  category: string;
  // الأقسام الستة
  introduction: string; // المقدمة
  quran: string; // القرآن الكريم
  hadith: string; // الحديث الشريف
  morningWord: string; // الكلمة الصباحية
  wisdom: string; // الحكمة
  conclusion: string; // الخاتمة
  createdBy: string;
  createdAt: string;
}

export interface RadioProgram {
  id: string;
  date: string;
  dayName: string;
  topicId: string;
  topicTitle: string;
  presenter: string;
  status: 'scheduled' | 'completed' | 'pending';
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
}

export type View = 
  | 'login' 
  | 'register' 
  | 'dashboard' 
  | 'schedule' 
  | 'calendar'
  | 'topics' 
  | 'admin' 
  | 'topic-detail'
  | 'admin-requests';
