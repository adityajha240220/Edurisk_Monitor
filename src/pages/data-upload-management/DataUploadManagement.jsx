import React from 'react';
import UploadHistoryPanel from './UploadHistoryPanel';
import ValidationRulesPanel from './ValidationRulesPanel';
import { useUploads } from '../../hooks/useUploads';
import { useValidationRules } from '../../hooks/useValidationRules';

const DataUploadManagement = () => {
  const { uploads, loading, handleRollback, handleDownload } = useUploads();
  const { rules, loading: rulesLoading, handleUpdateRule } = useValidationRules();

  if (loading || rulesLoading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="space-y-6">
      <UploadHistoryPanel
        uploads={uploads}
        onRollback={handleRollback}
        onDownload={handleDownload}
      />
      <ValidationRulesPanel
        rules={rules}
        onRulesUpdate={handleUpdateRule}
      />
    </div>
  );
};

export default DataUploadManagement;
