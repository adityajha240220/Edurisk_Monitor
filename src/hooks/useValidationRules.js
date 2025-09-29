import { useState, useEffect } from 'react';
import { fetchValidationRules, updateValidationRule } from '../services/validationService';

export const useValidationRules = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadRules = async () => {
    try {
      setLoading(true);
      const data = await fetchValidationRules();
      setRules(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRule = async (ruleId, payload) => {
    try {
      await updateValidationRule(ruleId, payload);
      loadRules(); // Refresh rules
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadRules();
  }, []);

  return { rules, loading, handleUpdateRule };
};
