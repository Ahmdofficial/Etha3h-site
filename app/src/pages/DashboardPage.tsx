import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Calendar, 
  Radio, 
  ChevronLeft,
  Clock,
  TrendingUp,
  Shield,
  UserCog,
  CalendarDays
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRadioData } from '@/contexts/RadioDataContext';
import type { View } from '@/types';

interface DashboardPageProps {
  onNavigate: (view: View, topicId?: string) => void;
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const { user, isAdmin, isSuperAdmin, getPendingRequests } = useAuth();
  const { topics, programs } = useRadioData();

  const scheduledPrograms = programs.filter(p => p.status === 'scheduled').length;
  const completedPrograms = programs.filter(p => p.status === 'completed').length;
  const pendingPrograms = programs.filter(p => p.status === 'pending').length;
  const pendingRequests = getPendingRequests().length;

  const stats = [
    {
      title: 'إجمالي المواضيع',
      value: topics.length,
      icon: BookOpen,
      color: 'bg-blue-500',
      onClick: () => onNavigate('topics'),
    },
    {
      title: 'البرامج المجدولة',
      value: scheduledPrograms,
      icon: Calendar,
      color: 'bg-green-500',
      onClick: () => onNavigate('schedule'),
    },
    {
      title: 'البرامج المنتهية',
      value: completedPrograms,
      icon: TrendingUp,
      color: 'bg-purple-500',
      onClick: () => onNavigate('schedule'),
    },
    {
      title: 'البرامج القادمة',
      value: pendingPrograms,
      icon: Clock,
      color: 'bg-amber-500',
      onClick: () => onNavigate('schedule'),
    },
  ];

  const recentPrograms = programs.slice(0, 5);

  return (
    <div className="animate-fadeIn space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              أهلاً بك، {user?.name}!
            </h1>
            <p className="text-blue-100">
              {isSuperAdmin() 
                ? 'أنت المشرف - لديك جميع الصلاحيات' 
                : isAdmin() 
                ? 'لديك صلاحيات الأدمن' 
                : 'أنت في وضع المشاهدة'}
            </p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Radio className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card 
            key={index} 
            className="card-hover cursor-pointer"
            onClick={stat.onClick}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Admin Alert */}
      {isSuperAdmin() && pendingRequests > 0 && (
        <Card className="border-amber-500 border-l-4">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <UserCog className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-medium">لديك {pendingRequests} طلب/طلبات أدمن معلقة</p>
                <p className="text-sm text-gray-500">يرجى مراجعة الطلبات في لوحة التحكم</p>
              </div>
            </div>
            <Button onClick={() => onNavigate('admin')}>
              مراجعة
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Programs */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">آخر البرامج</CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate('schedule')}
              className="gap-1"
            >
              عرض الكل
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentPrograms.length === 0 ? (
                <p className="text-gray-500 text-center py-4">لا توجد برامج مسجلة</p>
              ) : (
                recentPrograms.map((program) => (
                  <div 
                    key={program.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{program.topicTitle}</p>
                      <p className="text-sm text-gray-500">{program.dayName} - {program.presenter}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      program.status === 'completed' ? 'bg-green-100 text-green-800' :
                      program.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {program.status === 'completed' ? 'منتهي' :
                       program.status === 'scheduled' ? 'مجدول' : 'قادم'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">روابط سريعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => onNavigate('topics')}
              >
                <BookOpen className="w-6 h-6 text-primary" />
                <span>بنك الإذاعة</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => onNavigate('schedule')}
              >
                <Calendar className="w-6 h-6 text-green-500" />
                <span>الجدول الإذاعي</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => onNavigate('calendar')}
              >
                <CalendarDays className="w-6 h-6 text-amber-500" />
                <span>التقويم السنوي</span>
              </Button>
              {(isAdmin() || isSuperAdmin()) && (
                <Button 
                  variant="outline" 
                  className="h-auto py-4 flex flex-col items-center gap-2"
                  onClick={() => onNavigate('admin')}
                >
                  <Shield className="w-6 h-6 text-purple-500" />
                  <span>لوحة التحكم</span>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
