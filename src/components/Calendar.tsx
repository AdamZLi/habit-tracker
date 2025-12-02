import { useState } from 'react';
import { Habit, HabitCompletions } from '../types';
import './Calendar.css';

interface CalendarProps {
  habits: Habit[];
  completions: HabitCompletions;
  onToggleCompletion: (habitId: string, date: string) => void;
}

export function Calendar({ habits, completions, onToggleCompletion }: CalendarProps) {
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  
  const currentMonth = selectedMonth;
  const currentYear = selectedYear;

  // Get first day of month and number of days
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  // Generate calendar days
  const days: (number | null)[] = [];
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Generate year options (current year ± 10 years)
  const currentYearValue = today.getFullYear();
  const yearOptions: number[] = [];
  for (let year = currentYearValue - 10; year <= currentYearValue + 10; year++) {
    yearOptions.push(year);
  }

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(parseInt(e.target.value));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(parseInt(e.target.value));
  };

  const formatDate = (day: number): string => {
    return `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const isCompleted = (habitId: string, date: string): boolean => {
    return completions[date]?.has(habitId) ?? false;
  };

  const isToday = (day: number | null): boolean => {
    if (day === null) return false;
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  // Group days into weeks
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="calendar">
      <div className="calendar-header-controls">
        <select
          value={currentMonth}
          onChange={handleMonthChange}
          className="month-select"
          aria-label="Select month"
        >
          {monthNames.map((month, index) => (
            <option key={month} value={index}>
              {month}
            </option>
          ))}
        </select>
        <select
          value={currentYear}
          onChange={handleYearChange}
          className="year-select"
          aria-label="Select year"
        >
          {yearOptions.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      {habits.length === 0 ? (
        <p className="no-habits-message">Add habits above to start tracking!</p>
      ) : (
        <div className="calendar-container">
          <div className="calendar-header">
            {dayNames.map((day) => (
              <div key={day} className="day-header">{day}</div>
            ))}
          </div>
          <div className="calendar-grid">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="calendar-week">
                {week.map((day, dayIndex) => {
                  if (day === null) {
                    return <div key={dayIndex} className="day-cell empty"></div>;
                  }
                  const date = formatDate(day);
                  const todayClass = isToday(day) ? 'today' : '';
                  return (
                    <div
                      key={dayIndex}
                      className={`day-cell ${todayClass}`}
                    >
                      <div className="day-number">{day}</div>
                      <div className="day-habits">
                        {habits.map((habit) => {
                          const completed = isCompleted(habit.id, date);
                          return (
                            <label
                              key={habit.id}
                              className="habit-checkbox-label"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                checked={completed}
                                onChange={() => onToggleCompletion(habit.id, date)}
                                className="habit-checkbox"
                              />
                              {habit.icon && <span className="habit-icon">{habit.icon}</span>}
                              <span className="habit-name">{habit.name}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

