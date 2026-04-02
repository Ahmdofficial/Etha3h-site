import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Users, BookOpen, Calendar, Trash2, UserPlus, UserCog, Check, X, RotateCcw, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRadioData } from '@/contexts/RadioDataContext';
import type { UserRole } from '@/types';

export default function AdminPage() {
  const { 
    getAllUsers, 
    addUser, 
    deleteUser,
    isSuperAdmin,
    adminRequests,
    approveAdminRequest,
    getPendingRequests,
    resetAllData 
  } = useAuth();
  const { topics, programs, deleteTopic, deleteProgram } = useRadioData();
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    name: '',
    role: 'user' as UserRole,
  });

  const users = getAllUsers();
  const pendingRequests = getPendingRequests();

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const success = addUser({ ...newUser, isApproved: newUser.role === 'user' });
    if (success) {
      setNewUser({ username: '', password: '', name: '', role: 'user' });
      setIsUserDialogOpen(false);
    } else {
      alert('اسم المستخدم موجود مسبقاً');
    }
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      deleteUser(id);
    }
  };

  const handleApproveRequest = (requestId: string, approved: boolean) => {
    if (confirm(approved ? 'هل أنت متأكد من الموافقة على هذا الطلب؟' : 'هل أنت متأكد من رفض هذا الطلب؟')) {
      approveAdminRequest(requestId, approved);
    }
  };

  const handleResetData = () => {
    resetAllData();
    setIsResetDialogOpen(false);
  };

  const stats = [
    { title: 'المستخدمين', value: users.length, icon: Users, color: 'bg-blue-500' },
    { title: 'المواضيع', value: topics.length, icon: BookOpen, color: 'bg-green-500' },
    { title: 'البرامج', value: programs.length, icon: Calendar, color: 'bg-purple-500' },
    { title: 'طلبات معلقة', value: pendingRequests.length, icon: UserCog, color: 'bg-amber-500' },
  ];

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'superadmin':
        return <Badge className="bg-purple-100 text-purple-800">مشرف</Badge>;
      case 'admin':
        return <Badge className="bg-blue-100 text-blue-800">أدمن</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">مستخدم</Badge>;
    }
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">لوحة تحكم المدير</h1>
          <p className="text-gray-500">إدارة المستخدمين والمحتوى</p>
        </div>
        {isSuperAdmin() && (
          <Button
            variant="destructive"
            onClick={() => setIsResetDialogOpen(true)}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            إعادة تعيين البيانات
          </Button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-gray-500 mb-1">{stat.title}</p>
                  <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 md:w-12 md:h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users" className="gap-1 md:gap-2">
            <Users className="w-4 h-4" />
            <span className="hidden md:inline">المستخدمين</span>
          </TabsTrigger>
          <TabsTrigger value="requests" className="gap-1 md:gap-2">
            <UserCog className="w-4 h-4" />
            <span className="hidden md:inline">الطلبات</span>
            {pendingRequests.length > 0 && (
              <span className="bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {pendingRequests.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="topics" className="gap-1 md:gap-2">
            <BookOpen className="w-4 h-4" />
            <span className="hidden md:inline">المواضيع</span>
          </TabsTrigger>
          <TabsTrigger value="programs" className="gap-1 md:gap-2">
            <Calendar className="w-4 h-4" />
            <span className="hidden md:inline">البرامج</span>
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-end">
            {isSuperAdmin() && (
              <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <UserPlus className="w-4 h-4" />
                    إضافة مستخدم
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>إضافة مستخدم جديد</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddUser} className="space-y-4">
                    <div className="space-y-2">
                      <Label>الاسم الكامل</Label>
                      <Input
                        value={newUser.name}
                        onChange={(e) =>
                          setNewUser({ ...newUser, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>اسم المستخدم</Label>
                      <Input
                        value={newUser.username}
                        onChange={(e) =>
                          setNewUser({ ...newUser, username: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>كلمة المرور</Label>
                      <Input
                        type="password"
                        value={newUser.password}
                        onChange={(e) =>
                          setNewUser({ ...newUser, password: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>الصلاحية</Label>
                      <Select
                        value={newUser.role}
                        onValueChange={(value: UserRole) =>
                          setNewUser({ ...newUser, role: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">مستخدم عادي</SelectItem>
                          <SelectItem value="admin">أدمن</SelectItem>
                          {isSuperAdmin() && (
                            <SelectItem value="superadmin">مشرف</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full">
                      إضافة
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>الاسم</th>
                      <th>اسم المستخدم</th>
                      <th>الصلاحية</th>
                      <th>الحالة</th>
                      <th>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="font-medium">{user.name}</td>
                        <td>{user.username}</td>
                        <td>{getRoleBadge(user.role)}</td>
                        <td>
                          {user.isApproved ? (
                            <span className="text-green-600 text-sm">موافق</span>
                          ) : (
                            <span className="text-amber-600 text-sm">معلق</span>
                          )}
                        </td>
                        <td>
                          {user.id !== '1' && isSuperAdmin() && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Requests Tab */}
        <TabsContent value="requests" className="space-y-4">
          {pendingRequests.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-500">
                <UserCog className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>لا توجد طلبات معلقة</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <Card key={request.id} className="border-l-4 border-l-amber-500">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-bold text-lg">{request.name}</span>
                          <Badge variant="outline" className="text-amber-600 border-amber-600">
                            معلق
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm">اسم المستخدم: {request.username}</p>
                        <p className="text-gray-500 text-sm">
                          تاريخ الطلب: {new Date(request.requestedAt).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                      {isSuperAdmin() && (
                        <div className="flex gap-2">
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleApproveRequest(request.id, true)}
                            className="gap-1 bg-green-600 hover:bg-green-700"
                          >
                            <Check className="w-4 h-4" />
                            قبول
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleApproveRequest(request.id, false)}
                            className="gap-1"
                          >
                            <X className="w-4 h-4" />
                            رفض
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Processed Requests */}
          {adminRequests.filter(r => r.status !== 'pending').length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-bold mb-4">الطلبات السابقة</h3>
              <div className="space-y-3">
                {adminRequests
                  .filter((r) => r.status !== 'pending')
                  .map((request) => (
                    <Card key={request.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-medium">{request.name}</span>
                              <Badge
                                className={
                                  request.status === 'approved'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }
                              >
                                {request.status === 'approved' ? 'مقبول' : 'مرفوض'}
                              </Badge>
                            </div>
                            <p className="text-gray-500 text-sm">
                              {request.username} -{' '}
                              {request.processedAt &&
                                new Date(request.processedAt).toLocaleDateString('ar-SA')}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Topics Tab */}
        <TabsContent value="topics" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>العنوان</th>
                      <th>التصنيف</th>
                      <th>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topics.map((topic) => (
                      <tr key={topic.id}>
                        <td className="font-medium">{topic.title}</td>
                        <td>
                          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                            {topic.category}
                          </span>
                        </td>
                        <td>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteTopic(topic.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Programs Tab */}
        <TabsContent value="programs" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>التاريخ</th>
                      <th>الموضوع</th>
                      <th>المقدم</th>
                      <th>الحالة</th>
                      <th>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {programs.map((program) => (
                      <tr key={program.id}>
                        <td>{program.date}</td>
                        <td className="font-medium">{program.topicTitle}</td>
                        <td>{program.presenter}</td>
                        <td>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              program.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : program.status === 'scheduled'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {program.status === 'completed'
                              ? 'منتهي'
                              : program.status === 'scheduled'
                              ? 'مجدول'
                              : 'قادم'}
                          </span>
                        </td>
                        <td>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteProgram(program.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Reset Data Dialog */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertTriangle className="w-8 h-8" />
              <DialogTitle>تحذير: إعادة تعيين جميع البيانات</DialogTitle>
            </div>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              سيتم حذف جميع البيانات وإعادة تعيينها إلى القيم الافتراضية. لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={handleResetData}
                className="flex-1"
              >
                نعم، إعادة التعيين
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsResetDialogOpen(false)}
                className="flex-1"
              >
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
