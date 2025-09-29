import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const certifications = [
    {
      id: 1,
      name: 'Ministry of Education',
      description: 'Government Approved',
      icon: 'Shield'
    },
    {
      id: 2,
      name: 'ISO 27001',
      description: 'Data Security Certified',
      icon: 'Lock'
    },
    {
      id: 3,
      name: 'AICTE Recognized',
      description: 'Technical Education Board',
      icon: 'Award'
    },
    {
      id: 4,
      name: 'GDPR Compliant',
      description: 'Privacy Protected',
      icon: 'UserCheck'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-4">
        {certifications?.map((cert) => (
          <div
            key={cert?.id}
            className="flex items-center space-x-3 p-3 bg-card border border-border rounded-lg hover-lift"
          >
            <div className="flex items-center justify-center w-8 h-8 bg-success/10 rounded-full">
              <Icon name={cert?.icon} size={16} className="text-success" />
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">{cert?.name}</p>
              <p className="text-xs text-muted-foreground">{cert?.description}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Security Features */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center">
          <Icon name="Shield" size={16} className="mr-2 text-primary" />
          Security Features
        </h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Icon name="Check" size={14} className="text-success" />
            <span className="text-xs text-muted-foreground">256-bit SSL Encryption</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Check" size={14} className="text-success" />
            <span className="text-xs text-muted-foreground">Multi-factor Authentication</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Check" size={14} className="text-success" />
            <span className="text-xs text-muted-foreground">Regular Security Audits</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Check" size={14} className="text-success" />
            <span className="text-xs text-muted-foreground">GDPR Compliant Data Handling</span>
          </div>
        </div>
      </div>
      {/* Support Information */}
      <div className="text-center space-y-2">
        <p className="text-xs text-muted-foreground">
          Need help? Contact our support team
        </p>
        <div className="flex items-center justify-center space-x-4 text-xs">
          <a
            href="mailto:support@edurisk.edu"
            className="flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors"
          >
            <Icon name="Mail" size={12} />
            <span>support@edurisk.edu</span>
          </a>
          <a
            href="tel:+911800123456"
            className="flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors"
          >
            <Icon name="Phone" size={12} />
            <span>1800-123-456</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;