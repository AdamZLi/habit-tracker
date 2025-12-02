import { useState, useCallback } from 'react';
import { Habit, HabitCompletions } from './types';
import { HabitList } from './components/HabitList';
import { Calendar } from './components/Calendar';
import './App.css';

function App() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletions>({});

  const addHabit = useCallback((name: string, icon?: string) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name,
      icon,
    };
    setHabits((prev) => [...prev, newHabit]);
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== id));
    // Also remove completions for this habit
    setCompletions((prev) => {
      const newCompletions: HabitCompletions = {};
      Object.keys(prev).forEach((date) => {
        const habitIds = new Set(prev[date]);
        habitIds.delete(id);
        if (habitIds.size > 0) {
          newCompletions[date] = habitIds;
        }
      });
      return newCompletions;
    });
  }, []);

  const toggleCompletion = useCallback((habitId: string, date: string) => {
    setCompletions((prev) => {
      const newCompletions = { ...prev };
      if (!newCompletions[date]) {
        newCompletions[date] = new Set<string>();
      } else {
        newCompletions[date] = new Set(newCompletions[date]);
      }

      if (newCompletions[date].has(habitId)) {
        newCompletions[date].delete(habitId);
        if (newCompletions[date].size === 0) {
          delete newCompletions[date];
        }
      } else {
        newCompletions[date].add(habitId);
      }

      return newCompletions;
    });
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Habit Tracker</h1>
      </header>
      <main className="app-main">
        <HabitList
          habits={habits}
          onAddHabit={addHabit}
          onDeleteHabit={deleteHabit}
        />
        <Calendar
          habits={habits}
          completions={completions}
          onToggleCompletion={toggleCompletion}
        />
      </main>
    </div>
  );
}

export default App;

