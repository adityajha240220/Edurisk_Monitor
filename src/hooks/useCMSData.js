// src/hooks/useCMSData.js
import { useState, useEffect } from 'react';
import { fetchCMSData } from '../services/cmsService';

export const useCMSData = (token) => {
  const [cmsData, setCmsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchCMSData(token);
      setCmsData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchData();
  }, [token]);

  return { cmsData, loading, refetch: fetchData };
};
