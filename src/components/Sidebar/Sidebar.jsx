import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { hasPermission } from '../../constants/roles';
import { BsList, BsDownload, BsHeart, BsGraphUp, BsLink45Deg, BsBoxArrowRight, BsGear, BsPeople } from 'react-icons/bs';
import userAvatar from '../../assets/avatar.png';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { currentUser, userProfile, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  const canImport = hasPermission(userRole, 'canImportTestimonials');
  const canAccessSettings = hasPermission(userRole, 'canAccessSettings');
  const canManageUsers = hasPermission(userRole, 'canManageUsers');

  const firstName = (userProfile?.displayName || userProfile?.name || currentUser?.email?.split('@')[0] || 'User').split(' ')[0];

  const navItemBase = 'flex items-center gap-3 px-3 py-3 rounded-lg no-underline font-medium transition-all duration-200 text-gray-700 hover:bg-[#1C1C1E] hover:text-white';
  const navItemActive = 'bg-[#1C1C1E] text-white';

  return (
    <aside
      className={`
        w-[280px] bg-white flex flex-col justify-between h-screen px-4 py-6 shrink-0
        sticky top-0 border-r border-gray-200 transition-transform duration-300 ease-in-out z-[1002]
        max-md:fixed max-md:left-0 max-md:top-0 max-md:h-full max-md:shadow-xl
        ${isOpen ? 'max-md:translate-x-0' : 'max-md:-translate-x-full'}
      `}
    >
      {/* Top Section */}
      <div className="flex flex-col flex-1 overflow-y-auto min-h-0">
        {/* Header: Logo + Profile (Right) */}
        <div className="flex items-center justify-between mb-8 px-2">
          {/* Logo */}
          <div className="flex items-center text-black font-medium text-xl font-[Lato]">
            ◆ ProofLayer
          </div>

          {/* Profile: Avatar + Name below */}
          <div className="flex flex-col items-center gap-1">
            <img
              src={userProfile?.photoURL || userAvatar}
              alt={firstName}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-100"
            />
            <span className="text-[10px] text-gray-500 font-medium leading-none">
              {firstName}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 flex-1">
          {/* COLLECT */}
          <div className="mb-5">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2 px-3">
              COLLECT
            </p>
            <Link
              to="/new-proof"
              className={`${navItemBase} ${isActive('/new-proof') ? navItemActive : ''}`}
              onClick={toggleSidebar}
            >
              <BsList size={18} /> <span>New Proof</span>
            </Link>
            {canImport && (
              <Link
                to="/import"
                className={`${navItemBase} ${isActive('/import') ? navItemActive : ''}`}
                onClick={toggleSidebar}
              >
                <BsDownload size={18} /> <span>Import</span>
              </Link>
            )}
          </div>

          {/* MANAGE */}
          <div className="mb-5">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2 px-3">
              MANAGE
            </p>
            <Link
              to="/dashboard"
              className={`${navItemBase} ${isActive('/dashboard') ? navItemActive : ''}`}
              onClick={toggleSidebar}
            >
              <BsHeart size={18} /> <span>Dashboard</span>
            </Link>
            {canManageUsers && (
              <Link
                to="/manage-users"
                className={`${navItemBase} ${isActive('/manage-users') ? navItemActive : ''}`}
                onClick={toggleSidebar}
              >
                <BsPeople size={18} /> <span>Manage Users</span>
              </Link>
            )}
          </div>

          {/* SHARE */}
          <div className="mb-5">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2 px-3">
              SHARE
            </p>
            <Link
              to="/distribute"
              className={`${navItemBase} ${isActive('/distribute') ? navItemActive : ''}`}
              onClick={toggleSidebar}
            >
              <BsGraphUp size={18} /> <span>Distribute</span>
            </Link>
          </div>

          {/* ACCOUNT */}
          {canAccessSettings && (
            <div className="mb-5">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-2 px-3">
                ACCOUNT
              </p>
              <Link
                to="/settings"
                className={`${navItemBase} ${isActive('/settings') ? navItemActive : ''}`}
              >
                <BsGear size={18} /> <span>Settings</span>
              </Link>
            </div>
          )}
        </nav>
      </div>

      {/* Footer: Logout Only */}
      <div className="pt-4 mt-2 border-t border-gray-100">
        <button
          className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-lg text-sm font-medium transition-all duration-200"
          onClick={handleLogout}
        >
          <BsBoxArrowRight className="text-lg" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;