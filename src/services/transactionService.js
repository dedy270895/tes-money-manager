import { supabase } from '../lib/supabase';
import { handleSupabaseRequest } from './apiHelper';
import { accountService } from './accountService';

const formatCurrency = (amount, locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
  }).format(amount);
};

const transactionSelectQuery = `
  id,
  description,
  amount,
  transaction_date,
  transaction_type,
  status,
  created_at,
  notes,
  from_account:accounts!account_id(id, name, account_type, icon),
  to_account:accounts!to_account_id(id, name, account_type, icon),
  category:categories!category_id(id, name, color, icon),
  receipt_urls
`;

export const transactionService = {
  async getTransactions(userId, { limit = 10, page = 1 } = {}) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const request = supabase
      .from('transactions')
      .select(transactionSelectQuery)
      .eq('user_id', userId)
      .order('transaction_date', { ascending: false })
      .range(from, to);

    return handleSupabaseRequest(request, 'Failed to load transactions');
  },

  async getTransactionById(transactionId) {
    const request = supabase
      .from('transactions')
      .select(transactionSelectQuery)
      .eq('id', transactionId)
      .single();
    return handleSupabaseRequest(request, 'Failed to load transaction details');
  },

  async createTransaction(transactionData) {
    const request = supabase
      .from('transactions')
      .insert(transactionData)
      .select(transactionSelectQuery)
      .single();
    
    const result = await handleSupabaseRequest(request, 'Failed to create transaction');

    if (result.success && result.data) {
      const { amount, transaction_type, account_id, from_account_id, to_account_id } = transactionData;
      const parsedAmount = parseFloat(amount);

      if (transaction_type === 'income') {
        const targetAccountId = to_account_id;
        if (targetAccountId) {
          const { data: currentAccount, success: accountSuccess } = await accountService.getAccountById(targetAccountId);
          if (accountSuccess) {
            const newBalance = parseFloat(currentAccount.balance) + parsedAmount;
            await accountService.updateAccount(targetAccountId, { balance: newBalance });
          }
        }
      } else if (transaction_type === 'expense') {
        const targetAccountId = account_id;
        if (targetAccountId) {
          const { data: currentAccount, success: accountSuccess } = await accountService.getAccountById(targetAccountId);
          if (accountSuccess) {
            const newBalance = parseFloat(currentAccount.balance) - parsedAmount;
            await accountService.updateAccount(targetAccountId, { balance: newBalance });
          }
        }
      } else if (transaction_type === 'transfer') {
        if (from_account_id) {
          const { data: fromAccount, success: fromAccountSuccess } = await accountService.getAccountById(from_account_id);
          if (fromAccountSuccess) {
            const newFromBalance = parseFloat(fromAccount.balance) - parsedAmount;
            await accountService.updateAccount(from_account_id, { balance: newFromBalance });
          }
        }
        if (to_account_id) {
          const { data: toAccount, success: toAccountSuccess } = await accountService.getAccountById(to_account_id);
          if (toAccountSuccess) {
            const newToBalance = parseFloat(toAccount.balance) + parsedAmount;
            await accountService.updateAccount(to_account_id, { balance: newToBalance });
          }
        }
      }
    }

    return result;
  },

  async updateTransaction(transactionId, updates) {
    const { data: oldTransaction, success: oldSuccess } = await transactionService.getTransactionById(transactionId);

    if (!oldSuccess || !oldTransaction) {
      return { success: false, error: 'Original transaction not found for update' };
    }

    const oldAmount = parseFloat(oldTransaction.amount);
    const oldType = oldTransaction.transaction_type;
    const oldAccountId = oldTransaction.account_id;
    const oldFromAccountId = oldTransaction.from_account_id;
    const oldToAccountId = oldTransaction.to_account_id;

    if (oldType === 'income') {
      const targetAccountId = oldToAccountId;
      if (targetAccountId) {
        const { data: currentAccount, success: accountSuccess } = await accountService.getAccountById(targetAccountId);
        if (accountSuccess) {
          const newBalance = parseFloat(currentAccount.balance) - oldAmount;
          await accountService.updateAccount(targetAccountId, { balance: newBalance });
        }
      }
    } else if (oldType === 'expense') {
      const targetAccountId = oldAccountId;
      if (targetAccountId) {
        const { data: currentAccount, success: accountSuccess } = await accountService.getAccountById(targetAccountId);
        if (accountSuccess) {
          const newBalance = parseFloat(currentAccount.balance) + oldAmount;
          await accountService.updateAccount(targetAccountId, { balance: newBalance });
        }
      }
    } else if (oldType === 'transfer') {
      if (oldFromAccountId) {
        const { data: fromAccount, success: fromAccountSuccess } = await accountService.getAccountById(oldFromAccountId);
        if (fromAccountSuccess) {
          const newFromBalance = parseFloat(fromAccount.balance) + oldAmount;
          await accountService.updateAccount(oldFromAccountId, { balance: newFromBalance });
        }
      }
      if (oldToAccountId) {
        const { data: toAccount, success: toAccountSuccess } = await accountService.getAccountById(oldToAccountId);
        if (toAccountSuccess) {
          const newToBalance = parseFloat(toAccount.balance) - oldAmount;
          await accountService.updateAccount(oldToAccountId, { balance: newToBalance });
        }
      }
    }

    const result = await handleSupabaseRequest(
      supabase.from('transactions').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', transactionId).select(transactionSelectQuery).single(),
      'Failed to update transaction'
    );

    if (result.success && result.data) {
      const { amount, transaction_type, account_id, from_account_id, to_account_id } = result.data;
      const parsedAmount = parseFloat(amount);

      if (transaction_type === 'income') {
        const targetAccountId = to_account_id;
        if (targetAccountId) {
          const { data: currentAccount, success: accountSuccess } = await accountService.getAccountById(targetAccountId);
          if (accountSuccess) {
            const newBalance = parseFloat(currentAccount.balance) + parsedAmount;
            await accountService.updateAccount(targetAccountId, { balance: newBalance });
          }
        }
      } else if (transaction_type === 'expense') {
        const targetAccountId = account_id;
        if (targetAccountId) {
          const { data: currentAccount, success: accountSuccess } = await accountService.getAccountById(targetAccountId);
          if (accountSuccess) {
            const newBalance = parseFloat(currentAccount.balance) - parsedAmount;
            await accountService.updateAccount(targetAccountId, { balance: newBalance });
          }
        }
      } else if (transaction_type === 'transfer') {
        if (from_account_id) {
          const { data: fromAccount, success: fromAccountSuccess } = await accountService.getAccountById(from_account_id);
          if (fromAccountSuccess) {
            const newFromBalance = parseFloat(fromAccount.balance) - parsedAmount;
            await accountService.updateAccount(from_account_id, { balance: newFromBalance });
          }
        }
        if (to_account_id) {
          const { data: toAccount, success: toAccountSuccess } = await accountService.getAccountById(to_account_id);
          if (toAccountSuccess) {
            const newToBalance = parseFloat(toAccount.balance) + parsedAmount;
            await accountService.updateAccount(to_account_id, { balance: newToBalance });
          }
        }
      }
    }

    return result;
  },

  async deleteTransaction(transactionId) {
    const { data: deletedTransaction, success: deleteSuccess } = await transactionService.getTransactionById(transactionId);

    if (!deleteSuccess || !deletedTransaction) {
      return { success: false, error: 'Transaction not found for deletion' };
    }

    const { amount, transaction_type, account_id, from_account_id, to_account_id } = deletedTransaction;
    const parsedAmount = parseFloat(amount);

    if (transaction_type === 'income') {
      const targetAccountId = to_account_id;
      if (targetAccountId) {
        const { data: currentAccount, success: accountSuccess } = await accountService.getAccountById(targetAccountId);
        if (accountSuccess) {
          const newBalance = parseFloat(currentAccount.balance) - parsedAmount;
          await accountService.updateAccount(targetAccountId, { balance: newBalance });
        }
      }
    } else if (transaction_type === 'expense') {
      const targetAccountId = account_id;
      if (targetAccountId) {
        const { data: currentAccount, success: accountSuccess } = await accountService.getAccountById(targetAccountId);
        if (accountSuccess) {
          const newBalance = parseFloat(currentAccount.balance) + parsedAmount;
          await accountService.updateAccount(targetAccountId, { balance: newBalance });
        }
      }
    } else if (transaction_type === 'transfer') {
      if (from_account_id) {
        const { data: fromAccount, success: fromAccountSuccess } = await accountService.getAccountById(from_account_id);
        if (fromAccountSuccess) {
          const newFromBalance = parseFloat(fromAccount.balance) + parsedAmount;
          await accountService.updateAccount(from_account_id, { balance: newFromBalance });
        }
      }
      if (to_account_id) {
        const { data: toAccount, success: toAccountSuccess } = await accountService.getAccountById(to_account_id);
        if (toAccountSuccess) {
          const newToBalance = parseFloat(toAccount.balance) - parsedAmount;
          await accountService.updateAccount(to_account_id, { balance: newToBalance });
        }
      }
    }

    const result = await handleSupabaseRequest(
      supabase.from('transactions').delete().eq('id', transactionId),
      'Failed to delete transaction'
    );

    return result;
  },

  async getTransactionStats(userId, startDate, endDate) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('amount, transaction_type')
        .eq('user_id', userId)
        .gte('transaction_date', startDate)
        .lte('transaction_date', endDate);

      if (error) {
        throw error;
      }

      let income = 0;
      let expenses = 0;
      let total_transactions = data.length;

      data.forEach(transaction => {
        if (transaction.transaction_type === 'income') {
          income += transaction.amount;
        } else if (transaction.transaction_type === 'expense') {
          expenses += Math.abs(transaction.amount);
        }
      });

      const savings = income - expenses;
      return { success: true, data: { income, expenses, savings, total_transactions } };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to fetch transaction stats' };
    }
  },

  async getMonthlySpending(userId, year) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('transaction_date, amount, transaction_type')
        .eq('user_id', userId)
        .gte('transaction_date', `${year}-01-01`)
        .lte('transaction_date', `${year}-12-31`);

      if (error) throw error;

      const monthlyData = Array.from({ length: 12 }, (_, i) => ({
        period: new Date(year, i, 1).toLocaleString('en-US', { month: 'short' }),
        income: 0,
        spending: 0,
        savings: 0,
        transactions: 0,
      }));

      data.forEach(transaction => {
        const monthIndex = new Date(transaction.transaction_date).getMonth();
        const amount = transaction.amount;
        monthlyData[monthIndex].transactions++;
        if (transaction.transaction_type === 'income') {
          monthlyData[monthIndex].income += amount;
        } else if (transaction.transaction_type === 'expense') {
          monthlyData[monthIndex].spending += Math.abs(amount);
        }
      });

      monthlyData.forEach(month => {
        month.savings = month.income - month.spending;
      });

      return { success: true, data: monthlyData };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to fetch monthly spending' };
    }
  },
  
  generateTrendsInsights(currentStats, previousStats, currentCategories, previousCategories) {
    const insights = [];
    if (!currentStats || !previousStats) return insights;

    if (previousStats.income > 0) {
        const absoluteChange = currentStats.income - previousStats.income;
        const percentageChange = (absoluteChange / previousStats.income) * 100;
        if (isFinite(percentageChange) && Math.abs(percentageChange) >= 1) {
            insights.push({
                type: absoluteChange > 0 ? 'positive' : 'warning',
                icon: 'TrendingUp',
                title: 'Income Growth',
                value: `${absoluteChange > 0 ? '+' : ''}${formatCurrency(absoluteChange)}`,
                description: `Your income changed by ${percentageChange.toFixed(0)}% compared to the last period.`
            });
        }
    }

    if (currentCategories && previousCategories) {
        const categoryChanges = [];
        currentCategories.forEach(currentCat => {
            const previousCat = previousCategories.find(pCat => pCat.name === currentCat.name);
            if (previousCat && previousCat.amount > 0) {
                const change = currentCat.amount - previousCat.amount;
                if (change > 0) {
                    const percentageChange = (change / previousCat.amount) * 100;
                    categoryChanges.push({ name: currentCat.name, change, percentageChange });
                }
            }
        });

        if (categoryChanges.length > 0) {
            const biggestSpike = categoryChanges.sort((a, b) => b.change - a.change)[0];
            if (biggestSpike && biggestSpike.change > 50 && biggestSpike.percentageChange > 10) {
                 insights.push({
                    type: 'warning',
                    icon: 'AlertTriangle',
                    title: 'Spending Spike',
                    value: `+${formatCurrency(biggestSpike.change)}`,
                    description: `Spending on ${biggestSpike.name} is ${biggestSpike.percentageChange.toFixed(0)}% higher than usual.`
                });
            }
        }
    }
    
    if (previousStats.total_transactions > 0) {
        const absoluteChange = currentStats.total_transactions - previousStats.total_transactions;
        const percentageChange = (absoluteChange / previousStats.total_transactions) * 100;
        if (isFinite(percentageChange) && Math.abs(percentageChange) > 5) {
            insights.push({
                type: 'neutral',
                icon: 'Activity',
                title: 'Transaction Volume',
                value: `${currentStats.total_transactions} transactions`,
                description: `You made ${Math.abs(percentageChange.toFixed(0))}% ${percentageChange > 0 ? 'more' : 'fewer'} transactions this period.`
            });
        }
    }
    
    return insights;
  },

  async getFinancialSummary(userId, period) {
    const now = new Date();
    let startDate, endDate = now;
    let prevStartDate, prevEndDate;

    switch (period) {
      case 'week':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        prevEndDate = new Date(startDate);
        prevStartDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        prevEndDate = new Date(startDate);
        prevStartDate = new Date(startDate.getFullYear(), startDate.getMonth() - 1, startDate.getDate());
        break;
      case 'quarter':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        prevEndDate = new Date(startDate);
        prevStartDate = new Date(startDate.getFullYear(), startDate.getMonth() - 3, startDate.getDate());
        break;
      case 'year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        prevEndDate = new Date(startDate);
        prevStartDate = new Date(startDate.getFullYear() - 1, startDate.getMonth(), startDate.getDate());
        break;
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        prevEndDate = new Date(startDate);
        prevStartDate = new Date(startDate.setMonth(startDate.getMonth()-1));
    }
    
    const isoStartDate = startDate.toISOString();
    const isoEndDate = endDate.toISOString();
    const isoPrevStartDate = prevStartDate.toISOString();
    const isoPrevEndDate = prevEndDate.toISOString();

    const [currentStatsRes, previousStatsRes, currentCategoriesRes, previousCategoriesRes, trends, budgetTracking] = await Promise.all([
        this.getTransactionStats(userId, isoStartDate, isoEndDate),
        this.getTransactionStats(userId, isoPrevStartDate, isoPrevEndDate),
        this.getCategoryAnalysis(userId, isoStartDate, isoEndDate),
        this.getCategoryAnalysis(userId, isoPrevStartDate, isoPrevEndDate),
        this.getMonthlySpending(userId, new Date().getFullYear()),
        this.getBudgetTracking(userId, isoStartDate, isoEndDate)
    ]);

    const insights = this.generateTrendsInsights(currentStatsRes.data, previousStatsRes.data, currentCategoriesRes.data, previousCategoriesRes.data);

    return {
      success: true,
      data: {
        overview: currentStatsRes.data,
        trends: trends.data,
        categoryAnalysis: currentCategoriesRes.data,
        budgetTracking: budgetTracking.data,
        insights: insights
      },
      error: null
    };
  },

  async getCategoryAnalysis(userId, startDate, endDate) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          amount,
          categories ( id, name, color )
        `)
        .eq('user_id', userId)
        .eq('transaction_type', 'expense')
        .gte('transaction_date', startDate)
        .lte('transaction_date', endDate);

      if (error) throw error;

      const categoryMap = new Map();
      let totalSpending = 0;

      data.forEach(transaction => {
        if (!transaction.categories) return;
        const categoryId = transaction.categories.id;
        const categoryName = transaction.categories.name;
        const categoryColor = transaction.categories.color;
        const amount = Math.abs(transaction.amount);

        totalSpending += amount;

        if (categoryMap.has(categoryId)) {
          const existing = categoryMap.get(categoryId);
          categoryMap.set(categoryId, {
            ...existing,
            amount: existing.amount + amount,
            transactions: existing.transactions + 1,
          });
        } else {
          categoryMap.set(categoryId, {
            name: categoryName,
            color: categoryColor,
            amount: amount,
            transactions: 1,
            budget: 0,
            percentage: 0,
          });
        }
      });

      const { data: budgets, error: budgetError } = await supabase
        .from('budgets')
        .select('category_id, amount')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (budgetError) throw budgetError;

      budgets.forEach(budget => {
        if (categoryMap.has(budget.category_id)) {
          const category = categoryMap.get(budget.category_id);
          category.budget = budget.amount;
          categoryMap.set(budget.category_id, category);
        }
      });

      const categoryAnalysis = Array.from(categoryMap.values()).map(category => ({
        ...category,
        percentage: totalSpending > 0 ? (category.amount / totalSpending) * 100 : 0,
      }));

      return { success: true, data: categoryAnalysis };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to fetch category analysis' };
    }
  },

  async getBudgetTracking(userId, startDate, endDate) {
    try {
      const { data: budgets, error: budgetError } = await supabase
        .from('budgets')
        .select('*, categories (*)')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (budgetError) throw budgetError;

      const start = new Date(startDate);
      const end = new Date(endDate);
      
      const daysPassed = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      const effectiveDaysPassed = Math.max(1, daysPassed);

      const budgetTracking = await Promise.all(budgets.map(async (budget) => {
        const { data, error } = await supabase
          .from('transactions')
          .select('amount')
          .eq('user_id', userId)
          .eq('category_id', budget.category_id)
          .eq('transaction_type', 'expense')
          .gte('transaction_date', startDate)
          .lte('transaction_date', endDate);

        if (error) throw error;

        const spent = data.reduce((acc, t) => acc + Math.abs(t.amount), 0);

        let dailyAverage = 0;
        let projectedSpend = spent;
        let totalDaysInPeriod = effectiveDaysPassed;

        if (budget.period === 'monthly') {
            totalDaysInPeriod = new Date(end.getFullYear(), end.getMonth() + 1, 0).getDate();
        } else if (budget.period === 'weekly') {
            totalDaysInPeriod = 7;
        } else if (budget.period === 'yearly') {
            const year = end.getFullYear();
            totalDaysInPeriod = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365;
        }
        
        dailyAverage = spent / effectiveDaysPassed;
        projectedSpend = dailyAverage * totalDaysInPeriod;

        const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;

        return {
          ...budget,
          spent,
          remaining: budget.amount - spent,
          percentage: percentage,
          dailyAverage: dailyAverage,
          projectedSpend: projectedSpend,
          category: budget.categories, 
        };
      }));

      return { success: true, data: budgetTracking };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to fetch budget tracking' };
    }
  }
};