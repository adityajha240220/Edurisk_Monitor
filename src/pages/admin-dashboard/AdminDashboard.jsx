// pages/admin/AdminDashboard.jsx
import React from 'react';
import FileUploadZone from '../data-upload-management/FileUploadZone';
import UploadHistoryPanel from '../data-upload-management/UploadHistoryPanel';
import ValidationRulesPanel from '../data-upload-management/ValidationRulesPanel';
import CMSIntegrationPanel from '../data-upload-management/CMSIntegrationPanel';

import { useUploadHistory } from '../../hooks/useUploadHistory';
import { useCMSData } from '../../hooks/useCMSData';
import { rollbackUpload, downloadFile } from '../../services/uploadService';

const AdminDashboard = ({ token }) => {
  const { history, loading: historyLoading, refetch: refetchHistory } = useUploadHistory(token);
  const { cmsData, loading: cmsLoading, refetch: refetchCMS } = useCMSData(token);

  const handleRollback = async (uploadId) => {
    if (window.confirm('Are you sure you want to rollback this upload?')) {
      try {
        await rollbackUpload(uploadId, token);
        refetchHistory();
        alert('Rollback successful');
      } catch (err) {
        console.error(err);
        alert('Rollback failed');
      }
    }
  };

  const handleDownload = async (uploadId) => {
    try {
      const data = await downloadFile(uploadId, token);
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `upload_${uploadId}.csv`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error(err);
      alert('Download failed');
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-xl font-semibold">Admin Dashboard</h2>

      <FileUploadZone token={token} onUploadComplete={refetchHistory} />

      {historyLoading ? (
        <p>Loading upload history...</p>
      ) : (
        <UploadHistoryPanel
          onRollback={handleRollback}
          onDownload={handleDownload}
        />
      )}

      <ValidationRulesPanel token={token} />

      {cmsLoading ? (
        <p>Loading CMS data...</p>
      ) : (
        <CMSIntegrationPanel data={cmsData} onRefresh={refetchCMS} />
      )}
    </div>
  );
};

export default AdminDashboard;
