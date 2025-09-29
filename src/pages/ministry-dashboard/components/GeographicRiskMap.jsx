import React, { useState } from 'react';

import Button from '../../../components/ui/Button';

const GeographicRiskMap = () => {
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const districtRiskData = [
    { district: 'Jaipur', riskLevel: 'medium', riskScore: 4.2, students: 45000, highRisk: 2250 },
    { district: 'Kota', riskLevel: 'low', riskScore: 3.1, students: 38000, highRisk: 1520 },
    { district: 'Bikaner', riskLevel: 'high', riskScore: 6.8, students: 32000, highRisk: 1920 },
    { district: 'Jodhpur', riskLevel: 'medium', riskScore: 4.5, students: 28000, highRisk: 1400 },
    { district: 'Amer', riskLevel: 'high', riskScore: 7.2, students: 25000, highRisk: 1750 },
    { district: 'Udaipur', riskLevel: 'medium', riskScore: 4.8, students: 22000, highRisk: 1320 },
    { district: 'Ajmer', riskLevel: 'low', riskScore: 3.5, students: 20000, highRisk: 1000 },
    { district: 'Alwar', riskLevel: 'low', riskScore: 3.2, students: 18000, highRisk: 900 }
  ];

  const getRiskColor = (level) => {
    const colors = {
      low: 'bg-green-500',
      medium: 'bg-orange-500',
      high: 'bg-red-500'
    };
    return colors?.[level] || colors?.medium;
  };

  const getRiskTextColor = (level) => {
    const colors = {
      low: 'text-green-600',
      medium: 'text-orange-600',
      high: 'text-red-600'
    };
    return colors?.[level] || colors?.medium;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">Geographic Risk Distribution</h3>
        <p className="text-sm text-muted-foreground">Risk levels across Rajasthan districts</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map Visualization */}
        <div className="bg-muted/30 rounded-lg p-4 h-80 flex items-center justify-center">
          <iframe
            width="100%"
            height="100%"
            loading="lazy"
            title="Rajasthan Districts Risk Map"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=27.0238,74.2179&z=7&output=embed"
            className="rounded-lg"
          />
        </div>

        {/* District Risk List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-foreground">District Risk Levels</h4>
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Low Risk</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>Medium Risk</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>High Risk</span>
              </div>
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-2">
            {districtRiskData?.map((district) => (
              <div
                key={district?.district}
                className={`p-3 border border-border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                  selectedDistrict === district?.district ? 'bg-muted/50 border-primary' : ''
                }`}
                onClick={() => setSelectedDistrict(district?.district)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getRiskColor(district?.riskLevel)}`}></div>
                    <div>
                      <h5 className="font-medium text-foreground">{district?.district}</h5>
                      <p className="text-xs text-muted-foreground">
                        {district?.students?.toLocaleString()} students
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${getRiskTextColor(district?.riskLevel)}`}>
                      {district?.riskScore}/10
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {district?.highRisk} high-risk
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Selected District Details */}
      {selectedDistrict && (
        <div className="mt-6 p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-foreground">
              {selectedDistrict} District Details
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDistrict(null)}
              iconName="X"
            />
          </div>
          
          {(() => {
            const district = districtRiskData?.find(d => d?.district === selectedDistrict);
            return district ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-foreground">{district?.students?.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Total Students</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-error">{district?.highRisk}</div>
                  <div className="text-xs text-muted-foreground">High Risk</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${getRiskTextColor(district?.riskLevel)}`}>
                    {district?.riskScore}/10
                  </div>
                  <div className="text-xs text-muted-foreground">Risk Score</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${getRiskTextColor(district?.riskLevel)} capitalize`}>
                    {district?.riskLevel}
                  </div>
                  <div className="text-xs text-muted-foreground">Risk Level</div>
                </div>
              </div>
            ) : null;
          })()}
        </div>
      )}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Click on districts to view detailed information
        </p>
        <Button variant="outline" size="sm" iconName="Download" iconPosition="left">
          Export Map Data
        </Button>
      </div>
    </div>
  );
};

export default GeographicRiskMap;