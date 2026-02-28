import React, { useState } from 'react';
import { FaTimes, FaSpinner } from 'react-icons/fa';

const CreateProjectModal = ({ isOpen, onClose, onCreate }) => {
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [creating, setCreating] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newProject.name.trim()) return;

    try {
      setCreating(true);
      await onCreate(newProject);
      setNewProject({ name: '', description: '' });
      onClose();
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[1100] flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-surface rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slideUp">
        <div className="flex justify-between items-center p-6 border-b border-border">
          <h2 className="text-xl font-bold text-content-primary m-0">Create New Project</h2>
          <button 
            onClick={onClose}
            className="text-content-muted hover:text-content-primary transition-colors focus:outline-none p-1 rounded hover:bg-background"
          >
            <FaTimes />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-content-secondary mb-1.5">Project Name</label>
            <input 
              type="text" 
              required
              value={newProject.name}
              onChange={(e) => setNewProject({...newProject, name: e.target.value})}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-content-primary focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
              placeholder="e.g., Acme Corp Case Study"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-content-secondary mb-1.5">Description (Optional)</label>
            <textarea 
              rows="3"
              value={newProject.description}
              onChange={(e) => setNewProject({...newProject, description: e.target.value})}
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-content-primary focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium resize-none"
              placeholder="Brief description of this project..."
            />
          </div>
          <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-border">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-medium text-content-secondary hover:bg-background transition-colors focus:outline-none"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={creating || !newProject.name.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed border-none"
            >
              {creating && <FaSpinner className="animate-spin" />}
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
