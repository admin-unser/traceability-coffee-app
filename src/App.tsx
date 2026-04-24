import { useState } from 'react';
import { BottomNav } from './components/ui/BottomNav';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { FarmPage } from './components/farm/FarmPage';
import { DiaryPage } from './components/diary/DiaryPage';
import { RevenuePage } from './components/revenue/RevenuePage';
import { DiaryForm } from './components/diary/DiaryForm';
import type { TabId } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [showQuickRecord, setShowQuickRecord] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-base-cream">
      {/* Main content */}
      <main className="max-w-lg mx-auto px-5 pt-6 pb-28">
        {activeTab === 'dashboard' && <DashboardPage key={`d-${refreshKey}`} />}
        {activeTab === 'farm' && <FarmPage key={`f-${refreshKey}`} />}
        {activeTab === 'diary' && <DiaryPage key={`di-${refreshKey}`} />}
        {activeTab === 'revenue' && <RevenuePage key={`r-${refreshKey}`} />}
      </main>

      {/* Bottom navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onFabClick={() => setShowQuickRecord(true)}
      />

      {/* Quick record modal (center FAB) */}
      <DiaryForm
        isOpen={showQuickRecord}
        onClose={() => setShowQuickRecord(false)}
        onSaved={() => setRefreshKey(k => k + 1)}
        initialDate={today}
      />
    </div>
  );
}
