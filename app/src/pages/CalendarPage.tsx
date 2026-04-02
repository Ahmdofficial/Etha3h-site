import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronRight, ChevronLeft, CalendarDays, Clock, User, BookOpen } from 'lucide-react';
import { useRadioData } from '@/contexts/RadioDataContext';
import { arabicMonths, arabicDays } from '@/data/initialData';

export default function CalendarPage() {
  const { programs } = useRadioData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Get programs for this month
  const monthPrograms = programs.filter((p) => {
    const pDate = new Date(p.date);
    return pDate.getMonth() === month && pDate.getFullYear() === year;
  });

  const hasProgram = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return monthPrograms.some((p) => p.date === dateStr);
  };

  const getDayPrograms = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return monthPrograms.filter((p) => p.date === dateStr);
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setIsDialogOpen(true);
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(year, month + direction, 1));
  };

  const selectedPrograms = selectedDate
    ? programs.filter((p) => p.date === selectedDate)
    : [];

  // Generate calendar grid
  const calendarDays = [];
  
  // Empty cells for days before the first day of month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="animate-fadeIn space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">التقويم السنوي</h1>
        <p className="text-gray-500">عرض البرامج الإذاعية حسب التاريخ</p>
      </div>

      {/* Calendar Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth(-1)}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
            <div className="text-center">
              <CardTitle className="text-xl">
                {arabicMonths[month]} {year}
              </CardTitle>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth(1)}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={() => setCurrentDate(new Date())}
          >
            اليوم
          </Button>
        </CardHeader>
        <CardContent>
          {/* Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {arabicDays.map((day) => (
              <div
                key={day}
                className="text-center py-2 font-semibold text-gray-600 bg-gray-100 rounded"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`
                  aspect-square p-2 border rounded-lg min-h-[80px] md:min-h-[100px]
                  ${day === null ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-200 cursor-pointer hover:border-primary hover:shadow-md transition-all'}
                  ${day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear() ? 'ring-2 ring-primary ring-offset-2' : ''}
                `}
                onClick={() => day !== null && handleDayClick(day)}
              >
                {day !== null && (
                  <>
                    <span className="text-sm md:text-base font-medium">{day}</span>
                    {hasProgram(day) && (
                      <div className="mt-1">
                        <span className="inline-flex items-center justify-center w-5 h-5 md:w-6 md:h-6 bg-primary text-white text-xs rounded-full">
                          {getDayPrograms(day).length}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <div className="flex items-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary rounded-full"></div>
          <span>يوجد برنامج</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-primary rounded-full"></div>
          <span>اليوم</span>
        </div>
      </div>

      {/* Day Programs Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5" />
              برامج يوم {selectedDate && new Date(selectedDate).toLocaleDateString('ar-SA')}
            </DialogTitle>
          </DialogHeader>
          
          {selectedPrograms.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p>لا توجد برامج في هذا اليوم</p>
            </div>
          ) : (
            <div className="space-y-4">
              {selectedPrograms.map((program) => (
                <Card key={program.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-lg">{program.topicTitle}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        program.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : program.status === 'scheduled'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {program.status === 'completed'
                          ? 'منتهي'
                          : program.status === 'scheduled'
                          ? 'مجدول'
                          : 'قادم'}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>المقدم: {program.presenter}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>اليوم: {program.dayName}</span>
                      </div>
                      {program.notes && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-gray-500">
                          {program.notes}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
