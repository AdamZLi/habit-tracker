import { useState } from 'react';
import { Habit } from '../types';
import './HabitList.css';

interface HabitListProps {
  habits: Habit[];
  onAddHabit: (name: string, icon?: string) => void;
  onDeleteHabit: (id: string) => void;
}

const AVAILABLE_ICONS = [
  '💧', '☀️', '🏃', '💪', '📚', '🧘', '🍎', '💤',
  '📝', '🎯', '🎨', '🎵', '📖', '🚶', '🧠', '❤️',
  '🌱', '☕', '🍽️', '🚫', '✅', '⭐', '🔥', '🌙'
];

export function HabitList({ habits, onAddHabit, onDeleteHabit }: HabitListProps) {
  const [newHabitName, setNewHabitName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string>('');
  const [showIconPicker, setShowIconPicker] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabitName.trim()) {
      onAddHabit(newHabitName.trim(), selectedIcon || undefined);
      setNewHabitName('');
      setSelectedIcon('');
      setShowIconPicker(false);
    }
  };

  const handleIconSelect = (icon: string) => {
    setSelectedIcon(icon);
    setShowIconPicker(false);
  };

  return (
    <div className="habit-list">
      <h2>My Habits</h2>
      <form onSubmit={handleSubmit} className="habit-form">
        <div className="habit-input-group">
          <input
            type="text"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            placeholder="Add a new habit..."
            className="habit-input"
          />
          <button
            type="button"
            className="icon-picker-button"
            onClick={(e) => {
              e.preventDefault();
              setShowIconPicker(!showIconPicker);
            }}
            title="Select icon"
          >
            {selectedIcon || '🎯'}
          </button>
          {showIconPicker && (
            <div className="icon-picker">
              <div className="icon-picker-grid">
                {AVAILABLE_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    className={`icon-option ${selectedIcon === icon ? 'selected' : ''}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleIconSelect(icon);
                    }}
                    title="Select icon"
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <button type="submit" className="add-button">Add</button>
      </form>
      <ul className="habits">
        {habits.map((habit) => (
          <li key={habit.id} className="habit-item">
            {habit.icon && <span className="habit-item-icon">{habit.icon}</span>}
            <span>{habit.name}</span>
            <button
              onClick={() => onDeleteHabit(habit.id)}
              className="delete-button"
              aria-label={`Delete ${habit.name}`}
            >
              ×
            </button>
          </li>
        ))}
        {habits.length === 0 && (
          <li className="empty-message">No habits yet. Add one to get started!</li>
        )}
      </ul>
    </div>
  );
}

