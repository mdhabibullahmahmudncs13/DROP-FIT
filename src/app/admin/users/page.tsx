'use client';

import { useEffect, useState, useMemo } from 'react';
import { databases, DATABASE_ID, USERS_COLLECTION_ID } from '@/lib/appwrite/client';
import { formatDate } from '@/lib/utils';
import { PageLoader } from '@/components/ui/Loading';
import Badge from '@/components/ui/Badge';
import { Query } from 'appwrite';
import { useDebounce, useExportData } from '@/hooks/useAdminUtils';
import { useAdminToast } from '@/app/admin/layout';
import Button from '@/components/ui/Button';

type AdminUser = {
  $id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  $createdAt: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'admin' | 'user'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const toast = useAdminToast();
  const { exportToCSV } = useExportData();

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.orderDesc('$createdAt'), Query.limit(200)]
      );
      setUsers(response.documents as unknown as AdminUser[]);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  async function toggleUserRole(userId: string, currentRole: string) {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await databases.updateDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        userId,
        { role: newRole }
      );
      setUsers((prev) =>
        prev.map((user) =>
          user.$id === userId ? { ...user, role: newRole as 'admin' | 'user' } : user
        )
      );
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user role');
    }
  }

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesFilter = filter === 'all' || u.role === filter;
      if (!debouncedSearch) return matchesFilter;
      
      const searchLower = debouncedSearch.toLowerCase();
      const matchesSearch = 
        u.name.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower);
      
      return matchesFilter && matchesSearch;
    });
  }, [users, filter, debouncedSearch]);

  const handleExport = () => {
    const exportData = filteredUsers.map((user) => ({
      ID: user.$id,
      Name: user.name,
      Email: user.email,
      Role: user.role,
      JoinDate: formatDate(user.$createdAt),
    }));
    exportToCSV(exportData, 'users');
    toast.success('Users exported successfully');
  };

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-text-primary mb-2">Users Management</h2>
          <p className="text-text-secondary">Manage user accounts and permissions</p>
        </div>
        <Button onClick={handleExport} variant="secondary" disabled={filteredUsers.length === 0}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-background-surface rounded-card border border-border p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full px-4 py-2 bg-background-card border border-border rounded-lg focus:outline-none focus:border-primary text-text-primary"
            />
          </div>
        </div>
        <div className="flex gap-2">
          {['all', 'admin', 'user'].map((role) => (
            <button
              key={role}
              onClick={() => setFilter(role as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === role
                  ? 'bg-primary text-white'
                  : 'bg-background-hover text-text-secondary hover:bg-background-card'
              }`}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          ))}
        </div>
        <div className="mt-3 text-sm text-text-muted">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-background-surface rounded-card border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background-hover">
              <tr>
                <th className="text-left py-4 px-6 text-text-secondary font-semibold">User</th>
                <th className="text-left py-4 px-6 text-text-secondary font-semibold">Email</th>
                <th className="text-left py-4 px-6 text-text-secondary font-semibold">Role</th>
                <th className="text-left py-4 px-6 text-text-secondary font-semibold">Joined</th>
                <th className="text-left py-4 px-6 text-text-secondary font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.$id} className="border-t border-border hover:bg-background-hover">
                  <td className="py-4 px-6">
                    <div className="font-medium text-text-primary">{user.name}</div>
                    <div className="text-sm text-text-muted">{user.$id}</div>
                  </td>
                  <td className="py-4 px-6 text-text-primary">{user.email}</td>
                  <td className="py-4 px-6">
                    <Badge
                      variant={user.role === 'admin' ? 'primary' : 'neutral'}
                      size="sm"
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="py-4 px-6 text-text-secondary">
                    {formatDate(user.$createdAt)}
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => toggleUserRole(user.$id, user.role)}
                      className="text-primary hover:underline text-sm font-medium"
                    >
                      {user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12 bg-background-surface rounded-card border border-border mt-6">
          <p className="text-text-secondary">No users found</p>
        </div>
      )}
    </div>
  );
}
