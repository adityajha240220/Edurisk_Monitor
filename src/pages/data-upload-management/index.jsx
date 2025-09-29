// pages/data-upload-management/index.jsx
import React, { useState, useEffect } from "react";
import Header from "../../components/ui/Header";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import FileUploadZone from "./components/FileUploadZone";
import DataPreviewTable from "./components/DataPreviewTable";
import CMSIntegrationPanel from "./components/CMSIntegrationPanel";
import UploadHistoryPanel from "./components/UploadHistoryPanel";
import ValidationRulesPanel from "./components/ValidationRulesPanel";

// Services
import {
  getUploadHistory,
  uploadFile,
  rollbackUpload,
  downloadUpload,
} from "../../services/uploadService";
import { getCMSSettings, triggerCMSSync } from "../../services/cmsService";
import { getValidationRules, updateValidationRule } from "../../services/validationService";

const DataUploadManagement = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewData, setPreviewData] = useState([]);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [columnMappings, setColumnMappings] = useState({});
  const [validationRules, setValidationRules] = useState([]);
  const [cmsSettings, setCmsSettings] = useState([]);

  // Mock user data (replace with auth context if available)
  const currentUser = { name: "Admin User", role: "admin", isAuthenticated: true };

  const tabItems = [
    { id: "upload", label: "File Upload", icon: "Upload", description: "Upload and process data files" },
    { id: "cms-integration", label: "CMS Integration", icon: "Link", description: "Manage automated data sync" },
    { id: "validation", label: "Validation Rules", icon: "Shield", description: "Configure data validation" },
    { id: "history", label: "Upload History", icon: "History", description: "View past uploads and rollbacks" },
  ];

  // Load initial data
  useEffect(() => {
    fetchUploadHistory();
    fetchCMSSettings();
    fetchValidationRules();
  }, []);

  const fetchUploadHistory = async () => {
    const history = await getUploadHistory();
    setUploadHistory(history);
    setPreviewData(history); // optionally show latest uploads in preview
  };

  const fetchCMSSettings = async () => {
    const cms = await getCMSSettings();
    setCmsSettings(cms);
  };

  const fetchValidationRules = async () => {
    const rules = await getValidationRules();
    setValidationRules(rules);
  };

  // File selection
  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setUploadProgress(0);
  };

  // Column mapping
  const handleColumnMapping = (mappings) => {
    setColumnMappings(mappings);
  };

  // Import/upload file
  const handleImportData = async () => {
    if (!selectedFile) return;
    setIsUploading(true);

    try {
      await uploadFile(selectedFile);
      setIsUploading(false);
      setSelectedFile(null);
      await fetchUploadHistory();
      alert("Data imported successfully!");
      setActiveTab("history");
    } catch (err) {
      console.error(err);
      setIsUploading(false);
      alert("Upload failed. Check console for details.");
    }
  };

  // CMS Sync
  const handleCMSSync = async (systemId) => {
    try {
      await triggerCMSSync(systemId);
      alert("CMS Sync triggered successfully!");
    } catch (err) {
      console.error(err);
      alert("CMS Sync failed.");
    }
  };

  // Rollback upload
  const handleRollback = async (uploadId) => {
    try {
      await rollbackUpload(uploadId);
      await fetchUploadHistory();
      alert("Upload rolled back successfully!");
    } catch (err) {
      console.error(err);
      alert("Rollback failed.");
    }
  };

  // Download upload
  const handleDownload = async (uploadId) => {
    try {
      const file = await downloadUpload(uploadId);
      const url = window.URL.createObjectURL(new Blob([file]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `upload_${uploadId}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
      alert("Download failed.");
    }
  };

  // Update validation rules
  const handleValidationRulesUpdate = async (rules) => {
    try {
      await updateValidationRule("default", rules);
      await fetchValidationRules();
      alert("Validation rules updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update validation rules.");
    }
  };

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "upload":
        return (
          <div className="space-y-6">
            <FileUploadZone onFileSelect={handleFileSelect} isUploading={isUploading} uploadProgress={uploadProgress} />
            {(selectedFile || previewData.length > 0) && (
              <DataPreviewTable data={previewData} onColumnMapping={handleColumnMapping} />
            )}
            {selectedFile && !isUploading && (
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon name="AlertTriangle" size={20} className="text-warning" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Ready to Import</p>
                    <p className="text-xs text-muted-foreground">Review the data preview and column mappings before proceeding</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Button variant="outline" onClick={() => setSelectedFile(null)}>Cancel</Button>
                  <Button variant="default" onClick={handleImportData} iconName="Database" iconPosition="left">Import Data</Button>
                </div>
              </div>
            )}
          </div>
        );

      case "cms-integration":
        return <CMSIntegrationPanel onSyncTrigger={handleCMSSync} onSettingsUpdate={setCmsSettings} settings={cmsSettings} />;

      case "validation":
        return <ValidationRulesPanel rules={validationRules} onRulesUpdate={handleValidationRulesUpdate} />;

      case "history":
        return <UploadHistoryPanel history={uploadHistory} onRollback={handleRollback} onDownload={handleDownload} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header userRole={currentUser.role} userName={currentUser.name} isAuthenticated={currentUser.isAuthenticated} />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Database" size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Data Upload Management</h1>
                <p className="text-muted-foreground">Import, validate, and manage student data from various sources</p>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8">
            <div className="border-b border-border">
              <nav className="flex space-x-8">
                {tabItems.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                    }`}
                  >
                    <Icon name={tab.icon} size={18} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">{tabItems.find((tab) => tab.id === activeTab)?.description}</p>
            </div>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">{renderTabContent()}</div>
        </div>
      </main>
    </div>
  );
};

export default DataUploadManagement;
