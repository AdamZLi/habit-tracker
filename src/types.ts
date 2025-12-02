export interface Habit {
  id: string;
  name: string;
  icon?: string;
}

export interface HabitCompletion {
  habitId: string;
  date: string; // Format: YYYY-MM-DD
}

export type HabitCompletions = Record<string, Set<string>>; // date -> Set of habitIds

