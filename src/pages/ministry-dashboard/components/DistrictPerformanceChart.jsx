import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DistrictPerformanceChart = () => {
  const districtData = [
    { district: 'Jaipur', totalStudents: 45000, highRisk: 2250, interventions: 1890 },
    { district: 'Kota', totalStudents: 38000, highRisk: 1520, interventions: 1368 },
    { district: 'Jodhpur', totalStudents: 32000, highRisk: 1920, interventions: 1536 },
    { district: 'Udaipur', totalStudents: 28000, highRisk: 1400, interventions: 1120 },
    { district: 'Amer', totalStudents: 25000, highRisk: 1750, interventions: 1400 },
    { district: 'Ajmer', totalStudents: 22000, highRisk: 1320, interventions: 1056 },
    { district: 'Bikaner', totalStudents: 20000, highRisk: 1000, interventions: 850 },
    { district: 'Bharatpur', totalStudents: 18000, highRisk: 900, interventions: 720 }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">District Performance Comparison</h3>
        <p className="text-sm text-muted-foreground">High-risk students and intervention rates by district</p>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={districtData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis 
              dataKey="district" 
              stroke="#64748B"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
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
            <Bar 
              dataKey="highRisk" 
              fill="#DC2626" 
              name="High Risk Students"
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="interventions" 
              fill="#059669" 
              name="Successful Interventions"
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DistrictPerformanceChart;