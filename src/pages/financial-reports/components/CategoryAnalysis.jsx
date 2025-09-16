import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import { formatCurrency } from '../../../utils/currency';
import { getHexColor } from '../../../utils/colors';

const CategoryAnalysis = ({ selectedPeriod, data }) => {
  console.log({ data });
  const [selectedCategory, setSelectedCategory] = useState(null);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      const data = payload?.[0]?.payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-elevated">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-sm text-success">Percentage: {data?.percentage?.toFixed(1)}%</p>
          <p className="text-sm text-muted-foreground">Amount: {formatCurrency(data?.amount)}</p>
          <p className="text-sm text-muted-foreground">Budget: {formatCurrency(data?.budget)}</p>
          <p className="text-sm text-muted-foreground">{data?.transactions} transactions</p>
        </div>
      );
    }
    return null;
  };

  const maxAmount = Math.max(...(data || []).map(item => item.amount), 0);

  return (
    <div className="bg-card p-4 md:p-6 space-y-6">
      {/* Category Overview Chart */}
      <div className="bg-muted/30 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-foreground">Category Spending Percentage</h4>
          <button className="text-sm text-primary hover:text-primary/80 transition-colors">
            View All Categories
          </button>
        </div>
        
        <div className="h-64 md:h-80">
          <ResponsiveContainer width="100%" height="100%">
            {console.log("Rendering BarChart in CategoryAnalysis")}
            <BarChart data={data} layout="vertical" key={JSON.stringify(data)}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                type="number" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickFormatter={(value) => `${value.toFixed(0)}%`}
                domain={[0, 100]} // Domain for 0-100 percentage values
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                width={100}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="percentage" 
                radius={[0, 4, 4, 0]}
                minPointSize={2} // Ensure even small bars are visible
                stackId="a"
              >
                {data?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getHexColor(entry?.color)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Category Details List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-foreground">Category Breakdown</h4>
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Sort by Amount</span>
          </div>
        </div>

        <div className="space-y-3">
          {data?.map((category, index) => (
            <div key={index} className="bg-muted/30 rounded-lg p-4">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setSelectedCategory(selectedCategory === index ? null : index)}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: getHexColor(category?.color) }}
                  />
                  <div>
                    <h5 className="font-medium text-foreground">{category?.name}</h5>
                    <p className="text-sm text-muted-foreground">
                      {category?.transactions} transactions
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-foreground">{formatCurrency(category?.amount)}</p>
                  <p className="text-sm text-muted-foreground">{category?.percentage}% of total</p>
                </div>
                
                <Icon 
                  name={selectedCategory === index ? "ChevronUp" : "ChevronDown"} 
                  size={16} 
                  className="text-muted-foreground ml-2" 
                />
              </div>

              {/* Budget Progress Bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Budget Progress</span>
                  <span className="text-muted-foreground">
                    {formatCurrency(category?.amount)} / {formatCurrency(category?.budget)}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      category?.amount > category?.budget ? 'bg-error' : 'bg-success'
                    }`}
                    style={{ 
                      width: `${Math.min((category?.amount / category?.budget) * 100, 100)}%` 
                    }}
                  />
                </div>
                {category?.amount > category?.budget && (
                  <p className="text-xs text-error mt-1">
                    Over budget by {formatCurrency(category?.amount - category?.budget)}
                  </p>
                )}
              </div>

              {/* Subcategories Expansion */}
              {selectedCategory === index && (
                <div className="mt-4 pt-4 border-t border-border space-y-2">
                  <h6 className="text-sm font-medium text-foreground mb-2">Subcategories</h6>
                  {category?.subcategories?.map((sub, subIndex) => (
                    <div key={subIndex} className="flex items-center justify-between py-2">
                      <span className="text-sm text-muted-foreground">{sub?.name}</span>
                      <span className="text-sm font-medium text-foreground">
                        {formatCurrency(sub?.amount)}
                      </span>
                    </div>
                  ))}
                  <button className="w-full mt-3 py-2 text-sm text-primary hover:text-primary/80 transition-colors border border-primary/20 rounded-lg hover:bg-primary/5">
                    View Transactions
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryAnalysis;