// src/hooks/useUploadHistory.js
import { useState, useEffect } from 'react';
import { getUploadHistory } from '../services/uploadService';

export const useUploadHistory = (token) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getUploadHistory(token);
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchHistory();
  }, [token]);

  return { history, loading, refetch: fetchHistory };
};
