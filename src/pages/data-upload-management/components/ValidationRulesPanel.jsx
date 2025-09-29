import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { getValidationRules, updateValidationRule } from '../../../services/validationService';

const ValidationRulesPanel = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState(null);
  const [editingValue, setEditingValue] = useState('');

  useEffect(() => {
    fetchValidationRules();
  }, []);

  const fetchValidationRules = async () => {
    setLoading(true);
    try {
      const data = await getValidationRules();
      setRules(data);
    } catch (err) {
      console.error('Error fetching validation rules:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (rule) => {
    setEditingRuleId(rule.id);
    setEditingValue(rule.value);
  };

  const handleSave = async (ruleId) => {
    try {
      await updateValidationRule(ruleId, { value: editingValue });
      setEditingRuleId(null);
      setEditingValue('');
      fetchValidationRules();
      alert('Rule updated successfully!');
    } catch (err) {
      console.error('Error updating rule:', err);
      alert('Failed to update rule. Check console for details.');
    }
  };

  const handleCancel = () => {
    setEditingRuleId(null);
    setEditingValue('');
  };

  if (loading) return <div className="p-6">Loading validation rules...</div>;

  return (
    <div className="bg-card rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Validation Rules</h3>
        <p className="text-sm text-muted-foreground">
          Define and manage validation rules for uploaded data files
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Rule Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Value</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rules?.map((rule) => (
              <tr key={rule.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 text-sm text-foreground">{rule.name}</td>
                <td className="px-4 py-3 text-sm text-foreground">
                  {editingRuleId === rule.id ? (
                    <input
                      type="text"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      className="border border-border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    rule.value
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{rule.description}</td>
                <td className="px-4 py-3 flex items-center space-x-2">
                  {editingRuleId === rule.id ? (
                    <>
                      <Button size="sm" variant="outline" onClick={() => handleSave(rule.id)}>
                        Save
                      </Button>
                      <Button size="sm" variant="ghost" onClick={handleCancel}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" variant="ghost" iconName="Edit" onClick={() => handleEdit(rule)} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ValidationRulesPanel;
