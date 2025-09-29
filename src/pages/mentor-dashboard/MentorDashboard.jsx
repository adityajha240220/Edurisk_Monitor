// pages/mentor/MentorDashboard.jsx
import React from 'react';
import UploadHistoryPanel from '../data-upload-management/UploadHistoryPanel';
import FileUploadZone from '../data-upload-management/FileUploadZone';

import { useUploadHistory } from '../../hooks/useUploadHistory';
import { rollbackUpload, downloadFile } from '../../services/uploadService';

const MentorDashboard = ({ token }) => {
  const { history, loading: historyLoading, refetch: refetchHistory } = useUploadHistory(token);

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
      <h2 className="text-xl font-semibold">Mentor Dashboard</h2>

      <FileUploadZone token={token} onUploadComplete={refetchHistory} />

      {historyLoading ? (
        <p>Loading upload history...</p>
      ) : (
        <UploadHistoryPanel
          onRollback={handleRollback}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
};

export default MentorDashboard;
