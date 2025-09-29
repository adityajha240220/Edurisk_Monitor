import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { getUploadHistory, rollbackUpload, downloadUpload } from '../../../services/uploadService';

const UploadHistoryPanel = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTimeRange, setFilterTimeRange] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [uploadHistoryData, setUploadHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'success', label: 'Successful' },
    { value: 'partial', label: 'Partial Success' },
    { value: 'failed', label: 'Failed' },
    { value: 'processing', label: 'Processing' }
  ];

  const timeRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' }
  ];

  useEffect(() => {
    fetchUploadHistory();
  }, []);

  const fetchUploadHistory = async () => {
    setLoading(true);
    try {
      const data = await getUploadHistory();
      setUploadHistoryData(data);
    } catch (err) {
      console.error('Error fetching upload history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRollback = async (uploadId) => {
    if (!window.confirm('Are you sure you want to rollback this upload? This action cannot be undone.')) return;

    try {
      await rollbackUpload(uploadId);
      fetchUploadHistory();
      alert('Rollback successful!');
    } catch (err) {
      console.error('Rollback failed:', err);
      alert('Rollback failed. Check console for details.');
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
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Download failed. Check console for details.');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <Icon name="CheckCircle" size={16} className="text-success" />;
      case 'partial': return <Icon name="AlertTriangle" size={16} className="text-warning" />;
      case 'failed': return <Icon name="XCircle" size={16} className="text-error" />;
      case 'processing': return <Icon name="Clock" size={16} className="text-accent animate-pulse" />;
      default: return <Icon name="Circle" size={16} className="text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'success': return `${baseClasses} bg-success/10 text-success`;
      case 'partial': return `${baseClasses} bg-warning/10 text-warning`;
      case 'failed': return `${baseClasses} bg-error/10 text-error`;
      case 'processing': return `${baseClasses} bg-accent/10 text-accent`;
      default: return `${baseClasses} bg-muted text-muted-foreground`;
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - new Date(date)) / (1000 * 60));
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const filteredData = uploadHistoryData?.filter(item => {
    if (filterStatus !== 'all' && item?.status !== filterStatus) return false;
    // Add time range filtering if backend provides timestamps
    return true;
  });

  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData?.slice(startIndex, startIndex + itemsPerPage);

  const getSuccessRate = (successful, total) => total === 0 ? 0 : Math.round((successful / total) * 100);

  if (loading) return <div className="p-6">Loading upload history...</div>;

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Upload History</h3>
            <p className="text-sm text-muted-foreground">
              Track and manage previous data uploads with rollback capabilities
            </p>
          </div>
          <Button variant="outline" iconName="Download" iconPosition="left" onClick={() => handleDownload('history')}>
            Export History
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select label="Filter by Status" options={statusOptions} value={filterStatus} onChange={setFilterStatus} />
          <Select label="Time Range" options={timeRangeOptions} value={filterTimeRange} onChange={setFilterTimeRange} />
          <div className="flex items-end">
            <Button variant="outline" iconName="RotateCcw" iconPosition="left" onClick={() => { setFilterStatus('all'); setFilterTimeRange('all'); setCurrentPage(1); }}>
              Reset Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">File Details</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Records</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Success Rate</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Uploaded By</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedData?.map(upload => (
              <tr key={upload?.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Icon name="FileText" size={16} className="text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">{upload?.fileName}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{upload?.fileSize} • {upload?.processingTime}</div>
                    <div className="text-xs text-muted-foreground">{formatTimeAgo(upload?.uploadTime)}</div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(upload?.status)}
                    <span className={getStatusBadge(upload?.status)}>{upload?.status}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="space-y-1">
                    <div className="text-sm text-foreground">{upload?.totalRecords?.toLocaleString('en-IN')} total</div>
                    <div className="text-xs text-muted-foreground">
                      {upload?.successfulRecords?.toLocaleString('en-IN')} success • {upload?.failedRecords?.toLocaleString('en-IN')} failed
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          getSuccessRate(upload?.successfulRecords, upload?.totalRecords) === 100 ? 'bg-success' :
                          getSuccessRate(upload?.successfulRecords, upload?.totalRecords) > 80 ? 'bg-warning' : 'bg-error'
                        }`}
                        style={{ width: `${getSuccessRate(upload?.successfulRecords, upload?.totalRecords)}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{getSuccessRate(upload?.successfulRecords, upload?.totalRecords)}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-foreground">{upload?.uploadedBy}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" iconName="Download" onClick={() => handleDownload(upload?.id)} />
                    {upload?.canRollback && upload?.status === 'success' && (
                      <Button variant="ghost" size="sm" iconName="RotateCcw" onClick={() => handleRollback(upload?.id)} className="text-warning hover:text-warning" />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData?.length)} of {filteredData?.length} uploads
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} iconName="ChevronLeft" iconPosition="left">Previous</Button>
            <span className="text-sm text-foreground px-3">Page {currentPage} of {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} iconName="ChevronRight" iconPosition="right">Next</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadHistoryPanel;
