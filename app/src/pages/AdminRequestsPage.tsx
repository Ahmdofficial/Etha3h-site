import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, UserCheck, Clock, UserX } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminRequestsPage() {
  const { adminRequests, approveAdminRequest, getPendingRequests, isSuperAdmin } = useAuth();

  const pendingRequests = getPendingRequests();
  const processedRequests = adminRequests.filter((r) => r.status !== 'pending');

  const handleApprove = (requestId: string) => {
    if (confirm('هل أنت متأكد من الموافقة على هذا الطلب؟')) {
      approveAdminRequest(requestId, true);
    }
  };

  const handleReject = (requestId: string) => {
    if (confirm('هل أنت متأكد من رفض هذا الطلب؟')) {
      approveAdminRequest(requestId, false);
    }
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">طلبات الأدمن</h1>
        <p className="text-gray-500">إدارة طلبات الحصول على صلاحيات الأدمن</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">الطلبات المعلقة</p>
                <p className="text-3xl font-bold text-amber-600">{pendingRequests.length}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">الطلبات المقبولة</p>
                <p className="text-3xl font-bold text-green-600">
                  {adminRequests.filter((r) => r.status === 'approved').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">الطلبات المرفوضة</p>
                <p className="text-3xl font-bold text-red-600">
                  {adminRequests.filter((r) => r.status === 'rejected').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <UserX className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-bold mb-4">الطلبات المعلقة</h2>
          {pendingRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>لا توجد طلبات معلقة</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-lg"
                >
                  <div className="mb-4 md:mb-0">
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
                        onClick={() => handleApprove(request.id)}
                        className="gap-1 bg-green-600 hover:bg-green-700"
                      >
                        <Check className="w-4 h-4" />
                        قبول
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleReject(request.id)}
                        className="gap-1"
                      >
                        <X className="w-4 h-4" />
                        رفض
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Processed Requests */}
      {processedRequests.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-bold mb-4">الطلبات السابقة</h2>
            <div className="space-y-3">
              {processedRequests.map((request) => (
                <div
                  key={request.id}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    request.status === 'approved'
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
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
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
