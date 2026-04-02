import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { useRadioData } from '@/contexts/RadioDataContext';
import { useAuth } from '@/contexts/AuthContext';
import type { RadioProgram } from '@/types';
import { arabicDays } from '@/data/initialData';

export default function SchedulePage() {
  const { programs, addProgram, updateProgram, deleteProgram, topics } = useRadioData();
  const { isAdmin, isSuperAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<RadioProgram | null>(null);
  const [formData, setFormData] = useState<{
    date: string;
    dayName: string;
    topicId: string;
    topicTitle: string;
    presenter: string;
    status: 'scheduled' | 'completed' | 'pending';
    notes: string;
  }>({
    date: '',
    dayName: '',
    topicId: '',
    topicTitle: '',
    presenter: '',
    status: 'pending',
    notes: '',
  });

  const canEdit = isAdmin() || isSuperAdmin();

  const filteredPrograms = programs.filter(
    (p) =>
      p.topicTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.presenter.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProgram) {
      updateProgram(editingProgram.id, formData);
    } else {
      addProgram(formData);
    }
    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (program: RadioProgram) => {
    setEditingProgram(program);
    setFormData({
      date: program.date,
      dayName: program.dayName,
      topicId: program.topicId,
      topicTitle: program.topicTitle,
      presenter: program.presenter,
      status: program.status,
      notes: program.notes || '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا البرنامج؟')) {
      deleteProgram(id);
    }
  };

  const resetForm = () => {
    setEditingProgram(null);
    setFormData({
      date: '',
      dayName: '',
      topicId: '',
      topicTitle: '',
      presenter: '',
      status: 'pending',
      notes: '',
    });
  };

  const handleDateChange = (date: string) => {
    const dayIndex = new Date(date).getDay();
    setFormData({
      ...formData,
      date,
      dayName: arabicDays[dayIndex],
    });
  };

  const handleTopicChange = (topicId: string) => {
    const topic = topics.find((t) => t.id === topicId);
    if (topic) {
      setFormData({
        ...formData,
        topicId,
        topicTitle: topic.title,
      });
    }
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">جدول السنة الإذاعية</h1>
          <p className="text-gray-500">إدارة البرامج الإذاعية المدرسية للبنين</p>
        </div>
        {canEdit && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="gap-2">
                <Plus className="w-4 h-4" />
                إضافة برنامج
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingProgram ? 'تعديل برنامج' : 'إضافة برنامج جديد'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>التاريخ</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleDateChange(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>اليوم</Label>
                  <Input value={formData.dayName} disabled className="bg-gray-100" />
                </div>

                <div className="space-y-2">
                  <Label>الموضوع</Label>
                  <Select
                    value={formData.topicId}
                    onValueChange={handleTopicChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="اختر موضوعاً" />
                    </SelectTrigger>
                    <SelectContent>
                      {topics.map((topic) => (
                        <SelectItem key={topic.id} value={topic.id}>
                          {topic.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>المقدم</Label>
                  <Input
                    value={formData.presenter}
                    onChange={(e) =>
                      setFormData({ ...formData, presenter: e.target.value })
                    }
                    placeholder="اسم المقدم"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>الحالة</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'scheduled' | 'completed' | 'pending') =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">قادم</SelectItem>
                      <SelectItem value="scheduled">مجدول</SelectItem>
                      <SelectItem value="completed">منتهي</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>ملاحظات</Label>
                  <Input
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="ملاحظات إضافية"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingProgram ? 'حفظ التغييرات' : 'إضافة'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          placeholder="البحث في البرامج..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
        />
      </div>

      {/* Programs Table */}
      <Card>
        <CardContent className="p-0">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>التاريخ</th>
                  <th>اليوم</th>
                  <th>الموضوع</th>
                  <th>المقدم</th>
                  <th>الحالة</th>
                  <th>ملاحظات</th>
                  {canEdit && <th>الإجراءات</th>}
                </tr>
              </thead>
              <tbody>
                {filteredPrograms.length === 0 ? (
                  <tr>
                    <td
                      colSpan={canEdit ? 7 : 6}
                      className="text-center py-8 text-gray-500"
                    >
                      لا توجد برامج مسجلة
                    </td>
                  </tr>
                ) : (
                  filteredPrograms.map((program) => (
                    <tr key={program.id}>
                      <td>{program.date}</td>
                      <td>{program.dayName}</td>
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
                      <td className="text-gray-500">{program.notes || '-'}</td>
                      {canEdit && (
                        <td>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(program)}
                            >
                              <Edit2 className="w-4 h-4 text-blue-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(program.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
