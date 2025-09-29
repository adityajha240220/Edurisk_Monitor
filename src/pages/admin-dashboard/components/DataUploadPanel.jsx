import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

import Select from '../../../components/ui/Select';

const DataUploadPanel = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [cmsStatus, setCmsStatus] = useState('connected');
  const [selectedInstitution, setSelectedInstitution] = useState('');

  const institutionOptions = [
    { value: 'all', label: 'All Institutions' },
    { value: 'college-1', label: 'Government Engineering College' },
    { value: 'college-2', label: 'State Medical College' },
    { value: 'school-1', label: 'Central High School' },
    { value: 'school-2', label: 'Municipal Primary School' }
  ];

  const mockPreviewData = [
    { id: 'STU001', name: 'Aditya Aman', attendance: '85%', score: '78', fees: 'Paid' },
    { id: 'STU002', name: 'Ayush Srivastava', attendance: '92%', score: '85', fees: 'Pending' },
    { id: 'STU003', name: 'Sahil Verma', attendance: '67%', score: '65', fees: 'Paid' },
    { id: 'STU004', name: 'Maahi Ujjain', attendance: '89%', score: '82', fees: 'Overdue' }
  ];

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === 'dragenter' || e?.type === 'dragover') {
      setDragActive(true);
    } else if (e?.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    
    const files = e?.dataTransfer?.files;
    if (files && files?.[0]) {
      handleFileUpload(files?.[0]);
    }
  };

  const handleFileUpload = (file) => {
    setUploadedFile(file);
    // Simulate file processing
    setTimeout(() => {
      setPreviewData(mockPreviewData);
    }, 1000);
  };

  const handleFileInputChange = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleSaveData = () => {
    // Simulate saving data
    setPreviewData(null);
    setUploadedFile(null);
    // Show success message
  };

  const toggleCmsIntegration = () => {
    setCmsStatus(cmsStatus === 'connected' ? 'disconnected' : 'connected');
  };

  return (
    <div className="space-y-6">
      {/* CMS Integration Status */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">CMS Integration Status</h3>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
            cmsStatus === 'connected' ?'bg-success/10 text-success' :'bg-error/10 text-error'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              cmsStatus === 'connected' ? 'bg-success' : 'bg-error'
            }`} />
            <span className="capitalize">{cmsStatus}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <Icon name="Database" size={24} className="mx-auto mb-2 text-accent" />
            <p className="text-sm font-medium text-foreground">Last Sync</p>
            <p className="text-xs text-muted-foreground">2 hours ago</p>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <Icon name="Users" size={24} className="mx-auto mb-2 text-success" />
            <p className="text-sm font-medium text-foreground">Records Synced</p>
            <p className="text-xs text-muted-foreground">2,847 students</p>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <Icon name="AlertTriangle" size={24} className="mx-auto mb-2 text-warning" />
            <p className="text-sm font-medium text-foreground">Sync Errors</p>
            <p className="text-xs text-muted-foreground">3 failed records</p>
          </div>
        </div>

        <Button
          variant={cmsStatus === 'connected' ? 'destructive' : 'success'}
          onClick={toggleCmsIntegration}
          iconName={cmsStatus === 'connected' ? 'Unplug' : 'Plug'}
          iconPosition="left"
        >
          {cmsStatus === 'connected' ? 'Disconnect CMS' : 'Connect CMS'}
        </Button>
      </div>
      {/* Manual Data Upload */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Manual Data Upload</h3>
        
        <div className="mb-4">
          <Select
            label="Select Institution"
            options={institutionOptions}
            value={selectedInstitution}
            onChange={setSelectedInstitution}
            placeholder="Choose institution for data upload"
          />
        </div>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Icon name="Upload" size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h4 className="text-lg font-medium text-foreground mb-2">
            Drop your CSV/Excel file here
          </h4>
          <p className="text-muted-foreground mb-4">
            or click to browse and select a file
          </p>
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileInputChange}
            className="hidden"
            id="file-upload"
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById('file-upload')?.click()}
            iconName="FileText"
            iconPosition="left"
          >
            Browse Files
          </Button>
        </div>

        {uploadedFile && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="FileText" size={20} className="text-accent" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{uploadedFile?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(uploadedFile?.size / 1024)?.toFixed(1)} KB
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setUploadedFile(null);
                  setPreviewData(null);
                }}
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* Data Preview */}
      {previewData && (
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Data Preview</h3>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setPreviewData(null)}
                iconName="X"
                iconPosition="left"
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleSaveData}
                iconName="Save"
                iconPosition="left"
              >
                Save Data
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 text-sm font-medium text-foreground">Student ID</th>
                  <th className="text-left p-3 text-sm font-medium text-foreground">Name</th>
                  <th className="text-left p-3 text-sm font-medium text-foreground">Attendance</th>
                  <th className="text-left p-3 text-sm font-medium text-foreground">Score</th>
                  <th className="text-left p-3 text-sm font-medium text-foreground">Fee Status</th>
                </tr>
              </thead>
              <tbody>
                {previewData?.map((row, index) => (
                  <tr key={index} className="border-b border-border hover:bg-muted/50">
                    <td className="p-3 text-sm text-foreground">{row?.id}</td>
                    <td className="p-3 text-sm text-foreground">{row?.name}</td>
                    <td className="p-3 text-sm text-foreground">{row?.attendance}</td>
                    <td className="p-3 text-sm text-foreground">{row?.score}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        row?.fees === 'Paid' ?'bg-success/10 text-success' 
                          : row?.fees === 'Pending' ?'bg-warning/10 text-warning' :'bg-error/10 text-error'
                      }`}>
                        {row?.fees}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataUploadPanel;