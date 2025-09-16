import React, { useState, useMemo } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Icon from '../../../components/AppIcon';
import { formatCurrency } from '../../../utils/currency';

const TrendsAnalysis = ({ selectedPeriod, data }) => {
  const [selectedMetric, setSelectedMetric] = useState('spending');

  const { trends, categoryTrends, insights } = data || {};

  const metrics = [
    { id: 'spending', label: 'Total Spending', color: '#EF4444', icon: 'TrendingDown' },
    { id: 'income', label: 'Total Income', color: '#10B981', icon: 'TrendingUp' },
    { id: 'savings', label: 'Net Savings', color: '#3B82F6', icon: 'Wallet' },
    { id: 'transactions', label: 'Transaction Count', color: '#8B5CF6', icon: 'Activity' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-elevated">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: {entry?.name === 'transactions' ? entry?.value : formatCurrency(entry?.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card p-4 md:p-6 space-y-6">
      {/* Metric Selector */}
      <div className="bg-muted/30 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-foreground">Trend Analysis</h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
          {metrics?.map((metric) => (
            <button
              key={metric?.id}
              onClick={() => setSelectedMetric(metric?.id)}
              className={`flex items-center space-x-2 p-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedMetric === metric?.id
                  ? 'bg-primary text-primary-foreground shadow-soft'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <Icon name={metric?.icon} size={16} />
              <span className="hidden md:inline">{metric?.label}</span>
              <span className="md:hidden">{metric?.label?.split(' ')?.[0]}</span>
            </button>
          ))}
        </div>

        {/* Main Trend Chart */}
        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trends}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={metrics?.find(m => m?.id === selectedMetric)?.color} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={metrics?.find(m => m?.id === selectedMetric)?.color} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="period" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={formatCurrency}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey={selectedMetric}
                stroke={metrics?.find(m => m?.id === selectedMetric)?.color}
                fillOpacity={1}
                fill="url(#colorGradient)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Insights Cards */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-foreground">Key Insights</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights?.map((insight, index) => (
            <div key={index} className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  insight?.type === 'positive' ? 'bg-success/10' :
                  insight?.type === 'warning'? 'bg-warning/10' : 'bg-muted'
                }`}>
                  <Icon 
                    name={insight?.icon} 
                    size={16} 
                    className={
                      insight?.type === 'positive' ? 'text-success' :
                      insight?.type === 'warning'? 'text-warning' : 'text-muted-foreground'
                    }
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="font-medium text-foreground">{insight?.title}</h5>
                    <span className={`text-sm font-semibold ${
                      insight?.type === 'positive' ? 'text-success' :
                      insight?.type === 'warning'? 'text-warning' : 'text-foreground'
                    }`}>
                      {insight?.value}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{insight?.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Category Trends */}
      <div className="bg-muted/30 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-foreground">Category Trends</h4>
          <button className="text-sm text-primary hover:text-primary/80 transition-colors">
            View All Categories
          </button>
        </div>

        <div className="space-y-4">
          {categoryTrends?.map((category, index) => {
            const trend = category.amount - (category.budget || 0); // A simple trend calculation
            const trendPercentage = category.budget ? ((trend / category.budget) * 100).toFixed(1) : 0;

            return (
              <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-b-0">
                <div className="flex-1">
                  <h5 className="font-medium text-foreground">{category?.name}</h5>
                  <div className="flex items-center space-x-2 mt-1">
                    <Icon 
                      name={trend >= 0 ? "TrendingUp" : "TrendingDown"} 
                      size={14} 
                      className={trend >= 0 ? "text-error" : "text-success"}
                    />
                    <span className={`text-sm ${trend >= 0 ? "text-error" : "text-success"}`}>
                      {trend >= 0 ? '+' : ''}{trendPercentage}%
                    </span>
                    <span className="text-sm text-muted-foreground">vs budget</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">
                    {formatCurrency(category.amount)}
                  </p>
                  <p className="text-sm text-muted-foreground">Spent</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrendsAnalysis;
