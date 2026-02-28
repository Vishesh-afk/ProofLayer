import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { hasPermission } from '../../constants/roles';
import { getProjects, createProject, deleteProject } from '../../services/projectService';
import { FaPlus, FaSpinner, FaFolder, FaTimes, FaTrash } from 'react-icons/fa';
import CreateProjectModal from '../../components/CreateProjectModal/CreateProjectModal';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { userRole, userProfile } = useAuth();

  // Privileged or Admin can create
  const canCreate = hasPermission(userRole, 'canImportTestimonials') || hasPermission(userRole, 'canManageUsers');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getProjects(userProfile?.company);
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (projectData) => {
    const created = await createProject({
      ...projectData,
      companyId: userProfile?.company || '',
    });
    setProjects([created, ...projects]);
  };

  const handleDeleteProject = async (e, projectId) => {
    e.stopPropagation(); // Prevent navigating to project
    if (window.confirm("Are you sure you want to delete this workspace? This cannot be undone.")) {
      try {
        await deleteProject(projectId);
        setProjects(projects.filter(p => p.id !== projectId));
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-background animate-fadeIn">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-6 py-8 md:px-10 border-b border-border bg-surface shadow-sm z-10 sticky top-0 md:static">
        <div>
          <h1 className="font-heading text-3xl font-bold text-content-primary m-0 tracking-tight">Projects</h1>
          <p className="text-sm text-content-secondary font-medium mt-1">Organize your assets and testimonials by workspace.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          {canCreate && (
            <button 
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white rounded-full px-6 py-2.5 font-semibold transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 border-none"
              onClick={() => setIsModalOpen(true)}
            >
              <FaPlus size={14} /> New Project
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
        {loading ? (
          <div className="flex justify-center p-12 text-content-muted">
            <FaSpinner className="animate-spin text-2xl text-primary-500" />
            <span className="ml-3 font-medium">Loading projects...</span>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 text-content-secondary bg-surface rounded-xl border border-border border-dashed shadow-sm">
            <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
              <FaFolder className="text-2xl text-primary-400" />
            </div>
            <p className="text-lg font-medium text-content-primary">No projects found.</p>
            {canCreate && (
              <p className="text-sm mt-2 text-content-secondary max-w-sm mx-auto">
                Create a project to start organizing your case studies, videos, and testimonials.
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <div 
                key={project.id} 
                onClick={() => navigate(`/projects/${project.id}`)}
                className="bg-surface border border-border rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-primary-300 transition-all cursor-pointer group flex flex-col h-full"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                    <FaFolder className="text-xl" />
                  </div>
                  {canCreate && (
                    <button 
                      onClick={(e) => handleDeleteProject(e, project.id)}
                      className="p-2 text-content-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors focus:outline-none"
                      title="Delete Workspace"
                    >
                      <FaTrash size={14} />
                    </button>
                  )}
                </div>
                <h3 className="text-xl font-bold text-content-primary mb-2 tracking-tight group-hover:text-primary-700 transition-colors">{project.name}</h3>
                <p className="text-sm text-content-secondary line-clamp-2 flex-grow mb-4">{project.description || 'No description provided.'}</p>
                <div className="text-xs font-semibold text-content-muted uppercase tracking-wider mt-auto pt-4 border-t border-border/50 flex justify-between">
                  <span>Created</span>
                  <span>{project.createdAt?.toDate().toLocaleDateString() || 'Recently'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <CreateProjectModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProject}
      />
    </div>
  );
};

export default Projects;
