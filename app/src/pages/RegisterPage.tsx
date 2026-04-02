import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { UserPlus, User, Lock, Eye, EyeOff, UserCircle, Shield, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface RegisterPageProps {
  onRegister: () => void;
  onLogin: () => void;
}

export default function RegisterPage({ onRegister, onLogin }: RegisterPageProps) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [wantAdmin, setWantAdmin] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { register, requestAdminRole } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }

    if (password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const role = wantAdmin ? 'admin' : 'user';
      const success = register(username, password, name, role);
      if (success) {
        if (wantAdmin) {
          // Get the newly created user and create admin request
          const users = JSON.parse(localStorage.getItem('radio_users') || '[]');
          const newUser = users.find((u: any) => u.username === username);
          if (newUser) {
            requestAdminRole(newUser.id, username, name);
          }
          setSuccessMessage('تم إنشاء الحساب بنجاح! تم إرسال طلبك للحصول على صلاحيات الأدمن إلى المشرف العام للموافقة.');
        } else {
          setSuccessMessage('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.');
        }
        setShowSuccessDialog(true);
      } else {
        setError('اسم المستخدم موجود مسبقاً');
      }
      setIsLoading(false);
    }, 500);
  };

  const handleSuccessClose = () => {
    setShowSuccessDialog(false);
    onRegister();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600 p-4">
      <div className="animate-scaleIn w-full max-w-md">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-4">
              <UserPlus className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-primary">
              إنشاء حساب جديد
            </CardTitle>
            <CardDescription className="text-gray-500">
              سجل في نظام الإذاعة المدرسية
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-right block">
                  الاسم الكامل
                </Label>
                <div className="relative">
                  <UserCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="أدخل اسمك الكامل"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pr-10 text-right"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-right block">
                  اسم المستخدم
                </Label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="أدخل اسم المستخدم"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pr-10 text-right"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-right block">
                  كلمة المرور
                </Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="أدخل كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10 pl-10 text-right"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-right block">
                  تأكيد كلمة المرور
                </Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="أعد إدخال كلمة المرور"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10 text-right"
                    required
                  />
                </div>
              </div>

              {/* Admin Request Option */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={wantAdmin}
                    onChange={(e) => setWantAdmin(e.target.checked)}
                    className="mt-1 w-4 h-4 text-primary rounded"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-amber-600" />
                      <span className="font-medium text-amber-900">أرغب في الحصول على صلاحيات الأدمن</span>
                    </div>
                    <p className="text-sm text-amber-700 mt-1">
                      سيتم إرسال طلبك إلى المشرف العام للموافقة
                    </p>
                  </div>
                </label>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full btn-press"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    جاري إنشاء الحساب...
                  </span>
                ) : (
                  'إنشاء الحساب'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                لديك حساب بالفعل؟{' '}
                <button
                  onClick={onLogin}
                  className="text-primary hover:underline font-medium"
                >
                  تسجيل الدخول
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="text-center">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <DialogTitle className="text-xl">تم بنجاح!</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600 mb-4">{successMessage}</p>
          <Button onClick={handleSuccessClose} className="w-full">
            حسناً
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
