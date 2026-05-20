import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import './App.css';
import { MainLayout } from './components/layout/MainLayout';
import { DashboardPage } from './pages/DashboardPage';
import { LogDataPage } from './pages/LogDataPage';
import { ProfilePage } from './pages/ProfilePage';
import { BlueprintPage } from './pages/BlueprintPage';
import { LoadingSpinner } from './components/common/LoadingSpinner';

export default function App() {
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    const initApp = async () => {
      try {
        setLoading(true);
        setError(null);

        // Initialize database
        await invoke('init_db');
        setInitialized(true);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        setError(`Failed to initialize: ${errorMsg}`);
        console.error('Init error:', err);
      } finally {
        setLoading(false);
      }
    };

    initApp();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950">
        <LoadingSpinner message="Initializing Aegis Health..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-red-400">Initialization Error</h2>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!initialized) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950">
        <div className="text-center">
          <p className="text-gray-400">Database not initialized</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'log':
        return <LogDataPage />;
      case 'profile':
        return <ProfilePage />;
      case 'blueprint':
        return <BlueprintPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <MainLayout activePage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </MainLayout>
  );
}
