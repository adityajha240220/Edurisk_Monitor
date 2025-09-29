// pages/ministry/MinistryDashboard.jsx
import React from 'react';
import UploadHistoryPanel from '../data-upload-management/UploadHistoryPanel';
import CMSIntegrationPanel from '../data-upload-management/CMSIntegrationPanel';

import { useUploadHistory } from '../../hooks/useUploadHistory';
import { useCMSData } from '../../hooks/useCMSData';
import { downloadFile } from '../../services/uploadService';

const MinistryDashboard = ({ token }) => {
  const { history, loading: historyLoading } = useUploadHistory(token);
  const { cmsData, loading: cmsLoading, refetch: refetchCMS } = useCMSData(token);

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
      <h2 className="text-xl font-semibold">Ministry Dashboard</h2>

      {historyLoading ? (
        <p>Loading upload history...</p>
      ) : (
        <UploadHistoryPanel
          onRollback={() => {}}
          onDownload={handleDownload}
        />
      )}

      {cmsLoading ? (
        <p>Loading CMS data...</p>
      ) : (
        <CMSIntegrationPanel data={cmsData} onRefresh={refetchCMS} />
      )}
    </div>
  );
};

export default MinistryDashboard;
