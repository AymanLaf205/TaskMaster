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
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-primary">{t.title}</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            >
              <Languages className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2 mb-8">
          <TodoCalendar
            selectedDate={selectedDate}
            onDateSelect={(date) => date && setSelectedDate(date)}
          />
          <TimePicker
            value={selectedTime}
            onChange={setSelectedTime}
          />
          <Input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder={t.placeholder}
            className="flex-1"
          />
          <Button type="submit">{t.add}</Button>
        </form>

        <div className="space-y-4">
          {todos.length === 0 ? (
            <p className="text-center text-muted-foreground">{t.noTasks}</p>
          ) : (
            sortedTodos.map((todo, index) => (
              <div
                key={todo.id}
                className="flex items-start justify-between p-4 bg-card rounded-lg shadow-sm border border-border/50 hover:border-border/100 transition-colors duration-200"
              >
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <span className="text-sm text-muted-foreground mt-1 w-6">
                    {index + 1}.
                  </span>
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                    className="mt-1"
                  />
                  <div className="flex flex-col min-w-0">
                    <span className={`${todo.completed ? 'line-through text-muted-foreground' : ''} break-words whitespace-pre-wrap max-w-full`}>
                      {todo.text}
                    </span>
                    <span className="text-sm text-muted-foreground mt-1">
                      {todo.time}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingTodo({ id: todo.id, text: todo.text })}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                      >
                        <Trash2 className="h-5 w-5" />
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