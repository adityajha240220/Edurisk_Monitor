import React, { useState, useCallback } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FileUploadZone = ({ onFileSelect, isUploading, uploadProgress }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDragOver = useCallback((e) => {
    e?.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e?.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e?.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e?.dataTransfer?.files);
    const validFile = files?.find(file => 
      file?.type === 'text/csv' || 
      file?.type === 'application/vnd.ms-excel' ||
      file?.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    
    if (validFile) {
      setSelectedFile(validFile);
      onFileSelect(validFile);
    }
  }, [onFileSelect]);

  const handleFileSelect = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground mb-2">File Upload</h3>
        <p className="text-sm text-muted-foreground">
          Upload student data files in CSV or Excel format
        </p>
      </div>
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragOver 
            ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isUploading ? (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name="Upload" size={32} className="text-primary animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Uploading file...</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{uploadProgress}% complete</p>
            </div>
          </div>
        ) : selectedFile ? (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-success/10 rounded-full flex items-center justify-center">
              <Icon name="FileText" size={32} className="text-success" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{selectedFile?.name}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile?.size)}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedFile(null);
                onFileSelect(null);
              }}
              iconName="X"
              iconPosition="left"
            >
              Remove File
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Icon name="Upload" size={32} className="text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">
                Drag and drop your file here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports CSV, XLS, XLSX files up to 10MB
              </p>
            </div>
            <input
              type="file"
              accept=".csv,.xls,.xlsx"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        )}
      </div>
      <div className="mt-4 p-4 bg-muted/50 rounded-lg">
        <h4 className="text-sm font-medium text-foreground mb-2">File Requirements:</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Maximum file size: 10MB</li>
          <li>• Supported formats: CSV, XLS, XLSX</li>
          <li>• Required columns: Student ID, Name, Email, Phone</li>
          <li>• Optional columns: Attendance, Test Scores, Fee Status</li>
        </ul>
      </div>
    </div>
  );
};

export default FileUploadZone;