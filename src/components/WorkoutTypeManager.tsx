import { useState, useEffect } from 'react';
import { WorkoutType } from '../types/workout';
import { fetchWorkoutTypes, createWorkoutType, updateWorkoutType, deleteWorkoutType } from '../services/api';

const WorkoutTypeManager = () => {
  const [workoutTypes, setWorkoutTypes] = useState<WorkoutType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTypeName, setNewTypeName] = useState('');
  const [editingType, setEditingType] = useState<WorkoutType | null>(null);

  const loadWorkoutTypes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const types = await fetchWorkoutTypes();
      setWorkoutTypes(types);
    } catch (err) {
      setError('Failed to load workout types');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWorkoutTypes();
  }, []);

  const handleAddType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypeName.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      await createWorkoutType({ name: newTypeName });
      setNewTypeName('');
      await loadWorkoutTypes();
    } catch (err) {
      setError('Failed to add workout type');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingType || !editingType.name.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      await updateWorkoutType(editingType.id, { name: editingType.name });
      setEditingType(null);
      await loadWorkoutTypes();
    } catch (err) {
      setError('Failed to update workout type');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteType = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this workout type?')) return;

    setIsLoading(true);
    setError(null);
    try {
      await deleteWorkoutType(id);
      await loadWorkoutTypes();
    } catch (err) {
      setError('Failed to delete workout type');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="workout-type-manager">
      <h2>Workout Types</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleAddType} className="add-form">
        <input
          type="text"
          placeholder="New workout type name"
          value={newTypeName}
          onChange={(e) => setNewTypeName(e.target.value)}
          disabled={isLoading}
          required
        />
        <button type="submit" disabled={isLoading || !newTypeName.trim()}>
          Add Type
        </button>
      </form>

      {editingType && (
        <div className="edit-overlay">
          <div className="edit-form-container">
            <h3>Edit Workout Type</h3>
            <form onSubmit={handleUpdateType}>
              <input
                type="text"
                value={editingType.name}
                onChange={(e) => setEditingType({ ...editingType, name: e.target.value })}
                disabled={isLoading}
                required
              />
              <div className="form-buttons">
                <button type="submit" disabled={isLoading || !editingType.name.trim()}>
                  Save
                </button>
                <button 
                  type="button" 
                  onClick={() => setEditingType(null)}
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
      
      <ul className="workout-types-list">
        {workoutTypes.map((type) => (
          <li key={type.id} className="workout-type-item">
            <span>{type.name}</span>
            <div className="type-actions">
              <button 
                className="edit-button"
                onClick={() => setEditingType(type)}
                disabled={isLoading}
              >
                Edit
              </button>
              <button 
                className="delete-button"
                onClick={() => handleDeleteType(type.id)}
                disabled={isLoading}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
        {workoutTypes.length === 0 && !isLoading && (
          <li className="no-items">No workout types found</li>
        )}
      </ul>
    </div>
  );
};

export default WorkoutTypeManager;