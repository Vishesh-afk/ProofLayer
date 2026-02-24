import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase/firebase';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { USER_ROLES, ROLE_LABELS } from '../../constants/roles';
import { FaCheck, FaTimes, FaSpinner, FaTrash } from 'react-icons/fa';

const ManageUsers = () => {
    const { userProfile, userRole } = useAuth();
    const [companyUsers, setCompanyUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    const isAdmin = userRole === USER_ROLES.ADMIN && userProfile?.isApproved;

    useEffect(() => {
        if (userProfile?.company) {
            fetchCompanyUsers();
        } else {
            setLoading(false);
        }
    }, [userProfile]);

    const fetchCompanyUsers = async () => {
        try {
            setLoading(true);
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('company', '==', userProfile.company));
            const querySnapshot = await getDocs(q);

            const users = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setCompanyUsers(users);
        } catch (error) {
            console.error("Error fetching company users:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveUser = async (userId) => {
        try {
            setActionLoading(userId);
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                isApproved: true,
                updatedAt: new Date().toISOString()
            });

            // Update local state
            setCompanyUsers(prev => prev.map(user =>
                user.id === userId ? { ...user, isApproved: true } : user
            ));
        } catch (error) {
            console.error("Error approving user:", error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleRejectUser = async (userId) => {
        if (!window.confirm('Are you sure you want to reject this user? They will lose access.')) return;

        try {
            setActionLoading(userId);
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                isApproved: false,
                role: USER_ROLES.USER,
                updatedAt: new Date().toISOString()
            });

            // Update local state
            setCompanyUsers(prev => prev.map(user =>
                user.id === userId ? { ...user, isApproved: false, role: USER_ROLES.USER } : user
            ));
        } catch (error) {
            console.error("Error rejecting user:", error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to permanently delete this user?')) return;

        try {
            setActionLoading(userId);
            const userRef = doc(db, 'users', userId);
            await deleteDoc(userRef);

            // Update local state
            setCompanyUsers(prev => prev.filter(user => user.id !== userId));
        } catch (error) {
            console.error("Error deleting user:", error);
        } finally {
            setActionLoading(null);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            setActionLoading(userId);
            const userRef = doc(db, 'users', userId);
            await updateDoc(userRef, {
                role: newRole,
                updatedAt: new Date().toISOString()
            });

            // Update local state
            setCompanyUsers(prev => prev.map(user =>
                user.id === userId ? { ...user, role: newRole } : user
            ));
        } catch (error) {
            console.error("Error updating role:", error);
        } finally {
            setActionLoading(null);
        }
    };

    if (!isAdmin) {
        return (
            <div className="p-8 max-w-6xl mx-auto">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                    <h2 className="text-xl font-semibold text-yellow-800 mb-2">Access Restricted</h2>
                    <p className="text-yellow-700">Only approved administrators can manage users.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">Manage Users</h1>
                <p className="text-gray-500">Manage team members for {userProfile?.company}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-lg font-semibold">Team Members</h2>
                        <p className="text-sm text-gray-500 mt-1">Total: {companyUsers.length} users</p>
                    </div>
                    <button
                        onClick={fetchCompanyUsers}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                    >
                        Refresh
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center p-12 text-gray-400">
                        <FaSpinner className="animate-spin text-2xl" />
                        <span className="ml-2">Loading team data...</span>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {companyUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-semibold overflow-hidden">
                                                    {user.photoURL ? (
                                                        <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        user.name?.charAt(0)?.toUpperCase()
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{user.name}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                    <div className="text-xs text-gray-400">{user.designation}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                disabled={user.id === userProfile.uid || actionLoading === user.id}
                                                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            >
                                                {Object.entries(ROLE_LABELS).map(([value, label]) => (
                                                    <option key={value} value={value}>{label}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.isApproved ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                    <FaCheck size={10} /> Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                                    <FaTimes size={10} /> Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {user.id !== userProfile.uid && (
                                                    <>
                                                        {!user.isApproved && (
                                                            <button
                                                                onClick={() => handleApproveUser(user.id)}
                                                                disabled={actionLoading === user.id}
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                                                            >
                                                                {actionLoading === user.id ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                                                                Approve
                                                            </button>
                                                        )}
                                                        {user.isApproved && (
                                                            <button
                                                                onClick={() => handleRejectUser(user.id)}
                                                                disabled={actionLoading === user.id}
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-600 text-white text-xs font-medium rounded-md hover:bg-yellow-700 transition-colors disabled:opacity-50"
                                                            >
                                                                {actionLoading === user.id ? <FaSpinner className="animate-spin" /> : <FaTimes />}
                                                                Revoke
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDeleteUser(user.id)}
                                                            disabled={actionLoading === user.id}
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                                                        >
                                                            {actionLoading === user.id ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                                {user.id === userProfile.uid && (
                                                    <span className="text-xs text-gray-400 italic">You</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {companyUsers.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                <p>No team members found.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageUsers;
