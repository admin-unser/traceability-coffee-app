import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { Activity } from './types';
import { storageService } from './services/storage';
import { themeService } from './services/theme';
import { Dashboard } from './components/Dashboard';
import { TreeMaster } from './components/TreeMaster';
import { Journal } from './components/Journal';
import { BackOffice } from './components/BackOffice';
import { MobileMenu, type MenuItem } from './components/MobileMenu';
import { ActivityForm } from './components/ActivityForm';
import { PageTransition, AnimatedModal } from './components/AnimatedComponents';

function App() {
  const [currentView, setCurrentView] = useState<MenuItem>('home');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | undefined>();

  useEffect(() => {
    loadActivities();
    // テーマを適用
    themeService.applyTheme(themeService.getTheme());
  }, []);

  const loadActivities = () => {
    const loaded = storageService.getAll();
    setActivities(loaded);
  };

  const handleSaveActivity = (activity: Activity) => {
    storageService.save(activity);
    loadActivities();
    setShowActivityForm(false);
    setEditingActivity(undefined);
  };

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setShowActivityForm(true);
  };

  const handleDeleteActivity = (id: string) => {
    storageService.delete(id);
    loadActivities();
  };

  const handleNavigate = (view: MenuItem) => {
    if (view === 'camera') {
      return;
    }
    setCurrentView(view);
  };

  const handleCameraClick = () => {
    setEditingActivity(undefined);
    setShowActivityForm(true);
  };

  const handleNewActivityFromJournal = () => {
    setEditingActivity(undefined);
    setShowActivityForm(true);
  };

  return (
    <div className="min-h-screen bg-base-warm dark:bg-gray-900 pb-24">
      {/* Header - Terracotta */}
      <header className="header-terracotta sticky top-0 z-40 shadow-soft">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Coffee Traceability" className="w-10 h-10" />
            <div>
              <h1 className="text-lg font-bold text-white">
                Coffee Traceability
              </h1>
              <p className="text-xs text-white/80">コーヒー栽培管理</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <PageTransition key="home">
              <Dashboard
                activities={activities}
                onActivityEdit={handleEditActivity}
                onActivityDelete={handleDeleteActivity}
              />
            </PageTransition>
          )}

          {currentView === 'trees' && (
            <PageTransition key="trees">
              <TreeMaster />
            </PageTransition>
          )}

          {currentView === 'journal' && (
            <PageTransition key="journal">
              <Journal
                activities={activities}
                onNewActivity={handleNewActivityFromJournal}
                onActivityEdit={handleEditActivity}
                onActivityDelete={handleDeleteActivity}
              />
            </PageTransition>
          )}

          {currentView === 'settings' && (
            <PageTransition key="settings">
              <BackOffice />
            </PageTransition>
          )}
        </AnimatePresence>
      </main>

      {/* Mobile Navigation */}
      <MobileMenu 
        currentView={currentView} 
        onNavigate={handleNavigate}
        onCameraClick={handleCameraClick}
      />

      {/* Activity Form Modal */}
      <AnimatedModal
        isOpen={showActivityForm}
        onClose={() => {
          setShowActivityForm(false);
          setEditingActivity(undefined);
        }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-soft-lg max-h-[90vh] overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-text-primary dark:text-white">
                {editingActivity ? '活動を編集' : '新しい活動を記録'}
              </h2>
              <button
                onClick={() => {
                  setShowActivityForm(false);
                  setEditingActivity(undefined);
                }}
                className="w-8 h-8 rounded-full bg-base-cream dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center text-text-secondary dark:text-gray-400 hover:text-text-primary dark:hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
          <div className="overflow-y-auto max-h-[calc(90vh-80px)] custom-scrollbar">
            <ActivityForm
              onSave={handleSaveActivity}
              onCancel={() => {
                setShowActivityForm(false);
                setEditingActivity(undefined);
              }}
              initialActivity={editingActivity}
            />
          </div>
        </div>
      </AnimatedModal>
    </div>
  );
}

export default App;
