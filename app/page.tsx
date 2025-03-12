"use client"

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useTodoStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Sun, Moon, Trash2, Pencil, Languages } from 'lucide-react';
import { TodoCalendar } from '@/components/Calendar';
import { format } from 'date-fns';
import { TimePicker } from '@/components/TimePicker';

const translations = {
  en: {
    title: 'TaskMaster',
    placeholder: 'Add a new task...',
    add: 'Add',
    noTasks: 'No tasks yet. Add one to get started!',
    footer: 'Thank you for using TaskMaster',
    copyright: '© 2025 TaskMaster. All rights reserved.',
    deleteConfirmTitle: 'Are you sure?',
    deleteConfirmDescription: 'This action cannot be undone. This will permanently delete your task.',
    deleteConfirmCancel: 'Cancel',
    deleteConfirmAction: 'Delete',
    editTitle: 'Edit Task',
    save: 'Save',
    cancel: 'Cancel',
  },
  ar: {
    title: 'تاسك ماستر',
    placeholder: 'أضف مهمة جديدة...',
    add: 'إضافة',
    noTasks: 'لا توجد مهام بعد. أضف واحدة للبدء!',
    footer: 'شكراً لاستخدامك تاسك ماستر',
    copyright: '© 2025 تاسك ماستر. جميع الحقوق محفوظة.',
    deleteConfirmTitle: 'هل أنت متأكد؟',
    deleteConfirmDescription: 'لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف مهمتك نهائياً.',
    deleteConfirmCancel: 'إلغاء',
    deleteConfirmAction: 'حذف',
    editTitle: 'تعديل المهمة',
    save: 'حفظ',
    cancel: 'إلغاء',
  },
};

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [newTodo, setNewTodo] = useState('');
  const [editingTodo, setEditingTodo] = useState<{ id: string; text: string } | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState(format(new Date(), 'HH:mm'));
  const { theme, setTheme } = useTheme();
  const { todos, addTodo, toggleTodo, deleteTodo, editTodo, language, setLanguage } = useTodoStore();
  const t = translations[language];

  // Add this useEffect to handle hydration
  useEffect(() => {
    setMounted(true);
    // Update both date and time every minute
    const interval = setInterval(() => {
      setSelectedDate(new Date());
      setSelectedTime(format(new Date(), 'HH:mm'));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodo.trim()) {
      const date = format(selectedDate || new Date(), 'yyyy-MM-dd');
      const time = selectedTime; // Use selected time instead of current time
      addTodo(newTodo.trim(), date, time);
      setNewTodo('');
    }
  };

  const handleEdit = () => {
    if (editingTodo && editingTodo.text.trim()) {
      editTodo(
        editingTodo.id,
        editingTodo.text.trim()
      );
      setEditingTodo(null);
    }
  };

  // Add this function to sort todos
  const sortedTodos = todos
    .filter((todo) => format(selectedDate, 'yyyy-MM-dd') === todo.date)
    .sort((a, b) => {
      // Sort by time
      const timeA = a.time || '00:00';
      const timeB = b.time || '00:00';
      return timeA.localeCompare(timeB);
    });

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div className={`min-h-screen ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:px-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl sm:text-4xl font-bold text-primary">{t.title}</h1>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              >
                <Languages className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6">
        {/* Form */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Date and Time Container */}
            <div className="flex w-full md:w-auto gap-2">
              <div className="flex-1 md:w-[280px]">
                <TodoCalendar
                  selectedDate={selectedDate}
                  onDateSelect={(date) => date && setSelectedDate(date)}
                />
              </div>
              <div className="w-32">
                <TimePicker
                  value={selectedTime}
                  onChange={setSelectedTime}
                />
              </div>
            </div>
            
            {/* Task Input Container */}
            <div className="flex flex-1 gap-2">
              <Input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder={t.placeholder}
                className="flex-1 h-10"
              />
              <Button type="submit" className="h-10 whitespace-nowrap">
                {t.add}
              </Button>
            </div>
          </div>
        </form>

        {/* Todo List */}
        <div className="space-y-3">
          {todos.length === 0 ? (
            <p className="text-center text-muted-foreground text-sm sm:text-base">
              {t.noTasks}
            </p>
          ) : (
            sortedTodos.map((todo, index) => (
              <div
                key={todo.id}
                className="flex items-start gap-2 p-3 sm:p-4 bg-card rounded-lg shadow-sm border border-border/50"
              >
                <span className="text-xs sm:text-sm text-muted-foreground mt-1 w-4 sm:w-6">
                  {index + 1}.
                </span>
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <span className={`${todo.completed ? 'line-through text-muted-foreground' : ''} text-sm sm:text-base break-words`}>
                    {todo.text}
                  </span>
                  <span className="block text-xs sm:text-sm text-muted-foreground mt-1">
                    {todo.time}
                  </span>
                </div>
                <div className="flex gap-1 sm:gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingTodo({ id: todo.id, text: todo.text })}
                    className="h-8 w-8"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t.deleteConfirmTitle}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t.deleteConfirmDescription}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t.deleteConfirmCancel}</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteTodo(todo.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          {t.deleteConfirmAction}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))
          )}
        </div>

        <Dialog open={editingTodo !== null} onOpenChange={() => setEditingTodo(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.editTitle}</DialogTitle>
            </DialogHeader>
            <div className="my-4">
              <Input
                value={editingTodo?.text || ''}
                onChange={(e) => setEditingTodo(prev => prev ? { ...prev, text: e.target.value } : null)}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingTodo(null)}>
                {t.cancel}
              </Button>
              <Button onClick={handleEdit}>{t.save}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <footer className="mt-16 text-center text-muted-foreground">
          <p className="mb-2">{t.footer}</p>
          <p className="text-sm">{t.copyright}</p>
        </footer>
      </div>
    </div>
  );
}