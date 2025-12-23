import { useState } from 'react';
import { Plus } from 'lucide-react';
import type { Activity } from '../types';
import { ActivityForm } from './ActivityForm';
import { ActivityList } from './ActivityList';

interface WorkManagementProps {
  activities: Activity[];
  onActivitySave: (activity: Activity) => void;
  onActivityDelete: (id: string) => void;
}

export function WorkManagement({
  activities,
  onActivitySave,
  onActivityDelete,
}: WorkManagementProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | undefined>();

  const handleSave = (activity: Activity) => {
    onActivitySave(activity);
    setShowForm(false);
    setEditingActivity(undefined);
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">作業管理</h2>
        <button
          onClick={() => {
            setEditingActivity(undefined);
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-coffee-brown text-white rounded-lg hover:bg-coffee-green transition-colors"
        >
          <Plus className="w-5 h-5" />
          新規作業
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-800">
              {editingActivity ? '作業を編集' : '新しい作業を記録'}
            </h3>
          </div>
          <ActivityForm
            onSave={handleSave}
            onCancel={() => {
              setShowForm(false);
              setEditingActivity(undefined);
            }}
            initialActivity={editingActivity}
          />
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <ActivityList
          activities={activities}
          onEdit={(activity) => {
            setEditingActivity(activity);
            setShowForm(true);
          }}
          onDelete={onActivityDelete}
        />
      </div>
    </div>
  );
}

