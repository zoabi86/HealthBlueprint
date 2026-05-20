import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
  activePage?: string;
  onNavigate?: (page: string) => void;
}

const navigationItems = [
  { label: 'Dashboard', value: 'dashboard', icon: '📊' },
  { label: 'Log Data', value: 'log', icon: '📝' },
  { label: 'Profile', value: 'profile', icon: '👤' },
  { label: 'Blueprint', value: 'blueprint', icon: '🔬' },
  { label: 'Settings', value: 'settings', icon: '⚙️' },
];

export const MainLayout = ({ children, activePage = 'dashboard', onNavigate }: MainLayoutProps) => {
  return (
    <div className="h-screen flex flex-col bg-gray-950">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar items={navigationItems} active={activePage} onItemClick={onNavigate} />
        <main className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
};
