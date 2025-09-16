import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { formatCurrency } from '../../../utils/currency';

const MonthlySpendingChart = ({ data }) => {

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-elevated">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-sm text-primary">
            Spending: {formatCurrency(payload?.[0]?.value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-soft border border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Monthly Spending</h2>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <span>Spending</span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis 
              dataKey="period" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }}
              tickFormatter={formatCurrency}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="spending" 
              name="Spending"
              fill="var(--color-primary)" 
              radius={[4, 4, 0, 0]}
              maxBarSize={60}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlySpendingChart;
