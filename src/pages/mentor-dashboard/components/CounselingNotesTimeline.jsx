import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CounselingNotesTimeline = ({ 
  isExpanded, 
  onToggle, 
  notes, 
  onAddNote, 
  selectedStudentId 
}) => {
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  const handleAddNote = () => {
    if (newNote?.trim() && selectedStudentId) {
      onAddNote(selectedStudentId, newNote?.trim());
      setNewNote('');
      setIsAddingNote(false);
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })?.format(new Date(date));
  };

  const getInterventionTypeColor = (type) => {
    switch (type) {
      case 'Academic Support':
        return 'bg-primary text-primary-foreground';
      case 'Personal Counseling':
        return 'bg-accent text-accent-foreground';
      case 'Family Meeting':
        return 'bg-warning text-warning-foreground';
      case 'Follow-up':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-3">
          <Icon name="MessageSquare" size={20} className="text-primary" />
          <h3 className="font-semibold text-foreground">Counseling Notes Timeline</h3>
          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
            {notes?.length} notes
          </span>
        </div>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={20} 
          className="text-muted-foreground" 
        />
      </div>
      {/* Expandable Content */}
      {isExpanded && (
        <div className="border-t border-border">
          {/* Add Note Section */}
          <div className="p-4 bg-muted/20">
            {!isAddingNote ? (
              <Button
                variant="outline"
                onClick={() => setIsAddingNote(true)}
                iconName="Plus"
                iconPosition="left"
                iconSize={16}
                disabled={!selectedStudentId}
                fullWidth
              >
                {selectedStudentId ? 'Add New Counseling Note' : 'Select a student to add notes'}
              </Button>
            ) : (
              <div className="space-y-3">
                <Input
                  label="Counseling Note"
                  type="text"
                  placeholder="Enter counseling note or intervention details..."
                  value={newNote}
                  onChange={(e) => setNewNote(e?.target?.value)}
                  required
                />
                <div className="flex space-x-2">
                  <Button
                    variant="default"
                    onClick={handleAddNote}
                    disabled={!newNote?.trim()}
                    iconName="Check"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Save Note
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddingNote(false);
                      setNewNote('');
                    }}
                    iconName="X"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="p-4">
            {notes?.length > 0 ? (
              <div className="space-y-4">
                {notes?.map((note, index) => (
                  <div key={note?.id} className="flex space-x-4">
                    {/* Timeline Line */}
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      {index < notes?.length - 1 && (
                        <div className="w-0.5 h-16 bg-border mt-2"></div>
                      )}
                    </div>

                    {/* Note Content */}
                    <div className="flex-1 pb-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getInterventionTypeColor(note?.interventionType)}`}>
                            {note?.interventionType}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            by {note?.mentorName}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(note?.timestamp)}
                        </span>
                      </div>
                      
                      <div className="bg-muted/30 rounded-lg p-3">
                        <p className="text-sm text-foreground mb-2">
                          <strong>Student:</strong> {note?.studentName}
                        </p>
                        <p className="text-sm text-foreground">
                          {note?.content}
                        </p>
                        {note?.followUpRequired && (
                          <div className="mt-2 flex items-center space-x-2">
                            <Icon name="Clock" size={14} className="text-warning" />
                            <span className="text-xs text-warning font-medium">
                              Follow-up required by {formatDate(note?.followUpDate)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Icon name="MessageSquare" size={48} className="mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No counseling notes available</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Start by selecting a student and adding your first note
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CounselingNotesTimeline;