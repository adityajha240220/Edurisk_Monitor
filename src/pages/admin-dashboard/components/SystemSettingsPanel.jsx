import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const SystemSettingsPanel = () => {
  const [settings, setSettings] = useState({
    alertThresholds: {
      yellowRisk: 60,
      orangeRisk: 40
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: true,
      whatsappEnabled: false
    },
    dataSync: {
      autoSync: true,
      syncInterval: 24,
      retryAttempts: 3
    },
    security: {
      sessionTimeout: 30,
      passwordExpiry: 90,
      twoFactorAuth: false
    }
  });

  const syncIntervalOptions = [
    { value: 1, label: 'Every Hour' },
    { value: 6, label: 'Every 6 Hours' },
    { value: 12, label: 'Every 12 Hours' },
    { value: 24, label: 'Daily' },
    { value: 168, label: 'Weekly' }
  ];

  const sessionTimeoutOptions = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 120, label: '2 hours' },
    { value: 480, label: '8 hours' }
  ];

  const passwordExpiryOptions = [
    { value: 30, label: '30 days' },
    { value: 60, label: '60 days' },
    { value: 90, label: '90 days' },
    { value: 180, label: '180 days' },
    { value: 365, label: '1 year' }
  ];

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev?.[category],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    console.log('Saving settings:', settings);
    // Implement save logic
  };

  const handleResetSettings = () => {
    // Reset to default values
    setSettings({
      alertThresholds: {
        yellowRisk: 60,
        orangeRisk: 40
      },
      notifications: {
        emailEnabled: true,
        smsEnabled: true,
        whatsappEnabled: false
      },
      dataSync: {
        autoSync: true,
        syncInterval: 24,
        retryAttempts: 3
      },
      security: {
        sessionTimeout: 30,
        passwordExpiry: 90,
        twoFactorAuth: false
      }
    });
  };

  const exportSystemReport = () => {
    console.log('Exporting system report...');
    // Implement export logic
  };

  return (
    <div className="space-y-6">
      {/* Alert Thresholds */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="AlertTriangle" size={24} className="text-warning" />
          <h3 className="text-lg font-semibold text-foreground">Risk Alert Thresholds</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Yellow Risk Threshold (%)"
            type="number"
            value={settings?.alertThresholds?.yellowRisk}
            onChange={(e) => handleSettingChange('alertThresholds', 'yellowRisk', parseInt(e?.target?.value))}
            description="Attendance percentage below which yellow alerts are triggered"
            min="0"
            max="100"
          />
          <Input
            label="Orange Risk Threshold (%)"
            type="number"
            value={settings?.alertThresholds?.orangeRisk}
            onChange={(e) => handleSettingChange('alertThresholds', 'orangeRisk', parseInt(e?.target?.value))}
            description="Attendance percentage below which orange alerts are triggered"
            min="0"
            max="100"
          />
        </div>
      </div>
      {/* Notification Settings */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Bell" size={24} className="text-accent" />
          <h3 className="text-lg font-semibold text-foreground">Notification Channels</h3>
        </div>
        
        <div className="space-y-4">
          <Checkbox
            label="Email Notifications"
            description="Send alerts via email to guardians and officials"
            checked={settings?.notifications?.emailEnabled}
            onChange={(e) => handleSettingChange('notifications', 'emailEnabled', e?.target?.checked)}
          />
          <Checkbox
            label="SMS Notifications"
            description="Send SMS alerts for urgent notifications"
            checked={settings?.notifications?.smsEnabled}
            onChange={(e) => handleSettingChange('notifications', 'smsEnabled', e?.target?.checked)}
          />
          <Checkbox
            label="WhatsApp Notifications"
            description="Send WhatsApp messages for better engagement"
            checked={settings?.notifications?.whatsappEnabled}
            onChange={(e) => handleSettingChange('notifications', 'whatsappEnabled', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Data Synchronization */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="RefreshCw" size={24} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Data Synchronization</h3>
        </div>
        
        <div className="space-y-4">
          <Checkbox
            label="Automatic Data Sync"
            description="Enable automatic synchronization with CMS systems"
            checked={settings?.dataSync?.autoSync}
            onChange={(e) => handleSettingChange('dataSync', 'autoSync', e?.target?.checked)}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Sync Interval"
              options={syncIntervalOptions}
              value={settings?.dataSync?.syncInterval}
              onChange={(value) => handleSettingChange('dataSync', 'syncInterval', value)}
              description="How often to sync data automatically"
            />
            <Input
              label="Retry Attempts"
              type="number"
              value={settings?.dataSync?.retryAttempts}
              onChange={(e) => handleSettingChange('dataSync', 'retryAttempts', parseInt(e?.target?.value))}
              description="Number of retry attempts for failed syncs"
              min="1"
              max="10"
            />
          </div>
        </div>
      </div>
      {/* Security Settings */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Shield" size={24} className="text-success" />
          <h3 className="text-lg font-semibold text-foreground">Security Configuration</h3>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Session Timeout"
              options={sessionTimeoutOptions}
              value={settings?.security?.sessionTimeout}
              onChange={(value) => handleSettingChange('security', 'sessionTimeout', value)}
              description="Automatic logout after inactivity"
            />
            <Select
              label="Password Expiry"
              options={passwordExpiryOptions}
              value={settings?.security?.passwordExpiry}
              onChange={(value) => handleSettingChange('security', 'passwordExpiry', value)}
              description="Force password change after this period"
            />
          </div>
          
          <Checkbox
            label="Two-Factor Authentication"
            description="Require 2FA for all admin and ministry users"
            checked={settings?.security?.twoFactorAuth}
            onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e?.target?.checked)}
          />
        </div>
      </div>
      {/* System Reports */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="FileText" size={24} className="text-secondary" />
          <h3 className="text-lg font-semibold text-foreground">System Reports</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            onClick={exportSystemReport}
            iconName="Download"
            iconPosition="left"
            fullWidth
          >
            Export System Report
          </Button>
          <Button
            variant="outline"
            onClick={() => console.log('Generating audit log...')}
            iconName="FileSearch"
            iconPosition="left"
            fullWidth
          >
            Generate Audit Log
          </Button>
          <Button
            variant="outline"
            onClick={() => console.log('Exporting user activity...')}
            iconName="Activity"
            iconPosition="left"
            fullWidth
          >
            User Activity Report
          </Button>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-border">
        <Button
          variant="outline"
          onClick={handleResetSettings}
          iconName="RotateCcw"
          iconPosition="left"
        >
          Reset to Defaults
        </Button>
        
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => console.log('Testing configuration...')}
            iconName="TestTube"
            iconPosition="left"
          >
            Test Configuration
          </Button>
          <Button
            variant="default"
            onClick={handleSaveSettings}
            iconName="Save"
            iconPosition="left"
          >
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsPanel;