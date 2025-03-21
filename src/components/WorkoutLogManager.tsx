import { useState, useEffect } from 'react';
import { WorkoutLog, WorkoutType, CreateWorkoutLogRequest } from '../types/workout';
import { fetchWorkoutLogs, createWorkoutLog, updateWorkoutLog, deleteWorkoutLog, fetchWorkoutTypes } from '../services/api';

const WorkoutLogManager = () => {
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [workoutTypes, setWorkoutTypes] = useState<WorkoutType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingLog, setEditingLog] = useState<WorkoutLog | null>(null);
  
  // Form state for new workout log
  const [newLog, setNewLog] = useState<CreateWorkoutLogRequest>({
    date: new Date().toISOString().split('T')[0],
    workoutType: { id: '', sequence: 0, name: '' },
    minutes: 30
  });

  const loadWorkoutLogs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const logs = await fetchWorkoutLogs();
      setWorkoutLogs(logs);
    } catch (err) {
      setError('Failed to load workout logs');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadWorkoutTypes = async () => {
    try {
      const types = await fetchWorkoutTypes();
      setWorkoutTypes(types);
      
      // Set default workout type if available
      if (types.length > 0 && !newLog.workoutType.id) {
        setNewLog(prev => ({
          ...prev,
          workoutType: types[0]
        }));
      }
    } catch (err) {
      setError('Failed to load workout types');
      console.error(err);
    }
  };

  useEffect(() => {
    // Load both workout logs and types
    Promise.all([loadWorkoutLogs(), loadWorkoutTypes()]);
  }, []);

  const handleAddLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLog.workoutType.id) {
      setError('Please select a workout type');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      await createWorkoutLog(newLog);
      // Reset form
      setNewLog({
        date: new Date().toISOString().split('T')[0],
        workoutType: workoutTypes.length > 0 ? workoutTypes[0] : { id: '', sequence: 0, name: '' },
        minutes: 30
      });
      await loadWorkoutLogs();
    } catch (err) {
      setError('Failed to add workout log');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLog) return;

    setIsLoading(true);
    setError(null);
    try {
      const updateData: CreateWorkoutLogRequest = {
        date: editingLog.date,
        workoutType: editingLog.workoutType,
        minutes: editingLog.minutes
      };
      
      await updateWorkoutLog(editingLog.id, updateData);
      setEditingLog(null);
      await loadWorkoutLogs();
    } catch (err) {
      setError('Failed to update workout log');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLog = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this workout log?')) return;

    setIsLoading(true);
    setError(null);
    try {
      await deleteWorkoutLog(id);
      await loadWorkoutLogs();
    } catch (err) {
      setError('Failed to delete workout log');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display (from ISO format)
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString();
  };

  return (
    <div className="workout-log-manager">
      <h2>Workout Logs</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleAddLog} className="add-form">
        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <input
            id="date"
            type="date"
            value={newLog.date}
            onChange={(e) => setNewLog({...newLog, date: e.target.value})}
            disabled={isLoading}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="workoutType">Workout Type:</label>
          <select
            id="workoutType"
            value={newLog.workoutType.id}
            onChange={(e) => {
              const selectedType = workoutTypes.find(type => type.id === e.target.value);
              setNewLog({...newLog, workoutType: selectedType || { id: '', sequence: 0, name: '' }});
            }}
            disabled={isLoading || workoutTypes.length === 0}
            required
          >
            <option value="">Select workout type</option>
            {workoutTypes.map(type => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="minutes">Minutes:</label>
          <input
            id="minutes"
            type="number"
            min="1"
            value={newLog.minutes}
            onChange={(e) => setNewLog({...newLog, minutes: parseInt(e.target.value, 10)})}
            disabled={isLoading}
            required
          />
        </div>
        
        <button type="submit" disabled={isLoading || !newLog.workoutType.id}>
          Add Workout
        </button>
      </form>

      {editingLog && (
        <div className="edit-overlay">
          <div className="edit-form-container">
            <h3>Edit Workout Log</h3>
            <form onSubmit={handleUpdateLog}>
              <div className="form-group">
                <label htmlFor="edit-date">Date:</label>
                <input
                  id="edit-date"
                  type="date"
                  value={editingLog.date}
                  onChange={(e) => setEditingLog({...editingLog, date: e.target.value})}
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="edit-workoutType">Workout Type:</label>
                <select
                  id="edit-workoutType"
                  value={editingLog.workoutType.id}
                  onChange={(e) => {
                    const selectedType = workoutTypes.find(type => type.id === e.target.value);
                    setEditingLog({
                      ...editingLog, 
                      workoutType: selectedType || { id: '', sequence: 0, name: '' }
                    });
                  }}
                  disabled={isLoading || workoutTypes.length === 0}
                  required
                >
                  {workoutTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="edit-minutes">Minutes:</label>
                <input
                  id="edit-minutes"
                  type="number"
                  min="1"
                  value={editingLog.minutes}
                  onChange={(e) => setEditingLog({
                    ...editingLog, 
                    minutes: parseInt(e.target.value, 10)
                  })}
                  disabled={isLoading}
                  required
                />
              </div>
              
              <div className="form-buttons">
                <button type="submit" disabled={isLoading}>
                  Save
                </button>
                <button 
                  type="button" 
                  onClick={() => setEditingLog(null)}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLoading && <div className="loading">Loading...</div>}
      
      <div className="workout-logs-container">
        {workoutLogs.length === 0 && !isLoading ? (
          <p className="no-items">No workout logs found</p>
        ) : (
          <table className="workout-logs-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Workout Type</th>
                <th>Minutes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {workoutLogs.map((log) => (
                <tr key={log.id} className="workout-log-item">
                  <td>{formatDate(log.date)}</td>
                  <td>{log.workoutType.name}</td>
                  <td>{log.minutes}</td>
                  <td className="log-actions">
                    <button 
                      className="edit-button"
                      onClick={() => setEditingLog(log)}
                      disabled={isLoading}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handleDeleteLog(log.id)}
                      disabled={isLoading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default WorkoutLogManager;