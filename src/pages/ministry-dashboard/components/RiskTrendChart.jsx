import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RiskTrendChart = () => {
  const trendData = [
    { month: 'Jan', highRisk: 12, mediumRisk: 28, lowRisk: 60 },
    { month: 'Feb', highRisk: 15, mediumRisk: 32, lowRisk: 53 },
    { month: 'Mar', highRisk: 18, mediumRisk: 35, lowRisk: 47 },
    { month: 'Apr', highRisk: 14, mediumRisk: 30, lowRisk: 56 },
    { month: 'May', highRisk: 11, mediumRisk: 25, lowRisk: 64 },
    { month: 'Jun', highRisk: 9, mediumRisk: 22, lowRisk: 69 },
    { month: 'Jul', highRisk: 13, mediumRisk: 27, lowRisk: 60 },
    { month: 'Aug', highRisk: 16, mediumRisk: 31, lowRisk: 53 },
    { month: 'Sep', highRisk: 12, mediumRisk: 26, lowRisk: 62 }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">Student Risk Trends</h3>
        <p className="text-sm text-muted-foreground">Monthly risk level distribution across all institutions</p>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis 
              dataKey="month" 
              stroke="#64748B"
              fontSize={12}
            />
            <YAxis 
              stroke="#64748B"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="highRisk" 
              stroke="#DC2626" 
              strokeWidth={3}
              name="High Risk"
              dot={{ fill: '#DC2626', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="mediumRisk" 
              stroke="#D97706" 
              strokeWidth={3}
              name="Medium Risk"
              dot={{ fill: '#D97706', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="lowRisk" 
              stroke="#059669" 
              strokeWidth={3}
              name="Low Risk"
              dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RiskTrendChart;