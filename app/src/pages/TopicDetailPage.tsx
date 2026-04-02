import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Calendar, User, Tag, BookText, Scroll, MessageSquare, BookOpen, Lightbulb, X } from 'lucide-react';
import { useRadioData } from '@/contexts/RadioDataContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TopicDetailPageProps {
  topicId: string;
  onBack: () => void;
}

export default function TopicDetailPage({ topicId, onBack }: TopicDetailPageProps) {
  const { getTopicById } = useRadioData();
  const topic = getTopicById(topicId);

  if (!topic) {
    return (
      <div className="animate-fadeIn text-center py-12">
        <p className="text-gray-500">الموضوع غير موجود</p>
        <Button onClick={onBack} className="mt-4">
          العودة
        </Button>
      </div>
    );
  }

  const sections = [
    { id: 'introduction', label: 'المقدمة', icon: BookText, content: topic.introduction },
    { id: 'quran', label: 'القرآن الكريم', icon: Scroll, content: topic.quran },
    { id: 'hadith', label: 'الحديث الشريف', icon: MessageSquare, content: topic.hadith },
    { id: 'morningWord', label: 'الكلمة الصباحية', icon: BookOpen, content: topic.morningWord },
    { id: 'wisdom', label: 'الحكمة', icon: Lightbulb, content: topic.wisdom },
    { id: 'conclusion', label: 'الخاتمة', icon: X, content: topic.conclusion },
  ];

  return (
    <div className="animate-fadeIn space-y-6">
      <Button variant="ghost" onClick={onBack} className="gap-1">
        <ChevronRight className="w-4 h-4" />
        العودة للمواضيع
      </Button>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
              <Tag className="w-4 h-4" />
              {topic.category}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {topic.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(topic.createdAt).toLocaleDateString('ar-SA')}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {topic.createdBy === '1' ? 'المشرف العام' : topic.createdBy}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="introduction" className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-6">
              {sections.map((section) => (
                <TabsTrigger key={section.id} value={section.id} className="gap-1">
                  <section.icon className="w-4 h-4 hidden md:inline" />
                  <span className="text-xs md:text-sm">{section.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {sections.map((section) => (
              <TabsContent key={section.id} value={section.id}>
                <div className="bg-gradient-to-br from-primary/5 to-blue-50 p-6 rounded-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                      <section.icon className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-primary">{section.label}</h2>
                  </div>
                  <div className="leading-relaxed text-gray-700 whitespace-pre-wrap text-lg">
                    {section.content}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
