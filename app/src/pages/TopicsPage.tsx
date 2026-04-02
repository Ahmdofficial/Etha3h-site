import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Plus, Edit2, Trash2, Search, Filter, Eye, BookText, Scroll, MessageSquare, Lightbulb, X } from 'lucide-react';
import { useRadioData } from '@/contexts/RadioDataContext';
import { useAuth } from '@/contexts/AuthContext';
import type { RadioTopic } from '@/types';
import { initialCategories } from '@/data/initialData';
import type { View } from '@/types';

interface TopicsPageProps {
  onNavigate: (view: View, topicId?: string) => void;
}

export default function TopicsPage({ onNavigate }: TopicsPageProps) {
  const { topics, addTopic, updateTopic, deleteTopic } = useRadioData();
  const { isAdmin, isSuperAdmin } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<RadioTopic | null>(null);
  const [activeTab, setActiveTab] = useState('introduction');
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    introduction: '',
    quran: '',
    hadith: '',
    morningWord: '',
    wisdom: '',
    conclusion: '',
  });

  const filteredTopics = topics.filter((topic) => {
    const matchesSearch =
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.introduction.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || topic.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTopic) {
      updateTopic(editingTopic.id, formData);
    } else {
      addTopic({
        ...formData,
        createdBy: '1',
      });
    }
    resetForm();
    setIsDialogOpen(false);
  };

  const handleEdit = (topic: RadioTopic) => {
    setEditingTopic(topic);
    setFormData({
      title: topic.title,
      category: topic.category,
      introduction: topic.introduction,
      quran: topic.quran,
      hadith: topic.hadith,
      morningWord: topic.morningWord,
      wisdom: topic.wisdom,
      conclusion: topic.conclusion,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الموضوع؟')) {
      deleteTopic(id);
    }
  };

  const resetForm = () => {
    setEditingTopic(null);
    setFormData({
      title: '',
      category: '',
      introduction: '',
      quran: '',
      hadith: '',
      morningWord: '',
      wisdom: '',
      conclusion: '',
    });
    setActiveTab('introduction');
  };

  const canEdit = isAdmin() || isSuperAdmin();

  return (
    <div className="animate-fadeIn space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">بنك الإذاعة</h1>
          <p className="text-gray-500">مكتبة المواضيع الإذاعية المتنوعة للبنين</p>
        </div>
        {canEdit && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="gap-2">
                <Plus className="w-4 h-4" />
                إضافة موضوع
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingTopic ? 'تعديل موضوع' : 'إضافة موضوع جديد'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>عنوان الموضوع</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="أدخل عنوان الموضوع"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>التصنيف</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر التصنيف" />
                      </SelectTrigger>
                      <SelectContent>
                        {initialCategories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.name}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-3 md:grid-cols-6">
                    <TabsTrigger value="introduction">المقدمة</TabsTrigger>
                    <TabsTrigger value="quran">القرآن</TabsTrigger>
                    <TabsTrigger value="hadith">الحديث</TabsTrigger>
                    <TabsTrigger value="morningWord">الكلمة</TabsTrigger>
                    <TabsTrigger value="wisdom">الحكمة</TabsTrigger>
                    <TabsTrigger value="conclusion">الخاتمة</TabsTrigger>
                  </TabsList>

                  <TabsContent value="introduction" className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <BookText className="w-4 h-4" />
                      المقدمة
                    </Label>
                    <Textarea
                      value={formData.introduction}
                      onChange={(e) =>
                        setFormData({ ...formData, introduction: e.target.value })
                      }
                      placeholder="مقدمة البرنامج الإذاعي"
                      rows={6}
                      required
                    />
                  </TabsContent>

                  <TabsContent value="quran" className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Scroll className="w-4 h-4" />
                      القرآن الكريم
                    </Label>
                    <Textarea
                      value={formData.quran}
                      onChange={(e) =>
                        setFormData({ ...formData, quran: e.target.value })
                      }
                      placeholder="آية قرآنية مناسبة للموضوع"
                      rows={6}
                      required
                    />
                  </TabsContent>

                  <TabsContent value="hadith" className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      الحديث الشريف
                    </Label>
                    <Textarea
                      value={formData.hadith}
                      onChange={(e) =>
                        setFormData({ ...formData, hadith: e.target.value })
                      }
                      placeholder="حديث شريف متعلق بالموضوع"
                      rows={6}
                      required
                    />
                  </TabsContent>

                  <TabsContent value="morningWord" className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      الكلمة الصباحية
                    </Label>
                    <Textarea
                      value={formData.morningWord}
                      onChange={(e) =>
                        setFormData({ ...formData, morningWord: e.target.value })
                      }
                      placeholder="الكلمة الصباحية"
                      rows={6}
                      required
                    />
                  </TabsContent>

                  <TabsContent value="wisdom" className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      الحكمة
                    </Label>
                    <Textarea
                      value={formData.wisdom}
                      onChange={(e) =>
                        setFormData({ ...formData, wisdom: e.target.value })
                      }
                      placeholder="حكمة أو مقولة"
                      rows={6}
                      required
                    />
                  </TabsContent>

                  <TabsContent value="conclusion" className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <X className="w-4 h-4" />
                      الخاتمة
                    </Label>
                    <Textarea
                      value={formData.conclusion}
                      onChange={(e) =>
                        setFormData({ ...formData, conclusion: e.target.value })
                      }
                      placeholder="خاتمة البرنامج"
                      rows={6}
                      required
                    />
                  </TabsContent>
                </Tabs>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingTopic ? 'حفظ التغييرات' : 'إضافة الموضوع'}
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

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="البحث في المواضيع..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <Filter className="w-4 h-4 ml-2" />
              <SelectValue placeholder="التصنيف" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع التصنيفات</SelectItem>
              {initialCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTopics.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>لا توجد مواضيع مسجلة</p>
          </div>
        ) : (
          filteredTopics.map((topic) => (
            <Card key={topic.id} className="card-hover">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full mb-2">
                      {topic.category}
                    </span>
                    <CardTitle className="text-lg">{topic.title}</CardTitle>
                  </div>
                </div>
                <CardDescription className="line-clamp-2">
                  {topic.introduction.substring(0, 100)}...
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onNavigate('topic-detail', topic.id)}
                    className="gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    عرض التفاصيل
                  </Button>
                  {canEdit && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(topic)}
                      >
                        <Edit2 className="w-4 h-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(topic.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
