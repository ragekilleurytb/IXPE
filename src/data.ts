import { Task, EpicQuest } from './types';

export const INITIAL_TASKS: Task[] = [
  // Vitality
  { id: 'v1', name: 'Drink 3L water', category: 'Vitality', frequency: 'Daily', xp: 10, completedDates: [] },
  { id: 'v2', name: 'Sleep 7h', category: 'Vitality', frequency: 'Daily', xp: 25, completedDates: [] },
  { id: 'v3', name: 'Eat fruits/veggies', category: 'Vitality', frequency: 'Daily', xp: 10, completedDates: [] },
  { id: 'v4', name: 'Cook a meal', category: 'Vitality', frequency: 'Daily', xp: 25, completedDates: [] },
  { id: 'v5', name: 'Stretch 10min', category: 'Vitality', frequency: 'Daily', xp: 25, completedDates: [] },
  { id: 'v6', name: "No screens at night", category: 'Vitality', frequency: 'Daily', xp: 25, completedDates: [] },
  // Charisma
  { id: 'c1', name: 'Brush teeth', category: 'Charisma', frequency: 'Daily', xp: 10, completedDates: [] },
  { id: 'c2', name: 'Scrape tongue', category: 'Charisma', frequency: 'Daily', xp: 10, completedDates: [] },
  { id: 'c3', name: 'Floss', category: 'Charisma', frequency: 'Weekly', xp: 30, completedDates: [], targetCount: 3 },
  { id: 'c4', name: 'Wash hair', category: 'Charisma', frequency: 'Weekly', xp: 20, completedDates: [], targetCount: 2 },
  { id: 'c5', name: 'Shave', category: 'Charisma', frequency: 'Weekly', xp: 30, completedDates: [], targetCount: 3 },
  { id: 'c6', name: 'Trim beard', category: 'Charisma', frequency: 'Weekly', xp: 10, completedDates: [] },
  { id: 'c7', name: 'Haircut', category: 'Charisma', frequency: 'Monthly', xp: 25, completedDates: [] },
  { id: 'c8', name: 'Wash bike/car', category: 'Charisma', frequency: 'Monthly', xp: 25, completedDates: [] },
  // Strength
  { id: 'f1', name: '100 pushups', category: 'Strength', frequency: 'Daily', xp: 50, completedDates: [] },
  { id: 'f2', name: '100 squats', category: 'Strength', frequency: 'Daily', xp: 50, completedDates: [] },
  { id: 'f3', name: 'Plank 5min', category: 'Strength', frequency: 'Daily', xp: 25, completedDates: [] },
  { id: 'f4', name: '20 pullups', category: 'Strength', frequency: 'Daily', xp: 50, completedDates: [] },
  { id: 'f5', name: 'Run 5km', category: 'Strength', frequency: 'Daily', xp: 100, completedDates: [] },
  { id: 'f6', name: 'Gym', category: 'Strength', frequency: 'Weekly', xp: 100, completedDates: [], targetCount: 2 },
  { id: 'f7', name: 'Dance class', category: 'Strength', frequency: 'Weekly', xp: 50, completedDates: [] },
  { id: 'f8', name: 'Run 20km', category: 'Strength', frequency: 'Monthly', xp: 100, completedDates: [] },
  { id: 'f9', name: 'Hike', category: 'Strength', frequency: 'Monthly', xp: 100, completedDates: [] },
  // Wisdom
  { id: 's1', name: 'Guitar 20min', category: 'Wisdom', frequency: 'Daily', xp: 25, completedDates: [] },
  { id: 's2', name: 'Read 10min', category: 'Wisdom', frequency: 'Daily', xp: 10, completedDates: [] },
  { id: 's3', name: 'Study 10min', category: 'Wisdom', frequency: 'Daily', xp: 10, completedDates: [] },
  { id: 's4', name: 'Languages 20min', category: 'Wisdom', frequency: 'Daily', xp: 25, completedDates: [] },
  { id: 's5', name: 'Meditate', category: 'Wisdom', frequency: 'Daily', xp: 10, completedDates: [] },
  { id: 's6', name: 'Documentary/Podcast', category: 'Wisdom', frequency: 'Weekly', xp: 25, completedDates: [] },
  // Social
  { id: 'so1', name: 'Call someone 30min', category: 'Social', frequency: 'Daily', xp: 25, completedDates: [] },
  { id: 'so2', name: 'Talk to 3 strangers', category: 'Social', frequency: 'Daily', xp: 50, completedDates: [] },
  { id: 'so3', name: 'Reconnect with friend', category: 'Social', frequency: 'Weekly', xp: 25, completedDates: [] },
  { id: 'so4', name: 'Birthdays', category: 'Social', frequency: 'Daily', xp: 10, completedDates: [] },
  // Camp
  { id: 'ca1', name: 'Make bed', category: 'Camp', frequency: 'Daily', xp: 10, completedDates: [] },
  { id: 'ca2', name: 'Quick tidy', category: 'Camp', frequency: 'Daily', xp: 10, completedDates: [] },
  { id: 'ca3', name: 'Budgeting', category: 'Camp', frequency: 'Weekly', xp: 25, completedDates: [] },
  { id: 'ca4', name: 'Groceries', category: 'Camp', frequency: 'Weekly', xp: 25, completedDates: [] },
  { id: 'ca5', name: 'Inbox zero', category: 'Camp', frequency: 'Monthly', xp: 25, completedDates: [] },
];

export const RANDOM_QUESTS: EpicQuest[] = [
  { id: 'rq1', name: 'Smile at 5 people', xp: 25 },
  { id: 'rq2', name: 'Take an unknown path', xp: 50 },
  { id: 'rq3', name: 'Cold shower', xp: 50 },
  { id: 'rq4', name: 'Make a truck honk', xp: 100 },
  { id: 'rq5', name: 'Airplane mode 4h', xp: 100 },
];
