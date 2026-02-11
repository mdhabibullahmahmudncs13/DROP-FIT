'use client';

import { useEffect, useState } from 'react';
import { databases, DATABASE_ID, DROPS_COLLECTION_ID } from '@/lib/appwrite/client';
import { formatDate } from '@/lib/utils';
import { PageLoader } from '@/components/ui/Loading';
import Badge from '@/components/ui/Badge';
import { Query } from 'appwrite';

type AdminDrop = {
  $id: string;
  name: string;
  description: string;
  status: string;
  launch_date: string;
  $createdAt: string;
};

export default function AdminDropsPage() {
  const [drops, setDrops] = useState<AdminDrop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDrops();
  }, []);

  async function fetchDrops() {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        DATABASE_ID,
        DROPS_COLLECTION_ID,
        [Query.orderDesc('launch_date'), Query.limit(100)]
      );
      setDrops(response.documents as unknown as AdminDrop[]);
    } catch (error) {
      console.error('Error fetching drops:', error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleDropStatus(dropId: string, currentStatus: string) {
    const newStatus = currentStatus === 'active' ? 'upcoming' : 'active';
    try {
      await databases.updateDocument(
        DATABASE_ID,
        DROPS_COLLECTION_ID,
        dropId,
        { status: newStatus }
      );
      setDrops((prev) =>
        prev.map((drop) =>
          drop.$id === dropId ? { ...drop, status: newStatus } : drop
        )
      );
    } catch (error) {
      console.error('Error updating drop:', error);
    }
  }

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-text-primary mb-2">Drops Management</h2>
        <p className="text-text-secondary">Manage upcoming and active product drops</p>
      </div>

      {/* Drops Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {drops.map((drop) => (
          <div
            key={drop.$id}
            className="bg-background-surface rounded-card border border-border p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-text-primary mb-1">{drop.name}</h3>
                <p className="text-text-secondary">{drop.description}</p>
              </div>
              <Badge
                variant={drop.status === 'active' ? 'success' : 'neutral'}
                size="md"
              >
                {drop.status}
              </Badge>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Launch Date</span>
                <span className="text-text-primary font-medium">{formatDate(drop.launch_date)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Created</span>
                <span className="text-text-primary">{formatDate(drop.$createdAt)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => toggleDropStatus(drop.$id, drop.status)}
                className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
              >
                {drop.status === 'active' ? 'Set Upcoming' : 'Activate'}
              </button>
              <button className="px-4 py-2 bg-background-hover text-text-primary rounded-lg font-medium hover:bg-background-card transition-colors">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {drops.length === 0 && (
        <div className="text-center py-12 bg-background-surface rounded-card border border-border">
          <p className="text-text-secondary mb-4">No drops found</p>
        </div>
      )}
    </div>
  );
}
