import { z } from 'zod';

// Common schemas
export const currencySchema = z.enum(['GHS', 'USD', 'EUR']);

export const transactionTypeSchema = z.enum(['income', 'expense']);

// User schemas
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Transaction schemas
export const transactionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: transactionTypeSchema,
  amount: z.number().positive('Amount must be positive'),
  currency: currencySchema,
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  date: z.date(),
  createdAt: z.date(),
});

export const createTransactionSchema = z.object({
  type: transactionTypeSchema,
  amount: z.number().positive('Amount must be positive'),
  currency: currencySchema.optional().default('GHS'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  date: z.date().optional().default(() => new Date()),
});

// Savings schemas
export const savingsGoalSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string().min(1, 'Title is required'),
  targetAmount: z.number().positive('Target amount must be positive').optional(),
  currency: currencySchema,
  startDate: z.date(),
  endDate: z.date(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
}).refine(data => data.endDate > data.startDate, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export const createSavingsGoalSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  targetAmount: z.number().positive('Target amount must be positive').optional(),
  currency: currencySchema,
  startDate: z.date(),
  endDate: z.date(),
  isActive: z.boolean(),
}).refine(data => data.endDate > data.startDate, {
  message: 'End date must be after start date',
  path: ['endDate'],
});

export const savingsEntrySchema = z.object({
  id: z.string(),
  userId: z.string(),
  goalId: z.string().optional(),
  amount: z.number().positive('Amount must be positive'),
  currency: currencySchema,
  description: z.string().min(1, 'Description is required'),
  date: z.date(),
  createdAt: z.date(),
});

export const createSavingsEntrySchema = z.object({
  goalId: z.string().optional(),
  amount: z.number().positive('Amount must be positive'),
  currency: currencySchema.default('GHS'),
  description: z.string().min(1, 'Description is required'),
  date: z.date().default(() => new Date()),
});

// Group savings schemas
export const groupGoalSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  targetAmount: z.number().positive('Target amount must be positive'),
  currency: currencySchema,
  participants: z.array(z.string()).min(1, 'At least one participant is required'),
  createdBy: z.string(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createGroupGoalSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  targetAmount: z.number().positive('Target amount must be positive'),
  currency: currencySchema.default('GHS'),
  participants: z.array(z.string()).min(1, 'At least one participant is required'),
  createdBy: z.string(),
  isActive: z.boolean().default(true),
});

export const groupContributionSchema = z.object({
  id: z.string(),
  groupId: z.string(),
  amount: z.number().positive('Amount must be positive'),
  currency: currencySchema,
  participantName: z.string().min(1, 'Participant name is required'),
  participantId: z.string().optional(),
  date: z.date(),
  time: z.string(),
  description: z.string().optional(),
  createdAt: z.date(),
});

export const createGroupContributionSchema = z.object({
  groupId: z.string(),
  amount: z.number().positive('Amount must be positive'),
  currency: currencySchema.default('GHS'),
  participantName: z.string().min(1, 'Participant name is required'),
  participantId: z.string().optional(),
  date: z.date().default(() => new Date()),
  time: z.string().default(() => new Date().toLocaleTimeString()),
  description: z.string().optional(),
});

// Budget schemas
export const budgetCategorySchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().min(1, 'Category name is required'),
  budgetedAmount: z.number().positive('Budgeted amount must be positive'),
  spentAmount: z.number().min(0, 'Spent amount cannot be negative'),
  currency: currencySchema,
  month: z.number().min(1).max(12),
  year: z.number().min(2020).max(2100),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createBudgetCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  budgetedAmount: z.number().positive('Budgeted amount must be positive'),
  spentAmount: z.number().min(0, 'Spent amount cannot be negative').default(0),
  currency: currencySchema.default('GHS'),
  month: z.number().min(1).max(12).default(() => new Date().getMonth() + 1),
  year: z.number().min(2020).max(2100).default(() => new Date().getFullYear()),
});

// AI query schema
export const aiQuerySchema = z.object({
  query: z.string().min(10, 'Please provide more details about your financial situation'),
  userId: z.string(),
});

// Form validation helpers
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type CreateTransactionFormData = z.infer<typeof createTransactionSchema>;
export type CreateSavingsGoalFormData = z.infer<typeof createSavingsGoalSchema>;
export type CreateSavingsEntryFormData = z.infer<typeof createSavingsEntrySchema>;
export type CreateGroupGoalFormData = z.infer<typeof createGroupGoalSchema>;
export type CreateGroupContributionFormData = z.infer<typeof createGroupContributionSchema>;
export type CreateBudgetCategoryFormData = z.infer<typeof createBudgetCategorySchema>;
export type AIQueryFormData = z.infer<typeof aiQuerySchema>;