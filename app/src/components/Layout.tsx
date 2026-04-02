import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  Settings, 
  LogOut, 
  Menu,
  X,
  Radio,
  ChevronLeft,
  CalendarDays,
  UserCog,
  Shield
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { View } from '@/types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  onNavigate: (view: View, topicId?: string) => void;
  onLogout: () => void;
}

const menuItems: { view: View; label: string; icon: React.ElementType; adminOnly?: boolean; superAdminOnly?: boolean }[] = [
  { view: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard },
  { view: 'calendar', label: 'التقويم السنوي', icon: CalendarDays },
  { view: 'schedule', label: 'الجدول الإذاعي', icon: Calendar },
  { view: 'topics', label: 'بنك الإذاعة', icon: BookOpen },
  { view: 'admin', label: 'لوحة التحكم', icon: Settings, adminOnly: true },
];

export default function Layout({ children, currentView, onNavigate, onLogout }: LayoutProps) {
  const { user, isAdmin, isSuperAdmin, getPendingRequests } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const pendingRequests = getPendingRequests().length;

  const visibleMenuItems = menuItems.filter(
    (item) => {
      if (item.superAdminOnly) return isSuperAdmin();
      if (item.adminOnly) return isAdmin() || isSuperAdmin();
      return true;
    }
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-72 bg-white border-l border-gray-200 transform transition-transform duration-300 lg:translate-x-0 lg:static ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:hidden'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Radio className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-primary">الإذاعة المدرسية</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                {isSuperAdmin() ? (
                  <Shield className="w-6 h-6 text-purple-600" />
                ) : isAdmin() ? (
                  <UserCog className="w-6 h-6 text-blue-600" />
                ) : (
                  <span className="text-primary font-bold text-lg">
                    {user?.name.charAt(0)}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-500">
                  {isSuperAdmin() ? 'مشرف' : isAdmin() ? 'أدمن' : 'مستخدم'}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {visibleMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => {
                    onNavigate(item.view);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-right transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {isActive && <ChevronLeft className="w-4 h-4 mr-auto" />}
                  {item.view === 'admin' && pendingRequests > 0 && (
                    <span className="bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-auto">
                      {pendingRequests}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={onLogout}
            >
              <LogOut className="w-5 h-5" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Radio className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-primary">الإذاعة المدرسية</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </Button>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:flex h-16 bg-white border-b border-gray-200 items-center justify-between px-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {visibleMenuItems.find((item) => item.view === currentView)?.label}
          </h2>
          {pendingRequests > 0 && isSuperAdmin() && (
            <div className="flex items-center gap-2 text-amber-600">
              <UserCog className="w-5 h-5" />
              <span>{pendingRequests} طلب أدمن معلق</span>
            </div>
          )}
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
