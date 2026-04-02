import { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { RadioDataProvider } from '@/contexts/RadioDataContext';
import Layout from '@/components/Layout';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import SchedulePage from '@/pages/SchedulePage';
import CalendarPage from '@/pages/CalendarPage';
import TopicsPage from '@/pages/TopicsPage';
import TopicDetailPage from '@/pages/TopicDetailPage';
import AdminPage from '@/pages/AdminPage';
import type { View } from '@/types';
import { Toaster } from '@/components/ui/sonner';

function AppContent() {
  const { user, logout } = useAuth();
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');

  const handleNavigate = (view: View, topicId?: string) => {
    if (topicId) {
      setSelectedTopicId(topicId);
    }
    setCurrentView(view);
  };

  const handleLogout = () => {
    logout();
    setCurrentView('login');
  };

  // Not logged in
  if (!user) {
    if (currentView === 'register') {
      return (
        <RegisterPage
          onRegister={() => setCurrentView('login')}
          onLogin={() => setCurrentView('login')}
        />
      );
    }
    return (
      <LoginPage
        onLogin={() => setCurrentView('dashboard')}
        onRegister={() => setCurrentView('register')}
      />
    );
  }

  // Render current page
  const renderPage = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} />;
      case 'schedule':
        return <SchedulePage />;
      case 'calendar':
        return <CalendarPage />;
      case 'topics':
        return <TopicsPage onNavigate={handleNavigate} />;
      case 'topic-detail':
        return (
          <TopicDetailPage
            topicId={selectedTopicId}
            onBack={() => setCurrentView('topics')}
          />
        );
      case 'admin':
        return <AdminPage />;
      default:
        return <DashboardPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <Layout
      currentView={currentView}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
    >
      {renderPage()}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <RadioDataProvider>
        <AppContent />
        <Toaster position="top-center" />
      </RadioDataProvider>
    </AuthProvider>
  );
}

export default App;
