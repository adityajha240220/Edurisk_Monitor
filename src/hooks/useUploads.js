import { useState, useEffect } from 'react';
import { fetchUploads, rollbackUpload, downloadUpload } from '../services/uploadService';

export const useUploads = () => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUploads = async () => {
    try {
      setLoading(true);
      const data = await fetchUploads();
      setUploads(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRollback = async (uploadId) => {
    try {
      await rollbackUpload(uploadId);
      loadUploads(); // Refresh list
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = async (uploadId) => {
    try {
      const blob = await downloadUpload(uploadId);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `upload_${uploadId}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadUploads();
  }, []);

  return { uploads, loading, handleRollback, handleDownload };
};
