import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ROLE_LABELS } from '../../constants/roles';
import { FaUser, FaEnvelope, FaBuilding, FaBriefcase, FaShieldAlt } from 'react-icons/fa';

const Settings = () => {
    const { currentUser, userProfile, userRole } = useAuth();

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-2">Account Settings</h1>
            <p className="text-gray-500 mb-8">View and manage your profile information</p>

            {/* Profile Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center gap-8 mb-8">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-4xl text-white font-semibold overflow-hidden">
                        {userProfile?.photoURL ? (
                            <img src={userProfile.photoURL} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <FaUser />
                        )}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{userProfile?.name || userProfile?.displayName}</h2>
                        <p className="text-gray-500">{userProfile?.designation}</p>
                        <div className="mt-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                                <FaShieldAlt size={12} />
                                {ROLE_LABELS[userRole]}
                            </span>
                            {userProfile?.isApproved && (
                                <span className="ml-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                                    ✓ Approved
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <FaUser />
                            <label className="text-sm font-medium">Full Name</label>
                        </div>
                        <div className="text-gray-900 font-medium">{userProfile?.name || userProfile?.displayName || 'Not set'}</div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <FaEnvelope />
                            <label className="text-sm font-medium">Email Address</label>
                        </div>
                        <div className="text-gray-900">{currentUser?.email}</div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <FaBuilding />
                            <label className="text-sm font-medium">Company</label>
                        </div>
                        <div className="text-gray-900 font-medium">{userProfile?.company || 'Not set'}</div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                            <FaBriefcase />
                            <label className="text-sm font-medium">Designation</label>
                        </div>
                        <div className="text-gray-900">{userProfile?.designation || 'Not set'}</div>
                    </div>
                </div>

                {!userProfile?.isApproved && (
                    <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-yellow-800 mb-1">Pending Approval</h3>
                        <p className="text-sm text-yellow-700">
                            Your account is pending approval from your company administrator. You will have limited access until approved.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;
